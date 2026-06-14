"""Trainers routes — CRUD + clients, performance, schedule."""
from flask import Blueprint, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.models.trainer import Trainer
from app.models.member import Member
from app.models.pt_session import PtSession
from app.models.workout import Workout
from app.middleware.rbac import roles_required, get_current_user
from app.middleware.audit import log_audit
from app.utils.response import success_response, error_response, paginate_query
from app.utils.helpers import get_pagination_args, get_client_ip

trainers_bp = Blueprint("trainers", __name__)


@trainers_bp.route("", methods=["GET"])
@jwt_required(optional=True)
def list_trainers():
    """List all trainers. Public endpoint with restricted fields for unauthenticated users."""
    from app.models.user import User
    identity = get_jwt_identity()
    user = User.objects(id=identity, is_deleted=False).first() if identity else None
    is_staff = user and user.role in ["SUPER_ADMIN", "GYM_OWNER", "RECEPTIONIST", "TRAINER"]

    page, per_page = get_pagination_args()
    query = Trainer.objects(is_deleted=False)
    status = request.args.get("status", "")
    if status:
        query = query.filter(status=status)
    items, pagination = paginate_query(query.order_by("name"), page, per_page)
    
    res = []
    for t in items:
        d = t.to_dict()
        if not is_staff:
            d.pop("salary", None)
            d.pop("commissionRate", None)
            d.pop("commission_percent", None)
        res.append(d)
        
    return success_response(res, pagination=pagination)


@trainers_bp.route("", methods=["POST"])
@jwt_required()
@roles_required("SUPER_ADMIN", "GYM_OWNER")
def create_trainer():
    """Add a new trainer."""
    data = request.get_json() or {}
    trainer = Trainer(
        name=data.get("name", ""),
        phone=data.get("phone", ""),
        email=data.get("email", ""),
        experience_years=int(data.get("experienceYears", 0)),
        certifications=data.get("certifications", []),
        specializations=data.get("specializations", []),
        salary=float(data.get("salary", 0)),
        commission_percent=float(data.get("commissionRate", 0)),
        rating=float(data.get("rating", 0)),
        gym_id=data.get("gym_id", "vikings"),
        branch_id=data.get("branch_id", "aurangabad"),
    )
    trainer.save()

    user = get_current_user()
    log_audit(user, f"Added trainer {trainer.name}", "Trainers", get_client_ip())

    return success_response(trainer.to_dict(), "Trainer added", status_code=201)


@trainers_bp.route("/<trainer_id>", methods=["GET"])
@jwt_required()
def get_trainer(trainer_id):
    """Get trainer profile."""
    trainer = Trainer.objects(id=trainer_id, is_deleted=False).first()
    if not trainer:
        return error_response("Trainer not found", status_code=404)
    return success_response(trainer.to_dict())


@trainers_bp.route("/<trainer_id>", methods=["PUT"])
@jwt_required()
@roles_required("SUPER_ADMIN", "GYM_OWNER")
def update_trainer(trainer_id):
    """Update trainer profile."""
    trainer = Trainer.objects(id=trainer_id, is_deleted=False).first()
    if not trainer:
        return error_response("Trainer not found", status_code=404)

    data = request.get_json() or {}
    for field in ["name", "phone", "email", "status"]:
        if field in data:
            setattr(trainer, field, data[field])
    if "experienceYears" in data:
        trainer.experience_years = int(data["experienceYears"])
    if "certifications" in data:
        trainer.certifications = data["certifications"]
    if "specializations" in data:
        trainer.specializations = data["specializations"]
    if "salary" in data:
        trainer.salary = float(data["salary"])
    if "commissionRate" in data:
        trainer.commission_percent = float(data["commissionRate"])

    trainer.save()

    user = get_current_user()
    log_audit(user, f"Updated trainer {trainer.name}", "Trainers", get_client_ip())

    return success_response(trainer.to_dict(), "Trainer updated")


@trainers_bp.route("/<trainer_id>", methods=["DELETE"])
@jwt_required()
@roles_required("SUPER_ADMIN", "GYM_OWNER")
def delete_trainer(trainer_id):
    """Soft delete a trainer."""
    trainer = Trainer.objects(id=trainer_id, is_deleted=False).first()
    if not trainer:
        return error_response("Trainer not found", status_code=404)
    trainer.is_deleted = True
    trainer.save()
    return success_response(message="Trainer deleted")


@trainers_bp.route("/<trainer_id>/clients", methods=["GET"])
@jwt_required()
def get_trainer_clients(trainer_id):
    """Get members assigned to a trainer."""
    trainer = Trainer.objects(id=trainer_id, is_deleted=False).first()
    if not trainer:
        return error_response("Trainer not found", status_code=404)

    # Find members through PT sessions and workouts
    pt_sessions = PtSession.objects(trainer_id=trainer.id, is_deleted=False)
    member_ids = set(str(s.member_id.id) for s in pt_sessions if s.member_id)

    workouts = Workout.objects(created_by=trainer.id, is_deleted=False)
    for w in workouts:
        if w.assigned_to:
            member_ids.add(str(w.assigned_to.id))

    members = Member.objects(id__in=list(member_ids), is_deleted=False)
    return success_response([m.to_dict() for m in members])


@trainers_bp.route("/<trainer_id>/performance", methods=["GET"])
@jwt_required()
@roles_required("SUPER_ADMIN", "GYM_OWNER")
def trainer_performance(trainer_id):
    """Get trainer performance metrics."""
    trainer = Trainer.objects(id=trainer_id, is_deleted=False).first()
    if not trainer:
        return error_response("Trainer not found", status_code=404)

    sessions = PtSession.objects(trainer_id=trainer.id, is_deleted=False)
    total_sessions = sum(s.sessions_completed for s in sessions)
    active_clients = len(set(str(s.member_id.id) for s in sessions if s.member_id))

    return success_response({
        "trainerId": str(trainer.id),
        "trainerName": trainer.name,
        "totalSessionsCompleted": total_sessions,
        "activeClients": active_clients,
        "totalPtAssigned": sessions.count(),
    })


@trainers_bp.route("/<trainer_id>/schedule", methods=["GET"])
@jwt_required()
def trainer_schedule(trainer_id):
    """Get trainer's scheduled sessions."""
    sessions = PtSession.objects(
        trainer_id=trainer_id, is_deleted=False
    ).order_by("scheduled_date")
    return success_response([s.to_dict() for s in sessions])
