"""Leads routes — CRM pipeline management."""
from flask import Blueprint, request
from flask_jwt_extended import jwt_required
from app.models.lead import Lead
from app.middleware.rbac import roles_required, get_current_user
from app.middleware.audit import log_audit
from app.utils.response import success_response, error_response, paginate_query
from app.utils.helpers import get_pagination_args, get_client_ip

leads_bp = Blueprint("leads", __name__)


@leads_bp.route("", methods=["GET"])
@jwt_required()
@roles_required("SUPER_ADMIN", "GYM_OWNER", "RECEPTIONIST")
def list_leads():
    """List leads with filters."""
    page, per_page = get_pagination_args()
    status = request.args.get("status", "")
    source = request.args.get("source", "")
    query = Lead.objects(is_deleted=False)
    if status:
        query = query.filter(status=status)
    if source:
        query = query.filter(source=source)
    items, pagination = paginate_query(query.order_by("-created_at"), page, per_page)
    return success_response([l.to_dict() for l in items], pagination=pagination)


@leads_bp.route("", methods=["POST"])
@jwt_required()
@roles_required("SUPER_ADMIN", "GYM_OWNER", "RECEPTIONIST")
def create_lead():
    """Create a new lead."""
    data = request.get_json() or {}
    lead = Lead(
        name=data.get("name", ""),
        phone=data.get("phone", ""),
        email=data.get("email", ""),
        source=data.get("source", "WalkIn"),
        status=data.get("stage", "New"),
        notes=data.get("notes", ""),
        follow_up_date=data.get("followUpDate", ""),
        gym_id=data.get("gym_id", "vikings"),
        branch_id=data.get("branch_id", "aurangabad"),
    )
    lead.save()

    user = get_current_user()
    log_audit(user, f"Created lead {lead.name}", "CRM Module", get_client_ip())
    return success_response(lead.to_dict(), "Lead created", status_code=201)


@leads_bp.route("/<lead_id>", methods=["PUT"])
@jwt_required()
@roles_required("SUPER_ADMIN", "GYM_OWNER", "RECEPTIONIST")
def update_lead(lead_id):
    """Update lead details."""
    lead = Lead.objects(id=lead_id, is_deleted=False).first()
    if not lead:
        return error_response("Lead not found", status_code=404)

    data = request.get_json() or {}
    for f in ["name", "phone", "email", "source", "notes"]:
        if f in data:
            setattr(lead, f, data[f])
    if "followUpDate" in data:
        lead.follow_up_date = data["followUpDate"]
    if "stage" in data:
        lead.status = data["stage"]
    lead.save()

    user = get_current_user()
    log_audit(user, f"Updated lead {lead.name}", "CRM Module", get_client_ip())
    return success_response(lead.to_dict(), "Lead updated")


@leads_bp.route("/<lead_id>/status", methods=["PUT"])
@jwt_required()
@roles_required("SUPER_ADMIN", "GYM_OWNER", "RECEPTIONIST")
def update_lead_status(lead_id):
    """Move lead through pipeline stages."""
    data = request.get_json() or {}
    lead = Lead.objects(id=lead_id, is_deleted=False).first()
    if not lead:
        return error_response("Lead not found", status_code=404)

    new_status = data.get("stage", data.get("status", ""))
    if new_status:
        lead.status = new_status
        if new_status == "Converted":
            from datetime import datetime, timezone
            lead.converted_at = datetime.now(timezone.utc)
        lead.save()

    user = get_current_user()
    log_audit(user, f"Moved lead {lead.name} to {lead.status}", "CRM Module", get_client_ip())
    return success_response(lead.to_dict(), f"Lead moved to {lead.status}")


@leads_bp.route("/<lead_id>", methods=["DELETE"])
@jwt_required()
@roles_required("SUPER_ADMIN", "GYM_OWNER")
def delete_lead(lead_id):
    """Delete a lead."""
    lead = Lead.objects(id=lead_id, is_deleted=False).first()
    if not lead:
        return error_response("Lead not found", status_code=404)
    lead.is_deleted = True
    lead.save()
    return success_response(message="Lead deleted")


@leads_bp.route("/kanban", methods=["GET"])
@jwt_required()
@roles_required("SUPER_ADMIN", "GYM_OWNER", "RECEPTIONIST")
def kanban_view():
    """Get leads grouped by status for Kanban board."""
    leads = Lead.objects(is_deleted=False)
    grouped = {}
    for lead in leads:
        stage = lead.status or "New"
        if stage not in grouped:
            grouped[stage] = []
        grouped[stage].append(lead.to_dict())
    return success_response(grouped)


@leads_bp.route("/<lead_id>/followup", methods=["POST"])
@jwt_required()
@roles_required("SUPER_ADMIN", "GYM_OWNER", "RECEPTIONIST")
def set_followup(lead_id):
    """Set follow-up reminder for a lead."""
    data = request.get_json() or {}
    lead = Lead.objects(id=lead_id, is_deleted=False).first()
    if not lead:
        return error_response("Lead not found", status_code=404)

    lead.follow_up_date = data.get("followUpDate", "")
    lead.notes = data.get("notes", lead.notes)
    lead.save()
    return success_response(lead.to_dict(), "Follow-up set")


@leads_bp.route("/analytics", methods=["GET"])
@jwt_required()
@roles_required("SUPER_ADMIN", "GYM_OWNER")
def lead_analytics():
    """Lead conversion analytics by source."""
    leads = Lead.objects(is_deleted=False)
    by_source = {}
    by_status = {}
    for lead in leads:
        src = lead.source or "Other"
        by_source[src] = by_source.get(src, 0) + 1
        st = lead.status or "New"
        by_status[st] = by_status.get(st, 0) + 1

    total = leads.count()
    converted = Lead.objects(status="Converted", is_deleted=False).count()

    return success_response({
        "total": total,
        "converted": converted,
        "conversionRate": round((converted / total * 100), 1) if total > 0 else 0,
        "bySource": by_source,
        "byStatus": by_status,
    })
