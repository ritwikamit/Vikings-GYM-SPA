"""Workouts routes — CRUD + assign to member + library."""
from flask import Blueprint, request
from flask_jwt_extended import jwt_required
from app.models.workout import Workout, Exercise
from app.models.member import Member
from app.models.trainer import Trainer
from app.middleware.rbac import roles_required, get_current_user
from app.middleware.audit import log_audit
from app.utils.response import success_response, error_response, paginate_query
from app.utils.helpers import get_pagination_args, get_client_ip
from app.services.notification_service import NotificationService

workouts_bp = Blueprint("workouts", __name__)


@workouts_bp.route("", methods=["GET"])
@jwt_required()
def list_workouts():
    """List workout plans."""
    page, per_page = get_pagination_args()
    category = request.args.get("category", "")
    query = Workout.objects(is_deleted=False)
    if category:
        query = query.filter(category=category)
    items, pagination = paginate_query(query.order_by("-created_at"), page, per_page)
    return success_response([w.to_dict() for w in items], pagination=pagination)


@workouts_bp.route("", methods=["POST"])
@jwt_required()
@roles_required("SUPER_ADMIN", "GYM_OWNER", "TRAINER")
def create_workout():
    """Create a workout plan."""
    data = request.get_json() or {}
    exercises = [Exercise(
        day=e.get("day", ""),
        name=e.get("name", ""),
        sets=int(e.get("sets", 3)),
        reps=str(e.get("reps", "12")),
        weight=float(e.get("weight", 0)),
        rest_seconds=int(e.get("restSeconds", 60)),
        notes=e.get("notes", ""),
    ) for e in data.get("exercises", [])]

    workout = Workout(
        title=data.get("name", data.get("title", "")),
        category=data.get("category", "Beginner"),
        exercises=exercises,
        duration_weeks=int(data.get("durationWeeks", 4)),
        days_per_week=int(data.get("daysPerWeek", 5)),
        start_from=data.get("startFrom", ""),
        end_at=data.get("endAt", ""),
        notes=data.get("notes", ""),
        gym_id=data.get("gym_id", "vikings"),
        branch_id=data.get("branch_id", "aurangabad"),
    )

    # Set trainer
    trainer_id = data.get("trainerId")
    if trainer_id:
        trainer = Trainer.objects(id=trainer_id, is_deleted=False).first()
        if trainer:
            workout.created_by = trainer.id
            workout.created_by_name = trainer.name

    # Set member
    member_id = data.get("memberId")
    if member_id:
        member = Member.objects(id=member_id, is_deleted=False).first()
        if member:
            workout.assigned_to = member.id
            workout.assigned_to_name = member.name

    workout.save()

    user = get_current_user()
    log_audit(user, f"Created workout plan {workout.title}", "Workouts", get_client_ip())
    return success_response(workout.to_dict(), "Workout created", status_code=201)


@workouts_bp.route("/<workout_id>", methods=["GET"])
@jwt_required()
def get_workout(workout_id):
    """Get workout detail."""
    workout = Workout.objects(id=workout_id, is_deleted=False).first()
    if not workout:
        return error_response("Workout not found", status_code=404)
    return success_response(workout.to_dict())


@workouts_bp.route("/<workout_id>", methods=["PUT"])
@jwt_required()
@roles_required("SUPER_ADMIN", "GYM_OWNER", "TRAINER")
def update_workout(workout_id):
    """Update a workout plan."""
    workout = Workout.objects(id=workout_id, is_deleted=False).first()
    if not workout:
        return error_response("Workout not found", status_code=404)

    data = request.get_json() or {}
    if "name" in data or "title" in data:
        workout.title = data.get("name", data.get("title", workout.title))
    if "category" in data:
        workout.category = data["category"]
    if "notes" in data:
        workout.notes = data["notes"]
    if "exercises" in data:
        workout.exercises = [Exercise(
            day=e.get("day", ""), name=e.get("name", ""),
            sets=int(e.get("sets", 3)), reps=str(e.get("reps", "12")),
            weight=float(e.get("weight", 0)),
            rest_seconds=int(e.get("restSeconds", 60)),
            notes=e.get("notes", ""),
        ) for e in data["exercises"]]

    workout.save()
    return success_response(workout.to_dict(), "Workout updated")


@workouts_bp.route("/<workout_id>", methods=["DELETE"])
@jwt_required()
@roles_required("SUPER_ADMIN", "GYM_OWNER", "TRAINER")
def delete_workout(workout_id):
    """Delete a workout plan."""
    workout = Workout.objects(id=workout_id, is_deleted=False).first()
    if not workout:
        return error_response("Workout not found", status_code=404)
    workout.is_deleted = True
    workout.save()
    return success_response(message="Workout deleted")


@workouts_bp.route("/<workout_id>/assign/<member_id>", methods=["POST"])
@jwt_required()
@roles_required("SUPER_ADMIN", "GYM_OWNER", "TRAINER")
def assign_workout(workout_id, member_id):
    """Assign a workout plan to a member."""
    workout = Workout.objects(id=workout_id, is_deleted=False).first()
    member = Member.objects(id=member_id, is_deleted=False).first()
    if not workout:
        return error_response("Workout not found", status_code=404)
    if not member:
        return error_response("Member not found", status_code=404)

    workout.assigned_to = member.id
    workout.assigned_to_name = member.name
    workout.save()

    user_id = str(member.user_id.id) if member.user_id else str(member.id)
    NotificationService.send_in_app(
        user_id=user_id,
        title="New Workout Assigned",
        message=f"A new {workout.category} workout plan has been assigned to you!",
        notification_type="Announcement",
    )

    return success_response(workout.to_dict(), f"Workout assigned to {member.name}")


@workouts_bp.route("/library", methods=["GET"])
@jwt_required()
def workout_library():
    """Get predefined workout templates by category."""
    category = request.args.get("category", "")
    query = Workout.objects(is_deleted=False, assigned_to=None)
    if category:
        query = query.filter(category=category)
    return success_response([w.to_dict() for w in query])
