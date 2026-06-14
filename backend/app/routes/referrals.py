"""Referrals routes."""
from flask import Blueprint, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.models.referral import Referral
from app.models.member import Member
from app.middleware.rbac import roles_required, get_current_user
from app.utils.response import success_response, error_response

referrals_bp = Blueprint("referrals", __name__)


@referrals_bp.route("", methods=["GET"])
@jwt_required()
@roles_required("SUPER_ADMIN", "GYM_OWNER", "RECEPTIONIST")
def list_referrals():
    referrals = Referral.objects(is_deleted=False).order_by("-created_at")
    return success_response([r.to_dict() for r in referrals])


@referrals_bp.route("/my", methods=["GET"])
@jwt_required()
def my_referrals():
    """Get current member's own referrals."""
    identity = get_jwt_identity()
    member = Member.objects(user_id=identity, is_deleted=False).first()
    if not member:
        return success_response([])
    referrals = Referral.objects(referrer_id=member.id, is_deleted=False)
    return success_response([r.to_dict() for r in referrals])


@referrals_bp.route("/validate", methods=["POST"])
@jwt_required()
def validate_referral():
    """Validate a referral code."""
    data = request.get_json() or {}
    code = data.get("referralCode", "").strip()
    if not code:
        return error_response("Referral code is required")

    member = Member.objects(referral_code=code, is_deleted=False).first()
    if not member:
        return error_response("Invalid referral code")

    return success_response({
        "valid": True,
        "referrerName": member.name,
        "referrerId": str(member.id),
    }, "Referral code is valid")


@referrals_bp.route("/<ref_id>/convert", methods=["PUT"])
@jwt_required()
@roles_required("SUPER_ADMIN", "GYM_OWNER", "RECEPTIONIST")
def convert_referral(ref_id):
    """Mark referral as converted and credit reward."""
    referral = Referral.objects(id=ref_id, is_deleted=False).first()
    if not referral:
        return error_response("Referral not found", status_code=404)

    referral.status = "Converted"
    referral.reward_credited = True
    referral.save()

    # Credit wallet
    if referral.referrer_id and referral.reward_amount > 0:
        try:
            referrer = Member.objects(id=referral.referrer_id.id).first()
            if referrer:
                referrer.wallet_balance += referral.reward_amount
                referrer.save()
        except Exception:
            pass

    return success_response(referral.to_dict(), "Referral converted and reward credited")
