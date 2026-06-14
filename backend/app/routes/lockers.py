"""Lockers routes."""
from flask import Blueprint, request
from flask_jwt_extended import jwt_required
from app.models.locker import Locker
from app.models.member import Member
from app.middleware.rbac import roles_required, get_current_user
from app.middleware.audit import log_audit
from app.utils.response import success_response, error_response
from app.utils.helpers import get_client_ip
from datetime import datetime, timezone
from dateutil.relativedelta import relativedelta

lockers_bp = Blueprint("lockers", __name__)


@lockers_bp.route("", methods=["GET"])
@jwt_required()
@roles_required("SUPER_ADMIN", "GYM_OWNER", "RECEPTIONIST")
def list_lockers():
    lockers = Locker.objects(is_deleted=False).order_by("locker_number")
    return success_response([l.to_dict() for l in lockers])


@lockers_bp.route("", methods=["POST"])
@jwt_required()
@roles_required("SUPER_ADMIN", "GYM_OWNER")
def add_locker():
    data = request.get_json() or {}
    locker = Locker(
        locker_number=data.get("number", ""),
        rent=float(data.get("rentAmount", 0)),
        status="Available",
        gym_id=data.get("gym_id", "vikings"),
        branch_id=data.get("branch_id", "aurangabad"),
    )
    locker.save()
    return success_response(locker.to_dict(), "Locker added", status_code=201)


@lockers_bp.route("/<locker_id>/assign", methods=["PUT"])
@jwt_required()
@roles_required("SUPER_ADMIN", "GYM_OWNER", "RECEPTIONIST")
def assign_locker(locker_id):
    locker = Locker.objects(id=locker_id, is_deleted=False).first()
    if not locker:
        return error_response("Locker not found", status_code=404)

    data = request.get_json() or {}
    member_id = data.get("memberId")
    member = Member.objects(id=member_id, is_deleted=False).first() if member_id else None

    months = int(data.get("months", 1))
    start = datetime.now(timezone.utc)
    end = start + relativedelta(months=months)

    locker.status = "Occupied"
    locker.member_id = member.id if member else None
    locker.member_name = member.name if member else ""
    locker.start_date = start.strftime("%Y-%m-%d")
    locker.end_date = end.strftime("%Y-%m-%d")
    locker.rent = float(data.get("rent", data.get("rentAmount", locker.rent)))
    locker.save()

    user = get_current_user()
    log_audit(user, f"Assigned locker {locker.locker_number} to {locker.member_name}", "Facilities", get_client_ip())
    return success_response(locker.to_dict(), "Locker assigned")


@lockers_bp.route("/<locker_id>/release", methods=["PUT"])
@jwt_required()
@roles_required("SUPER_ADMIN", "GYM_OWNER", "RECEPTIONIST")
def release_locker(locker_id):
    locker = Locker.objects(id=locker_id, is_deleted=False).first()
    if not locker:
        return error_response("Locker not found", status_code=404)

    locker.status = "Available"
    locker.member_id = None
    locker.member_name = ""
    locker.start_date = ""
    locker.end_date = ""
    locker.save()

    user = get_current_user()
    log_audit(user, f"Released locker {locker.locker_number}", "Facilities", get_client_ip())
    return success_response(locker.to_dict(), "Locker released")


@lockers_bp.route("/available", methods=["GET"])
@jwt_required()
def available_lockers():
    lockers = Locker.objects(status="Available", is_deleted=False)
    return success_response([l.to_dict() for l in lockers])
