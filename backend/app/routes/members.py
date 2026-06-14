"""Members routes — CRUD + sub-resource access."""
from flask import Blueprint, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.models.member import Member
from app.models.membership import Membership
from app.models.attendance import Attendance
from app.models.payment import Payment
from app.models.progress import Progress
from app.models.workout import Workout
from app.models.diet_plan import DietPlan
from app.middleware.rbac import roles_required, get_current_user
from app.middleware.audit import log_audit
from app.utils.response import success_response, error_response, paginate_query
from app.utils.validators import validate_required_fields, validate_email, validate_phone
from app.utils.helpers import generate_member_id, generate_referral_code, get_pagination_args, get_client_ip
from app.services.qr_service import generate_member_qr

members_bp = Blueprint("members", __name__)


@members_bp.route("", methods=["GET"])
@jwt_required()
@roles_required("SUPER_ADMIN", "GYM_OWNER", "RECEPTIONIST", "TRAINER")
def list_members():
    """List all members with search, filter, pagination."""
    page, per_page = get_pagination_args()
    search = request.args.get("search", "").strip()
    gender = request.args.get("gender", "")

    query = Member.objects(is_deleted=False)
    if search:
        query = query.filter(
            __raw__={"$or": [
                {"name": {"$regex": search, "$options": "i"}},
                {"email": {"$regex": search, "$options": "i"}},
                {"phone": {"$regex": search, "$options": "i"}},
                {"member_id": {"$regex": search, "$options": "i"}},
            ]}
        )
    if gender:
        query = query.filter(gender=gender)

    items, pagination = paginate_query(query.order_by("-created_at"), page, per_page)
    return success_response([m.to_dict() for m in items], pagination=pagination)


@members_bp.route("", methods=["POST"])
@jwt_required()
@roles_required("SUPER_ADMIN", "GYM_OWNER", "RECEPTIONIST")
def create_member():
    """Create a new member with auto-generated QR and member_id."""
    data = request.get_json() or {}
    errors = validate_required_fields(data, ["name", "phone", "email"])
    if errors:
        return error_response("Validation error", errors)

    if not validate_email(data["email"]):
        return error_response("Invalid email format")

    member_id = generate_member_id()
    referral_code = generate_referral_code(data["name"])
    qr_code = generate_member_qr(member_id)

    member = Member(
        member_id=member_id,
        name=data["name"].strip(),
        phone=data["phone"].strip(),
        email=data["email"].strip().lower(),
        dob=data.get("dob", ""),
        gender=data.get("gender", ""),
        address=data.get("address", ""),
        blood_group=data.get("bloodGroup", ""),
        medical_conditions=data.get("medicalConditions", ""),
        emergency_contact_name=data.get("emergencyContactName", ""),
        emergency_contact_phone=data.get("emergencyContactPhone", ""),
        photo_url=data.get("photoUrl", ""),
        fitness_goal=data.get("fitnessGoal", ""),
        height=float(data.get("height", 0)),
        weight=float(data.get("weight", 0)),
        referral_code=referral_code,
        referred_by=data.get("referredBy", ""),
        qr_code=qr_code,
        wallet_balance=float(data.get("walletCredits", 0)),
        joined_date=data.get("joinedDate", ""),
        gym_id=data.get("gym_id", "vikings"),
        branch_id=data.get("branch_id", "aurangabad"),
    )
    member.save()

    user = get_current_user()
    log_audit(user, f"Created member profile for {member.name}", "Members Module", get_client_ip())

    return success_response(member.to_dict(), "Member created successfully", status_code=201)


@members_bp.route("/<member_id>", methods=["GET"])
@jwt_required()
def get_member(member_id):
    """Get member profile by ID."""
    member = Member.objects(id=member_id, is_deleted=False).first()
    if not member:
        return error_response("Member not found", status_code=404)

    # MEMBER role can only access own profile
    user = get_current_user()
    if user and user.role == "MEMBER" and str(member.user_id) != str(user.id) if member.user_id else True:
        return error_response("Access denied", status_code=403)

    return success_response(member.to_dict())


@members_bp.route("/<member_id>", methods=["PUT"])
@jwt_required()
@roles_required("SUPER_ADMIN", "GYM_OWNER", "RECEPTIONIST")
def update_member(member_id):
    """Update member profile."""
    member = Member.objects(id=member_id, is_deleted=False).first()
    if not member:
        return error_response("Member not found", status_code=404)

    data = request.get_json() or {}

    updatable = [
        "name", "phone", "email", "dob", "gender", "address",
        "fitness_goal", "photo_url", "medical_conditions",
        "emergency_contact_name", "emergency_contact_phone",
    ]
    field_map = {
        "bloodGroup": "blood_group",
        "medicalConditions": "medical_conditions",
        "emergencyContactName": "emergency_contact_name",
        "emergencyContactPhone": "emergency_contact_phone",
        "photoUrl": "photo_url",
        "fitnessGoal": "fitness_goal",
        "walletCredits": "wallet_balance",
    }

    for camel, snake in field_map.items():
        if camel in data:
            setattr(member, snake, data[camel])

    for field in updatable:
        if field in data:
            setattr(member, field, data[field])

    if "height" in data:
        member.height = float(data["height"])
    if "weight" in data:
        member.weight = float(data["weight"])

    member.save()

    user = get_current_user()
    log_audit(user, f"Updated member profile for {member.name}", "Members Module", get_client_ip())

    return success_response(member.to_dict(), "Member updated successfully")


@members_bp.route("/<member_id>", methods=["DELETE"])
@jwt_required()
@roles_required("SUPER_ADMIN", "GYM_OWNER")
def delete_member(member_id):
    """Soft delete a member."""
    member = Member.objects(id=member_id, is_deleted=False).first()
    if not member:
        return error_response("Member not found", status_code=404)

    member.is_deleted = True
    member.save()

    user = get_current_user()
    log_audit(user, f"Deleted member {member.name}", "Members Module", get_client_ip())

    return success_response(message="Member deleted successfully")


@members_bp.route("/<member_id>/qr", methods=["GET"])
@jwt_required()
def get_member_qr(member_id):
    """Get member's QR code image."""
    member = Member.objects(id=member_id, is_deleted=False).first()
    if not member:
        return error_response("Member not found", status_code=404)
    return success_response({"qrCode": member.qr_code, "memberId": member.member_id})


@members_bp.route("/<member_id>/membership", methods=["GET"])
@jwt_required()
def get_member_membership(member_id):
    """Get current membership for a member."""
    member = Member.objects(id=member_id, is_deleted=False).first()
    if not member:
        return error_response("Member not found", status_code=404)

    membership = Membership.objects(
        member_id=member.id, status="ACTIVE", is_deleted=False
    ).first()
    data = membership.to_dict() if membership else None
    return success_response(data)


@members_bp.route("/<member_id>/attendance", methods=["GET"])
@jwt_required()
def get_member_attendance(member_id):
    """Get attendance history for a member."""
    page, per_page = get_pagination_args()
    query = Attendance.objects(member_id=member_id, is_deleted=False).order_by("-date")
    items, pagination = paginate_query(query, page, per_page)
    return success_response([a.to_dict() for a in items], pagination=pagination)


@members_bp.route("/<member_id>/payments", methods=["GET"])
@jwt_required()
def get_member_payments(member_id):
    """Get payment history for a member."""
    page, per_page = get_pagination_args()
    query = Payment.objects(member_id=member_id, is_deleted=False).order_by("-created_at")
    items, pagination = paginate_query(query, page, per_page)
    return success_response([p.to_dict() for p in items], pagination=pagination)


@members_bp.route("/<member_id>/progress", methods=["GET"])
@jwt_required()
def get_member_progress(member_id):
    """Get progress history for a member."""
    records = Progress.objects(member_id=member_id, is_deleted=False).order_by("-date")
    return success_response([r.to_dict() for r in records])


@members_bp.route("/<member_id>/workouts", methods=["GET"])
@jwt_required()
def get_member_workouts(member_id):
    """Get assigned workouts for a member."""
    workouts = Workout.objects(assigned_to=member_id, is_deleted=False)
    return success_response([w.to_dict() for w in workouts])


@members_bp.route("/<member_id>/diet", methods=["GET"])
@jwt_required()
def get_member_diet(member_id):
    """Get assigned diet plans for a member."""
    plans = DietPlan.objects(assigned_to=member_id, is_deleted=False)
    return success_response([d.to_dict() for d in plans])
