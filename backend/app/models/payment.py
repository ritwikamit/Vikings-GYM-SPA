"""Payment model."""
from datetime import datetime, timezone
from app.extensions import db


class Payment(db.Document):
    """Payment / transaction records."""

    METHOD_CHOICES = ("Cash", "UPI", "Card", "Online", "Razorpay")
    CATEGORY_CHOICES = ("Membership", "PT", "POS", "Locker", "PT_Package")
    STATUS_CHOICES = ("PAID", "PENDING", "FAILED", "REFUNDED")

    member_id = db.ReferenceField("Member", dbref=False)
    member_name = db.StringField(max_length=100)
    amount = db.FloatField(required=True)
    discount = db.FloatField(default=0)
    final_amount = db.FloatField(default=0)
    method = db.StringField(choices=METHOD_CHOICES, default="Cash")
    category = db.StringField(choices=CATEGORY_CHOICES, default="Membership")
    status = db.StringField(choices=STATUS_CHOICES, default="PAID")
    razorpay_order_id = db.StringField(default="")
    razorpay_payment_id = db.StringField(default="")
    invoice_number = db.StringField(unique=True)  # Auto: INV-2024-001
    notes = db.StringField(default="")
    coupon_applied = db.StringField(default="")
    date = db.StringField()

    # Multi-tenancy
    gym_id = db.StringField(default="vikings")
    branch_id = db.StringField(default="aurangabad")

    # Timestamps
    created_at = db.DateTimeField(default=lambda: datetime.now(timezone.utc))
    updated_at = db.DateTimeField(default=lambda: datetime.now(timezone.utc))
    is_deleted = db.BooleanField(default=False)

    meta = {
        "collection": "payments",
        "indexes": ["member_id", "status", "category", "date", "gym_id", "branch_id"],
        "ordering": ["-created_at"],
    }

    def to_dict(self):
        return {
            "id": str(self.id),
            "memberId": str(self.member_id.id) if self.member_id else "",
            "memberName": self.member_name or "",
            "amount": self.amount,
            "discount": self.discount,
            "finalAmount": self.final_amount or self.amount,
            "date": self.date or "",
            "paymentMethod": self.method,
            "paymentType": self.category,
            "status": self.status,
            "razorpayOrderId": self.razorpay_order_id or "",
            "razorpayPaymentId": self.razorpay_payment_id or "",
            "invoiceNumber": self.invoice_number or "",
            "notes": self.notes or "",
            "couponApplied": self.coupon_applied or "",
            "discountAmount": self.discount,
            "gym_id": self.gym_id,
            "branch_id": self.branch_id,
        }

    def save(self, *args, **kwargs):
        if not self.final_amount:
            self.final_amount = self.amount - self.discount
        self.updated_at = datetime.now(timezone.utc)
        return super().save(*args, **kwargs)
