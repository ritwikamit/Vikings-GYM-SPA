"""Memberships routes — CRUD + renew, upgrade, freeze, cancel."""
from datetime import datetime, timezone
from dateutil.relativedelta import relativedelta
from flask import Blueprint, request
from flask_jwt_extended import jwt_required
from app.models.membership import Membership, MembershipPlan
from app.models.member import Member
from app.models.payment import Payment
from app.middleware.rbac import roles_required, get_current_user
from app.middleware.audit import log_audit
from app.utils.response import success_response, error_response, paginate_query
from app.utils.helpers import get_pagination_args, generate_invoice_number, get_client_ip
from app.services.notification_service import NotificationService

memberships_bp = Blueprint("memberships", __name__)


@memberships_bp.route("", methods=["GET"])
@jwt_required()
@roles_required("SUPER_ADMIN", "GYM_OWNER", "RECEPTIONIST", "TRAINER")
def list_memberships():
    """List all memberships with filters."""
    page, per_page = get_pagination_args()
    status = request.args.get("status", "")
    query = Membership.objects(is_deleted=False)
    if status:
        query = query.filter(status=status)
    items, pagination = paginate_query(query.order_by("-created_at"), page, per_page)
    return success_response([m.to_dict() for m in items], pagination=pagination)


@memberships_bp.route("", methods=["POST"])
@jwt_required()
@roles_required("SUPER_ADMIN", "GYM_OWNER", "RECEPTIONIST")
def assign_membership():
    """Assign a membership plan to a member."""
    data = request.get_json() or {}
    member_id = data.get("memberId")
    plan_id = data.get("planId")

    if not member_id or not plan_id:
        return error_response("memberId and planId are required")

    member = Member.objects(id=member_id, is_deleted=False).first()
    plan = MembershipPlan.objects(id=plan_id, is_deleted=False).first()
    if not member:
        return error_response("Member not found", status_code=404)
    if not plan:
        return error_response("Plan not found", status_code=404)

    start = datetime.now(timezone.utc)
    end = start + relativedelta(months=plan.duration_months)

    # Create payment
    invoice = generate_invoice_number()
    payment = Payment(
        member_id=member.id,
        member_name=member.name,
        amount=plan.price,
        final_amount=plan.price,
        method=data.get("paymentMethod", "UPI"),
        category="Membership",
        status="PAID",
        invoice_number=invoice,
        date=start.strftime("%Y-%m-%d"),
        gym_id=member.gym_id,
        branch_id=member.branch_id,
    )
    payment.save()

    membership = Membership(
        member_id=member.id,
        plan_id=plan.id,
        plan_name=plan.name,
        plan_type=plan.name,
        start_date=start.strftime("%Y-%m-%d"),
        end_date=end.strftime("%Y-%m-%d"),
        price=plan.price,
        status="ACTIVE",
        payment_id=payment.id,
        gym_id=member.gym_id,
        branch_id=member.branch_id,
    )
    membership.save()

    # Notify member
    user_id = str(member.user_id.id) if member.user_id else str(member.id)
    NotificationService.send_in_app(
        user_id=user_id,
        title="Membership Activated!",
        message=f"Your {plan.name} plan is active until {membership.end_date}",
        notification_type="Payment",
        gym_id=member.gym_id, branch_id=member.branch_id,
    )

    user = get_current_user()
    log_audit(user, f"Assigned {plan.name} to {member.name}", "Billing System", get_client_ip())

    return success_response(membership.to_dict(), "Membership assigned successfully", status_code=201)


@memberships_bp.route("/<membership_id>/renew", methods=["PUT"])
@jwt_required()
@roles_required("SUPER_ADMIN", "GYM_OWNER", "RECEPTIONIST")
def renew_membership(membership_id):
    """Renew an existing membership."""
    membership = Membership.objects(id=membership_id, is_deleted=False).first()
    if not membership:
        return error_response("Membership not found", status_code=404)

    plan = MembershipPlan.objects(id=membership.plan_id.id).first() if membership.plan_id else None
    months = plan.duration_months if plan else 1

    # Extend from end_date or today (whichever is later)
    try:
        current_end = datetime.strptime(membership.end_date, "%Y-%m-%d")
    except ValueError:
        current_end = datetime.now(timezone.utc)

    new_start = max(current_end, datetime.now(timezone.utc))
    new_end = new_start + relativedelta(months=months)

    membership.start_date = new_start.strftime("%Y-%m-%d")
    membership.end_date = new_end.strftime("%Y-%m-%d")
    membership.status = "ACTIVE"
    membership.save()

    user = get_current_user()
    log_audit(user, f"Renewed membership for {membership.plan_name}", "Billing System", get_client_ip())

    return success_response(membership.to_dict(), "Membership renewed")


@memberships_bp.route("/<membership_id>/upgrade", methods=["PUT"])
@jwt_required()
@roles_required("SUPER_ADMIN", "GYM_OWNER", "RECEPTIONIST")
def upgrade_membership(membership_id):
    """Upgrade membership to a different plan."""
    data = request.get_json() or {}
    new_plan_id = data.get("planId")
    if not new_plan_id:
        return error_response("planId is required")

    membership = Membership.objects(id=membership_id, is_deleted=False).first()
    if not membership:
        return error_response("Membership not found", status_code=404)

    new_plan = MembershipPlan.objects(id=new_plan_id, is_deleted=False).first()
    if not new_plan:
        return error_response("Plan not found", status_code=404)

    start = datetime.now(timezone.utc)
    end = start + relativedelta(months=new_plan.duration_months)

    membership.plan_id = new_plan.id
    membership.plan_name = new_plan.name
    membership.plan_type = new_plan.name
    membership.start_date = start.strftime("%Y-%m-%d")
    membership.end_date = end.strftime("%Y-%m-%d")
    membership.price = new_plan.price
    membership.status = "ACTIVE"
    membership.save()

    user = get_current_user()
    log_audit(user, f"Upgraded membership to {new_plan.name}", "Billing System", get_client_ip())

    return success_response(membership.to_dict(), "Membership upgraded")


@memberships_bp.route("/<membership_id>/freeze", methods=["PUT"])
@jwt_required()
@roles_required("SUPER_ADMIN", "GYM_OWNER", "RECEPTIONIST")
def freeze_membership(membership_id):
    """Freeze membership with date range."""
    data = request.get_json() or {}
    frozen_days = int(data.get("frozenDays", data.get("days", 0)))

    membership = Membership.objects(id=membership_id, is_deleted=False).first()
    if not membership:
        return error_response("Membership not found", status_code=404)

    membership.status = "FREEZED"
    membership.freeze_start = datetime.now(timezone.utc).strftime("%Y-%m-%d")
    membership.frozen_days = frozen_days

    # Extend end date by frozen days
    if frozen_days > 0:
        try:
            current_end = datetime.strptime(membership.end_date, "%Y-%m-%d")
            from datetime import timedelta
            new_end = current_end + timedelta(days=frozen_days)
            membership.end_date = new_end.strftime("%Y-%m-%d")
            membership.freeze_end = (datetime.now(timezone.utc) + timedelta(days=frozen_days)).strftime("%Y-%m-%d")
        except ValueError:
            pass

    membership.save()

    user = get_current_user()
    log_audit(user, f"Froze membership for {frozen_days} days", "Billing System", get_client_ip())

    return success_response(membership.to_dict(), "Membership frozen")


@memberships_bp.route("/<membership_id>/cancel", methods=["PUT"])
@jwt_required()
@roles_required("SUPER_ADMIN", "GYM_OWNER")
def cancel_membership(membership_id):
    """Cancel a membership."""
    membership = Membership.objects(id=membership_id, is_deleted=False).first()
    if not membership:
        return error_response("Membership not found", status_code=404)

    membership.status = "CANCELLED"
    membership.save()

    user = get_current_user()
    log_audit(user, f"Cancelled membership {membership.plan_name}", "Billing System", get_client_ip())

    return success_response(membership.to_dict(), "Membership cancelled")


@memberships_bp.route("/expiring", methods=["GET"])
@jwt_required()
@roles_required("SUPER_ADMIN", "GYM_OWNER", "RECEPTIONIST")
def expiring_memberships():
    """Get memberships expiring in the next 7 days."""
    from datetime import timedelta
    today = datetime.now(timezone.utc)
    week_later = (today + timedelta(days=7)).strftime("%Y-%m-%d")
    today_str = today.strftime("%Y-%m-%d")

    memberships = Membership.objects(
        status="ACTIVE", is_deleted=False,
        end_date__gte=today_str, end_date__lte=week_later,
    )
    return success_response([m.to_dict() for m in memberships])


@memberships_bp.route("/expired", methods=["GET"])
@jwt_required()
@roles_required("SUPER_ADMIN", "GYM_OWNER", "RECEPTIONIST")
def expired_memberships():
    """Get already expired memberships."""
    memberships = Membership.objects(status="EXPIRED", is_deleted=False)
    return success_response([m.to_dict() for m in memberships])


@memberships_bp.route("/plans", methods=["GET"])
def list_plans():
    """List all membership plans. Public endpoint."""
    plans = MembershipPlan.objects(is_deleted=False)
    return success_response([p.to_dict() for p in plans])


@memberships_bp.route("/plans", methods=["POST"])
@jwt_required()
@roles_required("SUPER_ADMIN", "GYM_OWNER")
def create_plan():
    """Create a new membership plan."""
    data = request.get_json() or {}
    plan = MembershipPlan(
        name=data.get("name", ""),
        duration_months=int(data.get("durationMonths", 1)),
        price=float(data.get("price", 0)),
        description=data.get("description", ""),
        gym_id=data.get("gym_id", "vikings"),
        branch_id=data.get("branch_id", "aurangabad"),
    )
    plan.save()
    return success_response(plan.to_dict(), "Plan created", status_code=201)
