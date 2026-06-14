"""Attendance routes — check-in, check-out, analytics."""
from datetime import datetime, timezone, timedelta
from flask import Blueprint, request
from flask_jwt_extended import jwt_required
from app.models.attendance import Attendance
from app.models.member import Member
from app.models.membership import Membership
from app.middleware.rbac import roles_required, get_current_user
from app.middleware.audit import log_audit
from app.utils.response import success_response, error_response, paginate_query
from app.utils.helpers import get_pagination_args, today_str, get_client_ip

attendance_bp = Blueprint("attendance", __name__)


@attendance_bp.route("/checkin", methods=["POST"])
@jwt_required()
@roles_required("SUPER_ADMIN", "GYM_OWNER", "RECEPTIONIST", "TRAINER")
def checkin():
    """Check in a member (QR or manual)."""
    data = request.get_json() or {}
    member_id = data.get("memberId")
    method = data.get("method", "QR")

    if not member_id:
        return error_response("memberId is required")

    member = Member.objects(id=member_id, is_deleted=False).first()
    if not member:
        return error_response("Member not found", status_code=404)

    # Validate active membership
    active = Membership.objects(
        member_id=member.id, status="ACTIVE", is_deleted=False
    ).first()
    if not active:
        return error_response("No active membership. Access denied.")

    # Check if already checked in today
    today = today_str()
    existing = Attendance.objects(
        member_id=member.id, date=today, check_out=None, is_deleted=False
    ).first()
    if existing:
        return error_response("Already checked in today!")

    now = datetime.now(timezone.utc)
    att = Attendance(
        member_id=member.id,
        member_name=member.name,
        member_email=member.email,
        check_in=now,
        method=method,
        date=today,
        gym_id=member.gym_id,
        branch_id=member.branch_id,
    )
    att.save()

    user = get_current_user()
    log_audit(user, f"Checked in {member.name}", "Attendance", get_client_ip())

    return success_response(att.to_dict(), f"Welcome {member.name}!", status_code=201)


@attendance_bp.route("/checkout", methods=["POST"])
@jwt_required()
@roles_required("SUPER_ADMIN", "GYM_OWNER", "RECEPTIONIST", "TRAINER")
def checkout():
    """Check out a member."""
    data = request.get_json() or {}
    member_id = data.get("memberId")
    if not member_id:
        return error_response("memberId is required")

    today = today_str()
    att = Attendance.objects(
        member_id=member_id, date=today, check_out=None, is_deleted=False
    ).first()
    if not att:
        return error_response("No active check-in found for today")

    att.check_out = datetime.now(timezone.utc)
    att.save()

    user = get_current_user()
    log_audit(user, f"Checked out {att.member_name}", "Attendance", get_client_ip())

    return success_response(att.to_dict(), "Checked out successfully")


@attendance_bp.route("", methods=["GET"])
@jwt_required()
@roles_required("SUPER_ADMIN", "GYM_OWNER", "RECEPTIONIST", "TRAINER")
def list_attendance():
    """List attendance records with filters."""
    page, per_page = get_pagination_args()
    date_filter = request.args.get("date", "")
    member_id = request.args.get("memberId", "")

    query = Attendance.objects(is_deleted=False)
    if date_filter:
        query = query.filter(date=date_filter)
    if member_id:
        query = query.filter(member_id=member_id)

    items, pagination = paginate_query(query.order_by("-check_in"), page, per_page)
    return success_response([a.to_dict() for a in items], pagination=pagination)


@attendance_bp.route("/today", methods=["GET"])
@jwt_required()
@roles_required("SUPER_ADMIN", "GYM_OWNER", "RECEPTIONIST", "TRAINER")
def today_attendance():
    """Get today's attendance."""
    today = today_str()
    records = Attendance.objects(date=today, is_deleted=False).order_by("-check_in")
    return success_response([a.to_dict() for a in records])


@attendance_bp.route("/analytics", methods=["GET"])
@jwt_required()
@roles_required("SUPER_ADMIN", "GYM_OWNER", "RECEPTIONIST")
def attendance_analytics():
    """Get attendance statistics (daily/weekly/monthly)."""
    today = datetime.now(timezone.utc)
    today_str_val = today.strftime("%Y-%m-%d")

    # Daily count
    daily = Attendance.objects(date=today_str_val, is_deleted=False).count()

    # Weekly count
    week_ago = (today - timedelta(days=7)).strftime("%Y-%m-%d")
    weekly = Attendance.objects(date__gte=week_ago, is_deleted=False).count()

    # Monthly count
    month_ago = (today - timedelta(days=30)).strftime("%Y-%m-%d")
    monthly = Attendance.objects(date__gte=month_ago, is_deleted=False).count()

    # Daily breakdown for last 7 days
    daily_breakdown = []
    for i in range(7):
        d = (today - timedelta(days=i)).strftime("%Y-%m-%d")
        count = Attendance.objects(date=d, is_deleted=False).count()
        daily_breakdown.append({"date": d, "count": count})

    return success_response({
        "daily": daily,
        "weekly": weekly,
        "monthly": monthly,
        "dailyBreakdown": daily_breakdown,
    })


@attendance_bp.route("/heatmap", methods=["GET"])
@jwt_required()
@roles_required("SUPER_ADMIN", "GYM_OWNER", "RECEPTIONIST")
def attendance_heatmap():
    """Get attendance heatmap data for the last 30 days."""
    today = datetime.now(timezone.utc)
    heatmap = []
    for i in range(30):
        d = (today - timedelta(days=i)).strftime("%Y-%m-%d")
        count = Attendance.objects(date=d, is_deleted=False).count()
        heatmap.append({"date": d, "count": count})
    return success_response(heatmap)


@attendance_bp.route("/peak-hours", methods=["GET"])
@jwt_required()
@roles_required("SUPER_ADMIN", "GYM_OWNER", "RECEPTIONIST")
def peak_hours():
    """Analyze peak hours from recent attendance data."""
    today = datetime.now(timezone.utc)
    week_ago = (today - timedelta(days=7)).strftime("%Y-%m-%d")
    records = Attendance.objects(date__gte=week_ago, is_deleted=False)

    hours = {}
    for r in records:
        if r.check_in:
            h = r.check_in.hour
            hours[h] = hours.get(h, 0) + 1

    peak_data = [{"hour": h, "count": c} for h, c in sorted(hours.items())]
    return success_response(peak_data)
