"""Coupons routes."""
from flask import Blueprint, request
from flask_jwt_extended import jwt_required
from app.models.coupon import Coupon
from app.middleware.rbac import roles_required, get_current_user
from app.middleware.audit import log_audit
from app.utils.response import success_response, error_response
from app.utils.helpers import get_client_ip
from app.services.payment_service import PaymentService

coupons_bp = Blueprint("coupons", __name__)


@coupons_bp.route("", methods=["GET"])
@jwt_required()
@roles_required("SUPER_ADMIN", "GYM_OWNER", "RECEPTIONIST")
def list_coupons():
    coupons = Coupon.objects(is_deleted=False)
    return success_response([c.to_dict() for c in coupons])


@coupons_bp.route("", methods=["POST"])
@jwt_required()
@roles_required("SUPER_ADMIN", "GYM_OWNER")
def create_coupon():
    data = request.get_json() or {}
    coupon = Coupon(
        code=data.get("code", "").upper().strip(),
        discount_type="Percentage" if data.get("type", "FLAT") == "PERCENTAGE" else "Flat",
        discount_value=float(data.get("value", 0)),
        max_uses=int(data.get("usageLimit", 100)),
        expiry_date=data.get("expiryDate", ""),
        is_active=True,
        applicable_plans=data.get("applicablePlans", []),
        gym_id=data.get("gym_id", "vikings"),
        branch_id=data.get("branch_id", "aurangabad"),
    )
    coupon.save()
    user = get_current_user()
    log_audit(user, f"Created coupon {coupon.code}", "Coupons", get_client_ip())
    return success_response(coupon.to_dict(), "Coupon created", status_code=201)


@coupons_bp.route("/<coupon_id>", methods=["PUT"])
@jwt_required()
@roles_required("SUPER_ADMIN", "GYM_OWNER")
def update_coupon(coupon_id):
    coupon = Coupon.objects(id=coupon_id, is_deleted=False).first()
    if not coupon:
        return error_response("Coupon not found", status_code=404)
    data = request.get_json() or {}
    if "code" in data:
        coupon.code = data["code"].upper().strip()
    if "type" in data:
        coupon.discount_type = "Percentage" if data["type"] == "PERCENTAGE" else "Flat"
    if "value" in data:
        coupon.discount_value = float(data["value"])
    if "usageLimit" in data:
        coupon.max_uses = int(data["usageLimit"])
    if "expiryDate" in data:
        coupon.expiry_date = data["expiryDate"]
    if "isActive" in data:
        coupon.is_active = data["isActive"]
    coupon.save()
    return success_response(coupon.to_dict(), "Coupon updated")


@coupons_bp.route("/<coupon_id>", methods=["DELETE"])
@jwt_required()
@roles_required("SUPER_ADMIN", "GYM_OWNER")
def delete_coupon(coupon_id):
    coupon = Coupon.objects(id=coupon_id, is_deleted=False).first()
    if not coupon:
        return error_response("Coupon not found", status_code=404)
    coupon.is_deleted = True
    coupon.save()
    return success_response(message="Coupon deleted")


@coupons_bp.route("/validate", methods=["POST"])
@jwt_required()
def validate_coupon():
    data = request.get_json() or {}
    code = data.get("code", "")
    subtotal = float(data.get("subtotal", 0))
    if not code:
        return error_response("Coupon code required")

    discount, err = PaymentService.apply_coupon(code, subtotal)
    if err:
        return error_response(err)
    return success_response({"discount": discount, "finalAmount": max(0, subtotal - discount)})
