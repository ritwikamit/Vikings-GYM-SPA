"""Equipment routes — CRUD + maintenance tracking."""
from flask import Blueprint, request
from flask_jwt_extended import jwt_required
from app.models.equipment import Equipment
from app.middleware.rbac import roles_required, get_current_user
from app.middleware.audit import log_audit
from app.utils.response import success_response, error_response, paginate_query
from app.utils.helpers import get_pagination_args, get_client_ip, today_str
from datetime import datetime, timedelta, timezone

equipment_bp = Blueprint("equipment", __name__)


@equipment_bp.route("", methods=["GET"])
@jwt_required()
@roles_required("SUPER_ADMIN", "GYM_OWNER")
def list_equipment():
    page, per_page = get_pagination_args()
    query = Equipment.objects(is_deleted=False)
    items, pagination = paginate_query(query.order_by("name"), page, per_page)
    return success_response([e.to_dict() for e in items], pagination=pagination)


@equipment_bp.route("", methods=["POST"])
@jwt_required()
@roles_required("SUPER_ADMIN", "GYM_OWNER")
def add_equipment():
    data = request.get_json() or {}
    eq = Equipment(
        name=data.get("name", ""),
        category=data.get("category", ""),
        purchase_date=data.get("purchaseDate", ""),
        purchase_price=float(data.get("purchasePrice", 0)),
        last_service_date=data.get("lastServiceDate", ""),
        next_service_date=data.get("nextServiceDate", ""),
        status=data.get("status", "Operational"),
        notes=data.get("notes", ""),
        gym_id=data.get("gym_id", "vikings"),
        branch_id=data.get("branch_id", "aurangabad"),
    )
    eq.save()
    return success_response(eq.to_dict(), "Equipment added", status_code=201)


@equipment_bp.route("/<eq_id>", methods=["PUT"])
@jwt_required()
@roles_required("SUPER_ADMIN", "GYM_OWNER")
def update_equipment(eq_id):
    eq = Equipment.objects(id=eq_id, is_deleted=False).first()
    if not eq:
        return error_response("Equipment not found", status_code=404)
    data = request.get_json() or {}
    for f in ["name", "category", "status", "notes"]:
        if f in data:
            setattr(eq, f, data[f])
    field_map = {"purchaseDate": "purchase_date", "lastServiceDate": "last_service_date",
                 "nextServiceDate": "next_service_date"}
    for camel, snake in field_map.items():
        if camel in data:
            setattr(eq, snake, data[camel])
    if "purchasePrice" in data:
        eq.purchase_price = float(data["purchasePrice"])
    eq.save()
    return success_response(eq.to_dict(), "Equipment updated")


@equipment_bp.route("/<eq_id>", methods=["DELETE"])
@jwt_required()
@roles_required("SUPER_ADMIN", "GYM_OWNER")
def delete_equipment(eq_id):
    eq = Equipment.objects(id=eq_id, is_deleted=False).first()
    if not eq:
        return error_response("Equipment not found", status_code=404)
    eq.is_deleted = True
    eq.save()
    return success_response(message="Equipment deleted")


@equipment_bp.route("/maintenance-due", methods=["GET"])
@jwt_required()
@roles_required("SUPER_ADMIN", "GYM_OWNER")
def maintenance_due():
    """Equipment needing service within 7 days."""
    today = datetime.now(timezone.utc).date()
    week_later = (today + timedelta(days=7)).strftime("%Y-%m-%d")
    today_s = today.strftime("%Y-%m-%d")
    equipment = Equipment.objects(is_deleted=False)
    due = [e.to_dict() for e in equipment
           if e.next_service_date and today_s <= e.next_service_date <= week_later]
    return success_response(due)


@equipment_bp.route("/<eq_id>/service", methods=["PUT"])
@jwt_required()
@roles_required("SUPER_ADMIN", "GYM_OWNER")
def mark_serviced(eq_id):
    """Mark equipment as serviced."""
    eq = Equipment.objects(id=eq_id, is_deleted=False).first()
    if not eq:
        return error_response("Equipment not found", status_code=404)
    data = request.get_json() or {}
    eq.last_service_date = today_str()
    eq.next_service_date = data.get("nextServiceDate", "")
    eq.status = "Operational"
    eq.save()

    user = get_current_user()
    log_audit(user, f"Serviced equipment {eq.name}", "Equipment", get_client_ip())
    return success_response(eq.to_dict(), "Equipment marked as serviced")
