"""Invoice model for billing."""
from datetime import datetime, timezone
from app.extensions import db


class Invoice(db.Document):
    """Invoice records generated from payments."""

    STATUS_CHOICES = ("Paid", "Pending", "Overdue", "Cancelled")

    invoice_number = db.StringField(required=True, unique=True)
    payment_id = db.ReferenceField("Payment", dbref=False)
    member_id = db.ReferenceField("Member", dbref=False, required=True)
    member_name = db.StringField()
    amount = db.FloatField(required=True)
    gst_amount = db.FloatField(default=0)
    total_amount = db.FloatField(required=True)
    due_date = db.StringField()
    status = db.StringField(choices=STATUS_CHOICES, default="Pending")
    
    # Multi-tenancy
    gym_id = db.StringField(default="vikings")
    branch_id = db.StringField(default="aurangabad")

    # Timestamps
    created_at = db.DateTimeField(default=lambda: datetime.now(timezone.utc))
    updated_at = db.DateTimeField(default=lambda: datetime.now(timezone.utc))
    is_deleted = db.BooleanField(default=False)

    meta = {
        "collection": "invoices",
        "indexes": ["invoice_number", "member_id", "status", "gym_id", "branch_id"],
        "ordering": ["-created_at"],
    }

    def to_dict(self):
        return {
            "id": str(self.id),
            "invoiceNumber": self.invoice_number,
            "paymentId": str(self.payment_id.id) if self.payment_id else "",
            "memberId": str(self.member_id.id) if self.member_id else "",
            "memberName": self.member_name or "",
            "amount": self.amount,
            "gstAmount": self.gst_amount,
            "totalAmount": self.total_amount,
            "dueDate": self.due_date or "",
            "status": self.status,
            "gym_id": self.gym_id,
            "branch_id": self.branch_id,
        }

    def save(self, *args, **kwargs):
        self.updated_at = datetime.now(timezone.utc)
        return super().save(*args, **kwargs)
