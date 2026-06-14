"""Progress routes — member fitness progress tracking."""
from flask import Blueprint, request
from flask_jwt_extended import jwt_required
from app.models.progress import Progress, Measurements
from app.models.member import Member
from app.middleware.rbac import roles_required, get_current_user
from app.middleware.audit import log_audit
from app.utils.response import success_response, error_response
from app.utils.helpers import get_client_ip, calculate_bmi

progress_bp = Blueprint("progress", __name__)


@progress_bp.route("/member/<member_id>", methods=["GET"])
@jwt_required()
def get_member_progress(member_id):
    """Get all progress records for a member."""
    records = Progress.objects(member_id=member_id, is_deleted=False).order_by("-date")
    return success_response([r.to_dict() for r in records])


@progress_bp.route("", methods=["POST"])
@jwt_required()
@roles_required("SUPER_ADMIN", "GYM_OWNER", "TRAINER")
def add_progress():
    """Add a progress entry."""
    data = request.get_json() or {}
    member_id = data.get("memberId")
    member = Member.objects(id=member_id, is_deleted=False).first() if member_id else None

    weight = float(data.get("weight", 0))
    bmi = calculate_bmi(weight, member.height if member else 170)

    meas_data = data.get("measurements", {})
    measurements = Measurements(
        chest=float(meas_data.get("chest", 0)),
        waist=float(meas_data.get("waist", 0)),
        arms=float(meas_data.get("arms", 0)),
        neck=float(meas_data.get("neck", 0)),
        thigh=float(meas_data.get("thigh", 0)),
    )

    record = Progress(
        member_id=member.id if member else member_id,
        date=data.get("date", ""),
        weight=weight,
        bmi=bmi,
        body_fat_percent=float(data.get("bodyFatPct", 0)),
        measurements=measurements,
        before_photo_url=data.get("beforePhotoUrl", ""),
        after_photo_url=data.get("afterPhotoUrl", ""),
        notes=data.get("notes", ""),
        recorded_by=data.get("recordedBy", ""),
        gym_id=data.get("gym_id", "vikings"),
        branch_id=data.get("branch_id", "aurangabad"),
    )
    record.save()

    # Update member's weight and BMI
    if member:
        member.weight = weight
        member.bmi = bmi
        member.save()

    user = get_current_user()
    log_audit(user, "Logged fitness progress entry", "Health Metrics", get_client_ip())
    return success_response(record.to_dict(), "Progress recorded", status_code=201)


@progress_bp.route("/<record_id>", methods=["PUT"])
@jwt_required()
@roles_required("SUPER_ADMIN", "GYM_OWNER", "TRAINER")
def update_progress(record_id):
    """Update a progress entry."""
    record = Progress.objects(id=record_id, is_deleted=False).first()
    if not record:
        return error_response("Record not found", status_code=404)

    data = request.get_json() or {}
    if "weight" in data:
        record.weight = float(data["weight"])
    if "bodyFatPct" in data:
        record.body_fat_percent = float(data["bodyFatPct"])
    if "notes" in data:
        record.notes = data["notes"]
    if "measurements" in data:
        m = data["measurements"]
        record.measurements = Measurements(
            chest=float(m.get("chest", 0)), waist=float(m.get("waist", 0)),
            arms=float(m.get("arms", 0)), neck=float(m.get("neck", 0)),
            thigh=float(m.get("thigh", 0)),
        )
    record.save()
    return success_response(record.to_dict(), "Progress updated")


@progress_bp.route("/<record_id>", methods=["DELETE"])
@jwt_required()
@roles_required("SUPER_ADMIN", "GYM_OWNER", "TRAINER")
def delete_progress(record_id):
    record = Progress.objects(id=record_id, is_deleted=False).first()
    if not record:
        return error_response("Record not found", status_code=404)
    record.is_deleted = True
    record.save()
    return success_response(message="Progress entry deleted")


@progress_bp.route("/<record_id>/photos", methods=["POST"])
@jwt_required()
@roles_required("SUPER_ADMIN", "GYM_OWNER", "TRAINER")
def upload_photos(record_id):
    """Upload before/after photos for a progress entry."""
    record = Progress.objects(id=record_id, is_deleted=False).first()
    if not record:
        return error_response("Record not found", status_code=404)

    data = request.get_json() or {}
    if "beforePhotoUrl" in data:
        record.before_photo_url = data["beforePhotoUrl"]
    if "afterPhotoUrl" in data:
        record.after_photo_url = data["afterPhotoUrl"]
    record.save()
    return success_response(record.to_dict(), "Photos updated")


@progress_bp.route("/member/<member_id>/chart", methods=["GET"])
@jwt_required()
def progress_chart(member_id):
    """Get chart-ready progress data for a member."""
    records = Progress.objects(member_id=member_id, is_deleted=False).order_by("date")
    chart_data = [{
        "date": r.date,
        "weight": r.weight,
        "bmi": r.bmi,
        "bodyFatPct": r.body_fat_percent,
    } for r in records]
    return success_response(chart_data)
