"""Dashboard routes — stats and alerts."""
from datetime import datetime, timedelta, timezone
from flask import Blueprint
from flask_jwt_extended import jwt_required
from app.models.member import Member
from app.models.membership import Membership
from app.models.attendance import Attendance
from app.models.payment import Payment
from app.models.equipment import Equipment
from app.models.inventory import Inventory
from app.middleware.rbac import roles_required
from app.utils.response import success_response

dashboard_bp = Blueprint("dashboard", __name__)


@dashboard_bp.route("/stats", methods=["GET"])
@jwt_required()
@roles_required("SUPER_ADMIN", "GYM_OWNER", "RECEPTIONIST")
def stats():
    """Dashboard stats — total/active/expired members, today revenue, today attendance."""
    today = datetime.now(timezone.utc)
    today_str = today.strftime("%Y-%m-%d")

    total_members = Member.objects(is_deleted=False).count()
    active = Membership.objects(status="ACTIVE", is_deleted=False).count()
    expired = Membership.objects(status="EXPIRED", is_deleted=False).count()
    today_attendance = Attendance.objects(date=today_str, is_deleted=False).count()
    today_revenue = sum(
        (p.final_amount or p.amount)
        for p in Payment.objects(status="PAID", date=today_str, is_deleted=False)
    )

    return success_response({
        "totalMembers": total_members,
        "activeMembers": active,
        "expiredMembers": expired,
        "todayAttendance": today_attendance,
        "todayRevenue": today_revenue,
    })


@dashboard_bp.route("/alerts", methods=["GET"])
@jwt_required()
@roles_required("SUPER_ADMIN", "GYM_OWNER", "RECEPTIONIST")
def alerts():
    """Dashboard alerts — expiring memberships, maintenance due, low stock."""
    today = datetime.now(timezone.utc)
    week_later = (today + timedelta(days=7)).strftime("%Y-%m-%d")
    today_str = today.strftime("%Y-%m-%d")

    # Expiring memberships
    expiring = Membership.objects(
        status="ACTIVE", is_deleted=False,
        end_date__gte=today_str, end_date__lte=week_later,
    )
    expiring_list = []
    for m in expiring:
        try:
            member = Member.objects(id=m.member_id.id).first()
            expiring_list.append({
                "memberId": str(m.member_id.id),
                "memberName": member.name if member else "",
                "planName": m.plan_name,
                "endDate": m.end_date,
            })
        except Exception:
            pass

    # Equipment maintenance due
    equipment = Equipment.objects(is_deleted=False)
    maintenance = [e.to_dict() for e in equipment
                   if e.next_service_date and today_str <= e.next_service_date <= week_later]

    # Low stock
    inventory = Inventory.objects(is_deleted=False)
    low_stock = [i.to_dict() for i in inventory
                 if i.quantity <= i.low_stock_threshold]

    return success_response({
        "expiringMemberships": expiring_list,
        "maintenanceDue": maintenance,
        "lowStock": low_stock,
    })
