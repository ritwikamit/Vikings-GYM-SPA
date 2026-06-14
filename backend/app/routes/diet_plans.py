"""Diet Plans routes — CRUD + assign to member."""
from flask import Blueprint, request
from flask_jwt_extended import jwt_required
from app.models.diet_plan import DietPlan, Meal, FoodItem
from app.models.member import Member
from app.models.trainer import Trainer
from app.middleware.rbac import roles_required, get_current_user
from app.middleware.audit import log_audit
from app.utils.response import success_response, error_response, paginate_query
from app.utils.helpers import get_pagination_args, get_client_ip
from app.services.notification_service import NotificationService

diet_plans_bp = Blueprint("diet_plans", __name__)


@diet_plans_bp.route("", methods=["GET"])
@jwt_required()
def list_diet_plans():
    page, per_page = get_pagination_args()
    query = DietPlan.objects(is_deleted=False)
    items, pagination = paginate_query(query.order_by("-created_at"), page, per_page)
    return success_response([d.to_dict() for d in items], pagination=pagination)


@diet_plans_bp.route("", methods=["POST"])
@jwt_required()
@roles_required("SUPER_ADMIN", "GYM_OWNER", "TRAINER")
def create_diet_plan():
    data = request.get_json() or {}
    meals = []
    for m in data.get("meals", []):
        foods = [FoodItem(item=f.get("item", ""), quantity=f.get("quantity", ""),
                          calories=int(f.get("calories", 0)), protein=float(f.get("protein", 0)))
                 for f in m.get("foods", [])]
        meals.append(Meal(
            name=m.get("type", m.get("name", "")),
            time=m.get("time", ""),
            meal_type=m.get("type", "Breakfast"),
            description=m.get("description", ""),
            foods=foods,
            calories_estimate=int(m.get("caloriesEstimate", 0)),
        ))

    plan = DietPlan(
        title=data.get("name", data.get("title", "")),
        goal=data.get("goal", "Maintenance"),
        total_calories=int(data.get("caloriesTarget", 2000)),
        meals=meals,
        water_intake_liters=float(data.get("waterIntakeLiters", 3)),
        notes=data.get("notes", ""),
        gym_id=data.get("gym_id", "vikings"),
        branch_id=data.get("branch_id", "aurangabad"),
    )

    trainer_id = data.get("trainerId")
    if trainer_id:
        trainer = Trainer.objects(id=trainer_id, is_deleted=False).first()
        if trainer:
            plan.created_by = trainer.id
            plan.created_by_name = trainer.name

    member_id = data.get("memberId")
    if member_id:
        member = Member.objects(id=member_id, is_deleted=False).first()
        if member:
            plan.assigned_to = member.id
            plan.assigned_to_name = member.name

    plan.save()

    user = get_current_user()
    log_audit(user, f"Created diet plan {plan.title}", "Diet Module", get_client_ip())
    return success_response(plan.to_dict(), "Diet plan created", status_code=201)


@diet_plans_bp.route("/<plan_id>", methods=["GET"])
@jwt_required()
def get_diet_plan(plan_id):
    plan = DietPlan.objects(id=plan_id, is_deleted=False).first()
    if not plan:
        return error_response("Diet plan not found", status_code=404)
    return success_response(plan.to_dict())


@diet_plans_bp.route("/<plan_id>", methods=["PUT"])
@jwt_required()
@roles_required("SUPER_ADMIN", "GYM_OWNER", "TRAINER")
def update_diet_plan(plan_id):
    plan = DietPlan.objects(id=plan_id, is_deleted=False).first()
    if not plan:
        return error_response("Diet plan not found", status_code=404)

    data = request.get_json() or {}
    if "name" in data or "title" in data:
        plan.title = data.get("name", data.get("title", plan.title))
    if "caloriesTarget" in data:
        plan.total_calories = int(data["caloriesTarget"])
    if "goal" in data:
        plan.goal = data["goal"]
    if "notes" in data:
        plan.notes = data["notes"]
    if "meals" in data:
        meals = []
        for m in data["meals"]:
            foods = [FoodItem(item=f.get("item", ""), quantity=f.get("quantity", ""),
                              calories=int(f.get("calories", 0)), protein=float(f.get("protein", 0)))
                     for f in m.get("foods", [])]
            meals.append(Meal(name=m.get("type", ""), time=m.get("time", ""),
                              meal_type=m.get("type", "Breakfast"),
                              description=m.get("description", ""),
                              foods=foods, calories_estimate=int(m.get("caloriesEstimate", 0))))
        plan.meals = meals

    plan.save()
    return success_response(plan.to_dict(), "Diet plan updated")


@diet_plans_bp.route("/<plan_id>", methods=["DELETE"])
@jwt_required()
@roles_required("SUPER_ADMIN", "GYM_OWNER", "TRAINER")
def delete_diet_plan(plan_id):
    plan = DietPlan.objects(id=plan_id, is_deleted=False).first()
    if not plan:
        return error_response("Diet plan not found", status_code=404)
    plan.is_deleted = True
    plan.save()
    return success_response(message="Diet plan deleted")


@diet_plans_bp.route("/<plan_id>/assign/<member_id>", methods=["POST"])
@jwt_required()
@roles_required("SUPER_ADMIN", "GYM_OWNER", "TRAINER")
def assign_diet(plan_id, member_id):
    plan = DietPlan.objects(id=plan_id, is_deleted=False).first()
    member = Member.objects(id=member_id, is_deleted=False).first()
    if not plan or not member:
        return error_response("Plan or member not found", status_code=404)

    plan.assigned_to = member.id
    plan.assigned_to_name = member.name
    plan.save()

    user_id = str(member.user_id.id) if member.user_id else str(member.id)
    NotificationService.send_in_app(user_id=user_id, title="New Diet Plan",
                                    message=f"A {plan.total_calories} kcal diet plan has been assigned!",
                                    notification_type="Announcement")
    return success_response(plan.to_dict(), f"Diet plan assigned to {member.name}")
