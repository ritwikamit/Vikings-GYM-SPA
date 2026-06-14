"""Analytics routes — KPI summary and trends."""
from datetime import datetime, timedelta, timezone
from flask import Blueprint
from flask_jwt_extended import jwt_required
from app.models.member import Member
from app.models.membership import Membership
from app.models.attendance import Attendance
from app.models.payment import Payment
from app.models.lead import Lead
from app.models.trainer import Trainer
from app.models.expense import Expense
from app.models.pt_session import PtSession
from app.middleware.rbac import roles_required
from app.utils.response import success_response

analytics_bp = Blueprint("analytics", __name__)


@analytics_bp.route("/dashboard", methods=["GET"])
@jwt_required()
@roles_required("SUPER_ADMIN", "GYM_OWNER", "RECEPTIONIST")
def dashboard_kpi():
    """KPI summary — members, revenue, attendance."""
    today = datetime.now(timezone.utc)
    today_str = today.strftime("%Y-%m-%d")
    month_ago = (today - timedelta(days=30)).strftime("%Y-%m-%d")

    total_members = Member.objects(is_deleted=False).count()
    active_memberships = Membership.objects(status="ACTIVE", is_deleted=False).count()
    today_attendance = Attendance.objects(date=today_str, is_deleted=False).count()
    monthly_revenue = sum(
        (p.final_amount or p.amount)
        for p in Payment.objects(status="PAID", is_deleted=False, date__gte=month_ago)
    )

    return success_response({
        "totalMembers": total_members,
        "activeMemberships": active_memberships,
        "todayAttendance": today_attendance,
        "monthlyRevenue": monthly_revenue,
    })


@analytics_bp.route("/revenue", methods=["GET"])
@jwt_required()
@roles_required("SUPER_ADMIN", "GYM_OWNER")
def revenue_trend():
    """Monthly revenue trend (12 months)."""
    today = datetime.now(timezone.utc)
    months = []
    for i in range(12):
        d = today - timedelta(days=30 * i)
        month_key = d.strftime("%Y-%m")
        start = d.replace(day=1).strftime("%Y-%m-%d")
        end = (d.replace(day=1) + timedelta(days=32)).replace(day=1).strftime("%Y-%m-%d")
        total = sum(
            (p.final_amount or p.amount)
            for p in Payment.objects(status="PAID", is_deleted=False, date__gte=start, date__lt=end)
        )
        months.append({"month": month_key, "revenue": total})
    return success_response(list(reversed(months)))


@analytics_bp.route("/members", methods=["GET"])
@jwt_required()
@roles_required("SUPER_ADMIN", "GYM_OWNER")
def member_growth():
    """Member growth chart."""
    today = datetime.now(timezone.utc)
    growth = []
    for i in range(12):
        d = today - timedelta(days=30 * i)
        cutoff = d.strftime("%Y-%m-%d")
        count = Member.objects(is_deleted=False, joined_date__lte=cutoff).count()
        growth.append({"month": d.strftime("%Y-%m"), "totalMembers": count})
    return success_response(list(reversed(growth)))


@analytics_bp.route("/attendance", methods=["GET"])
@jwt_required()
@roles_required("SUPER_ADMIN", "GYM_OWNER", "RECEPTIONIST")
def attendance_trend():
    """Daily attendance for last 30 days."""
    today = datetime.now(timezone.utc)
    trend = []
    for i in range(30):
        d = (today - timedelta(days=i)).strftime("%Y-%m-%d")
        count = Attendance.objects(date=d, is_deleted=False).count()
        trend.append({"date": d, "count": count})
    return success_response(list(reversed(trend)))


@analytics_bp.route("/leads", methods=["GET"])
@jwt_required()
@roles_required("SUPER_ADMIN", "GYM_OWNER")
def lead_funnel():
    """Lead conversion funnel by source."""
    leads = Lead.objects(is_deleted=False)
    by_source = {}
    for lead in leads:
        src = lead.source or "Other"
        if src not in by_source:
            by_source[src] = {"total": 0, "converted": 0}
        by_source[src]["total"] += 1
        if lead.status == "Converted":
            by_source[src]["converted"] += 1
    return success_response(by_source)


@analytics_bp.route("/trainers", methods=["GET"])
@jwt_required()
@roles_required("SUPER_ADMIN", "GYM_OWNER")
def trainer_metrics():
    """Trainer performance metrics."""
    trainers = Trainer.objects(is_deleted=False)
    metrics = []
    for t in trainers:
        sessions = PtSession.objects(trainer_id=t.id, is_deleted=False)
        completed = sum(s.sessions_completed for s in sessions)
        clients = len(set(str(s.member_id.id) for s in sessions if s.member_id))
        metrics.append({
            "trainerId": str(t.id),
            "name": t.name,
            "sessionsCompleted": completed,
            "activeClients": clients,
            "rating": t.rating,
        })
    return success_response(metrics)


@analytics_bp.route("/expenses", methods=["GET"])
@jwt_required()
@roles_required("SUPER_ADMIN", "GYM_OWNER")
def expense_breakdown():
    """Expense breakdown and P&L."""
    expenses = Expense.objects(is_deleted=False)
    by_cat = {}
    total_exp = 0
    for e in expenses:
        cat = e.category or "Other"
        by_cat[cat] = by_cat.get(cat, 0) + e.amount
        total_exp += e.amount

    total_rev = sum((p.final_amount or p.amount) for p in Payment.objects(status="PAID", is_deleted=False))

    return success_response({
        "totalExpenses": total_exp,
        "totalRevenue": total_rev,
        "profitLoss": total_rev - total_exp,
        "byCategory": by_cat,
    })


@analytics_bp.route("/pt", methods=["GET"])
@jwt_required()
@roles_required("SUPER_ADMIN", "GYM_OWNER")
def pt_stats():
    """PT revenue and session statistics."""
    sessions = PtSession.objects(is_deleted=False)
    total = sessions.count()
    completed = sum(s.sessions_completed for s in sessions)
    return success_response({
        "totalPtAssigned": total,
        "totalSessionsCompleted": completed,
    })
