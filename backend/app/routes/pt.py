"""PT (Personal Training) routes — packages + sessions."""
from flask import Blueprint, request
from flask_jwt_extended import jwt_required
from app.models.pt_package import PtPackage
from app.models.pt_session import PtSession, SessionLog
from app.models.member import Member
from app.models.trainer import Trainer
from app.middleware.rbac import roles_required, get_current_user
from app.middleware.audit import log_audit
from app.utils.response import success_response, error_response, paginate_query
from app.utils.helpers import get_pagination_args, get_client_ip, today_str

pt_bp = Blueprint("pt", __name__)


# --- Packages ---

@pt_bp.route("/packages", methods=["GET"])
@jwt_required()
def list_packages():
    packages = PtPackage.objects(is_deleted=False)
    return success_response([p.to_dict() for p in packages])


@pt_bp.route("/packages", methods=["POST"])
@jwt_required()
@roles_required("SUPER_ADMIN", "GYM_OWNER")
def create_package():
    data = request.get_json() or {}
    pkg = PtPackage(
        name=data.get("name", ""),
        sessions_total=int(data.get("sessionsCount", 0)),
        price=float(data.get("price", 0)),
        validity_days=int(data.get("validityDays", 30)),
        trainer_commission_percent=float(data.get("trainerCommissionPercent", 0)),
        gym_id=data.get("gym_id", "vikings"),
        branch_id=data.get("branch_id", "aurangabad"),
    )
    trainer_id = data.get("trainerId")
    if trainer_id:
        trainer = Trainer.objects(id=trainer_id).first()
        if trainer:
            pkg.trainer_id = trainer.id
            pkg.trainer_name = trainer.name
    pkg.save()
    return success_response(pkg.to_dict(), "Package created", status_code=201)


@pt_bp.route("/packages/<pkg_id>", methods=["PUT"])
@jwt_required()
@roles_required("SUPER_ADMIN", "GYM_OWNER")
def update_package(pkg_id):
    pkg = PtPackage.objects(id=pkg_id, is_deleted=False).first()
    if not pkg:
        return error_response("Package not found", status_code=404)
    data = request.get_json() or {}
    for f in ["name"]:
        if f in data:
            setattr(pkg, f, data[f])
    if "sessionsCount" in data:
        pkg.sessions_total = int(data["sessionsCount"])
    if "price" in data:
        pkg.price = float(data["price"])
    if "validityDays" in data:
        pkg.validity_days = int(data["validityDays"])
    pkg.save()
    return success_response(pkg.to_dict(), "Package updated")


@pt_bp.route("/packages/<pkg_id>", methods=["DELETE"])
@jwt_required()
@roles_required("SUPER_ADMIN", "GYM_OWNER")
def delete_package(pkg_id):
    pkg = PtPackage.objects(id=pkg_id, is_deleted=False).first()
    if not pkg:
        return error_response("Package not found", status_code=404)
    pkg.is_deleted = True
    pkg.save()
    return success_response(message="Package deleted")


# --- Sessions ---

@pt_bp.route("/sessions", methods=["GET"])
@jwt_required()
def list_sessions():
    page, per_page = get_pagination_args()
    query = PtSession.objects(is_deleted=False)
    items, pagination = paginate_query(query.order_by("-created_at"), page, per_page)
    return success_response([s.to_dict() for s in items], pagination=pagination)


@pt_bp.route("/sessions", methods=["POST"])
@jwt_required()
@roles_required("SUPER_ADMIN", "GYM_OWNER", "RECEPTIONIST", "TRAINER")
def create_session():
    """Assign PT sessions to a member."""
    data = request.get_json() or {}
    member = Member.objects(id=data.get("memberId"), is_deleted=False).first()
    trainer = Trainer.objects(id=data.get("trainerId"), is_deleted=False).first()
    if not member or not trainer:
        return error_response("Member or trainer not found", status_code=404)

    session = PtSession(
        member_id=member.id,
        member_name=member.name,
        trainer_id=trainer.id,
        trainer_name=trainer.name,
        sessions_total=int(data.get("totalSessions", data.get("sessionsCount", 10))),
        sessions_completed=0,
        start_date=data.get("startDate", today_str()),
        end_date=data.get("endDate", ""),
        scheduled_date=data.get("scheduledDate", ""),
        scheduled_time=data.get("scheduledTime", ""),
        gym_id=data.get("gym_id", "vikings"),
        branch_id=data.get("branch_id", "aurangabad"),
    )

    pkg_id = data.get("packageId")
    if pkg_id:
        pkg = PtPackage.objects(id=pkg_id).first()
        if pkg:
            session.package_id = pkg.id
            session.sessions_total = pkg.sessions_total

    session.save()

    user = get_current_user()
    log_audit(user, f"Assigned PT sessions to {member.name}", "PT Module", get_client_ip())
    return success_response(session.to_dict(), "PT sessions assigned", status_code=201)


@pt_bp.route("/sessions/<session_id>/log", methods=["PUT"])
@jwt_required()
@roles_required("SUPER_ADMIN", "GYM_OWNER", "TRAINER")
def log_session(session_id):
    """Log a completed PT session."""
    session = PtSession.objects(id=session_id, is_deleted=False).first()
    if not session:
        return error_response("Session not found", status_code=404)

    data = request.get_json() or {}
    log_entry = SessionLog(
        date=data.get("date", today_str()),
        notes=data.get("notes", ""),
        trainer_id=data.get("trainerId", str(session.trainer_id.id) if session.trainer_id else ""),
    )
    session.session_logs.append(log_entry)
    session.sessions_completed += 1
    session.save()

    user = get_current_user()
    log_audit(user, f"Logged PT session for {session.member_name}", "PT Module", get_client_ip())
    return success_response(session.to_dict(), "Session logged")


@pt_bp.route("/sessions/<session_id>", methods=["GET"])
@jwt_required()
def get_session(session_id):
    session = PtSession.objects(id=session_id, is_deleted=False).first()
    if not session:
        return error_response("Session not found", status_code=404)
    return success_response(session.to_dict())


@pt_bp.route("/analytics", methods=["GET"])
@jwt_required()
@roles_required("SUPER_ADMIN", "GYM_OWNER")
def pt_analytics():
    """PT revenue and trainer performance."""
    sessions = PtSession.objects(is_deleted=False)
    total_sessions = sum(s.sessions_completed for s in sessions)
    packages = PtPackage.objects(is_deleted=False)
    total_revenue = sum(p.price for p in packages) if packages else 0

    trainer_stats = {}
    for s in sessions:
        tid = str(s.trainer_id.id) if s.trainer_id else "Unknown"
        if tid not in trainer_stats:
            trainer_stats[tid] = {"name": s.trainer_name, "sessions": 0, "clients": set()}
        trainer_stats[tid]["sessions"] += s.sessions_completed
        trainer_stats[tid]["clients"].add(str(s.member_id.id) if s.member_id else "")

    trainer_perf = [
        {"trainerId": tid, "trainerName": d["name"],
         "sessionsCompleted": d["sessions"], "clients": len(d["clients"])}
        for tid, d in trainer_stats.items()
    ]

    return success_response({
        "totalSessionsCompleted": total_sessions,
        "totalPtRevenue": total_revenue,
        "trainerPerformance": trainer_perf,
    })
