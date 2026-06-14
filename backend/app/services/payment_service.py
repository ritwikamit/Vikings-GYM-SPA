"""Payment service — Razorpay integration + offline payments."""
import os
from datetime import datetime, timezone
from app.models.payment import Payment
from app.models.coupon import Coupon
from app.utils.helpers import generate_invoice_number


class PaymentService:
    """Handles payment creation, Razorpay integration, and coupon application."""

    _razorpay_client = None

    @classmethod
    def _get_razorpay_client(cls):
        """Lazy-init Razorpay client."""
        if cls._razorpay_client is None:
            key_id = os.getenv("RAZORPAY_KEY_ID", "")
            key_secret = os.getenv("RAZORPAY_KEY_SECRET", "")
            if key_id and key_secret:
                try:
                    import razorpay
                    cls._razorpay_client = razorpay.Client(auth=(key_id, key_secret))
                except Exception:
                    cls._razorpay_client = None
        return cls._razorpay_client

    @staticmethod
    def create_offline_payment(member_id, member_name: str, amount: float,
                               method: str, category: str, discount: float = 0,
                               notes: str = "", coupon_code: str = "",
                               gym_id: str = "vikings",
                               branch_id: str = "aurangabad") -> Payment:
        """Record an offline (cash/UPI/card) payment."""
        final_amount = max(0, amount - discount)
        invoice = generate_invoice_number()

        payment = Payment(
            member_id=member_id,
            member_name=member_name,
            amount=amount,
            discount=discount,
            final_amount=final_amount,
            method=method,
            category=category,
            status="PAID",
            invoice_number=invoice,
            notes=notes,
            coupon_applied=coupon_code,
            date=datetime.now(timezone.utc).strftime("%Y-%m-%d"),
            gym_id=gym_id,
            branch_id=branch_id,
        )
        payment.save()
        return payment

    @classmethod
    def create_razorpay_order(cls, amount: float, currency: str = "INR",
                              receipt: str = "") -> dict | None:
        """Create a Razorpay order."""
        client = cls._get_razorpay_client()
        if not client:
            return None

        try:
            order = client.order.create({
                "amount": int(amount * 100),  # paise
                "currency": currency,
                "receipt": receipt or f"rcpt_{int(datetime.now().timestamp())}",
                "payment_capture": 1,
            })
            return order
        except Exception as e:
            return {"error": str(e)}

    @classmethod
    def verify_razorpay_payment(cls, order_id: str, payment_id: str,
                                signature: str) -> bool:
        """Verify Razorpay payment signature."""
        client = cls._get_razorpay_client()
        if not client:
            return False

        try:
            client.utility.verify_payment_signature({
                "razorpay_order_id": order_id,
                "razorpay_payment_id": payment_id,
                "razorpay_signature": signature,
            })
            return True
        except Exception:
            return False

    @staticmethod
    def apply_coupon(code: str, subtotal: float) -> tuple[float, str]:
        """
        Validate and apply a coupon code.
        Returns (discount_amount, error_message).
        """
        coupon = Coupon.objects(
            code=code.upper().strip(),
            is_active=True,
            is_deleted=False
        ).first()

        if not coupon:
            return 0, "Invalid coupon code"

        if coupon.used_count >= coupon.max_uses:
            return 0, "Coupon usage limit exceeded"

        if coupon.expiry_date:
            try:
                expiry = datetime.strptime(coupon.expiry_date, "%Y-%m-%d")
                if expiry < datetime.now():
                    return 0, "Coupon has expired"
            except ValueError:
                pass

        if coupon.discount_type == "Percentage":
            discount = (subtotal * coupon.discount_value) / 100
        else:
            discount = coupon.discount_value

        discount = min(discount, subtotal)

        # Increment usage
        coupon.used_count += 1
        coupon.save()

        return discount, ""

    @staticmethod
    def record_razorpay_payment(member_id, member_name: str, amount: float,
                                razorpay_order_id: str, razorpay_payment_id: str,
                                category: str = "Membership",
                                discount: float = 0,
                                gym_id: str = "vikings",
                                branch_id: str = "aurangabad") -> Payment:
        """Record a verified Razorpay payment."""
        invoice = generate_invoice_number()
        payment = Payment(
            member_id=member_id,
            member_name=member_name,
            amount=amount,
            discount=discount,
            final_amount=max(0, amount - discount),
            method="Razorpay",
            category=category,
            status="PAID",
            razorpay_order_id=razorpay_order_id,
            razorpay_payment_id=razorpay_payment_id,
            invoice_number=invoice,
            date=datetime.now(timezone.utc).strftime("%Y-%m-%d"),
            gym_id=gym_id,
            branch_id=branch_id,
        )
        payment.save()
        return payment
