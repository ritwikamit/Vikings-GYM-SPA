"""Payments routes — offline, Razorpay, invoice, analytics."""
from flask import Blueprint, request, send_file
from flask_jwt_extended import jwt_required
from app.models.payment import Payment
from app.models.member import Member
from app.middleware.rbac import roles_required, get_current_user
from app.middleware.audit import log_audit
from app.utils.response import success_response, error_response, paginate_query
from app.utils.helpers import get_pagination_args, get_client_ip
from app.services.payment_service import PaymentService
from app.services.pdf_service import generate_invoice_pdf

payments_bp = Blueprint("payments", __name__)


@payments_bp.route("", methods=["GET"])
@jwt_required()
@roles_required("SUPER_ADMIN", "GYM_OWNER", "RECEPTIONIST")
def list_payments():
    """List all payments with filters."""
    page, per_page = get_pagination_args()
    status = request.args.get("status", "")
    category = request.args.get("category", "")
    query = Payment.objects(is_deleted=False)
    if status:
        query = query.filter(status=status)
    if category:
        query = query.filter(category=category)
    items, pagination = paginate_query(query.order_by("-created_at"), page, per_page)
    return success_response([p.to_dict() for p in items], pagination=pagination)


@payments_bp.route("/offline", methods=["POST"])
@jwt_required()
@roles_required("SUPER_ADMIN", "GYM_OWNER", "RECEPTIONIST")
def record_offline():
    """Record a cash/UPI/card payment."""
    data = request.get_json() or {}
    member_id = data.get("memberId")
    member = Member.objects(id=member_id, is_deleted=False).first() if member_id else None
    member_name = member.name if member else data.get("memberName", "Walk-in")

    payment = PaymentService.create_offline_payment(
        member_id=member.id if member else None,
        member_name=member_name,
        amount=float(data.get("amount", 0)),
        method=data.get("paymentMethod", "Cash"),
        category=data.get("paymentType", "Membership"),
        discount=float(data.get("discount", 0)),
        notes=data.get("notes", ""),
        coupon_code=data.get("couponCode", ""),
    )

    user = get_current_user()
    log_audit(user, f"Recorded offline payment ₹{payment.final_amount}", "Payments", get_client_ip())

    return success_response(payment.to_dict(), "Payment recorded", status_code=201)


@payments_bp.route("/razorpay/create", methods=["POST"])
@jwt_required()
def create_razorpay_order():
    """Create a Razorpay order."""
    data = request.get_json() or {}
    amount = float(data.get("amount", 0))
    if amount <= 0:
        return error_response("Amount must be positive")

    order = PaymentService.create_razorpay_order(amount)
    if not order:
        return error_response("Razorpay not configured")
    if "error" in order:
        return error_response(f"Razorpay error: {order['error']}")

    return success_response(order, "Order created")


@payments_bp.route("/razorpay/verify", methods=["POST"])
@jwt_required()
def verify_razorpay():
    """Verify Razorpay payment and record it."""
    data = request.get_json() or {}
    order_id = data.get("razorpay_order_id", "")
    payment_id = data.get("razorpay_payment_id", "")
    signature = data.get("razorpay_signature", "")

    if not all([order_id, payment_id, signature]):
        return error_response("Missing Razorpay fields")

    verified = PaymentService.verify_razorpay_payment(order_id, payment_id, signature)
    if not verified:
        return error_response("Payment verification failed", status_code=400)

    member_id = data.get("memberId")
    member = Member.objects(id=member_id, is_deleted=False).first() if member_id else None

    payment = PaymentService.record_razorpay_payment(
        member_id=member.id if member else None,
        member_name=member.name if member else "Online",
        amount=float(data.get("amount", 0)),
        razorpay_order_id=order_id,
        razorpay_payment_id=payment_id,
        category=data.get("category", "Membership"),
    )

    return success_response(payment.to_dict(), "Payment verified and recorded")


@payments_bp.route("/<payment_id>/invoice", methods=["GET"])
@jwt_required()
def download_invoice(payment_id):
    """Download invoice PDF for a payment."""
    payment = Payment.objects(id=payment_id, is_deleted=False).first()
    if not payment:
        return error_response("Payment not found", status_code=404)

    member = Member.objects(id=payment.member_id.id).first() if payment.member_id else None

    invoice_data = {
        "invoice_number": payment.invoice_number,
        "date": payment.date,
        "member_name": payment.member_name or "",
        "member_phone": member.phone if member else "",
        "member_email": member.email if member else "",
        "plan_name": payment.category,
        "amount": payment.amount,
        "discount": payment.discount,
        "final_amount": payment.final_amount,
        "payment_method": payment.method,
        "gym_name": "Vikings Gym & Spa",
        "branch": "Aurangabad",
    }

    pdf_buffer = generate_invoice_pdf(invoice_data)
    return send_file(
        pdf_buffer,
        mimetype="application/pdf",
        as_attachment=True,
        download_name=f"{payment.invoice_number}.pdf",
    )


@payments_bp.route("/apply-coupon", methods=["POST"])
@jwt_required()
def apply_coupon():
    """Validate and apply a coupon code."""
    data = request.get_json() or {}
    code = data.get("code", "")
    subtotal = float(data.get("subtotal", 0))
    if not code:
        return error_response("Coupon code is required")

    discount, err = PaymentService.apply_coupon(code, subtotal)
    if err:
        return error_response(err)

    return success_response({
        "discount": discount,
        "finalAmount": max(0, subtotal - discount),
    }, "Coupon applied")


@payments_bp.route("/analytics", methods=["GET"])
@jwt_required()
@roles_required("SUPER_ADMIN", "GYM_OWNER")
def payment_analytics():
    """Revenue analytics breakdown."""
    from datetime import datetime, timedelta, timezone
    today = datetime.now(timezone.utc)

    # Monthly revenue for last 12 months
    monthly = []
    for i in range(12):
        month_start = (today.replace(day=1) - timedelta(days=30 * i)).replace(day=1)
        month_end = (month_start + timedelta(days=32)).replace(day=1)
        total = sum(
            p.final_amount or p.amount
            for p in Payment.objects(
                status="PAID", is_deleted=False,
                date__gte=month_start.strftime("%Y-%m-%d"),
                date__lt=month_end.strftime("%Y-%m-%d"),
            )
        )
        monthly.append({
            "month": month_start.strftime("%Y-%m"),
            "revenue": total,
        })

    # By category
    categories = {}
    for p in Payment.objects(status="PAID", is_deleted=False):
        cat = p.category or "Other"
        categories[cat] = categories.get(cat, 0) + (p.final_amount or p.amount)

    return success_response({
        "monthly": list(reversed(monthly)),
        "byCategory": categories,
        "totalRevenue": sum(categories.values()),
    })
