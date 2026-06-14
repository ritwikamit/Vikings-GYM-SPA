"""Payroll model for staff salary tracking."""
from datetime import datetime, timezone
from app.extensions import db


class Payroll(db.Document):
    """Staff payroll records."""

    STATUS_CHOICES = ("Paid", "Pending", "Failed")

    staff_id = db.ReferenceField("User", dbref=False, required=True)
    staff_name = db.StringField()
    role = db.StringField()
    month = db.StringField(required=True)  # e.g., '2024-01'
    base_salary = db.FloatField(required=True)
    bonus = db.FloatField(default=0)
    deductions = db.FloatField(default=0)
    tax = db.FloatField(default=0)
    net_pay = db.FloatField(required=True)
    status = db.StringField(choices=STATUS_CHOICES, default="Pending")
    payment_date = db.StringField()
    
    # Multi-tenancy
    gym_id = db.StringField(default="vikings")
    branch_id = db.StringField(default="aurangabad")

    # Timestamps
    created_at = db.DateTimeField(default=lambda: datetime.now(timezone.utc))
    updated_at = db.DateTimeField(default=lambda: datetime.now(timezone.utc))
    is_deleted = db.BooleanField(default=False)

    meta = {
        "collection": "payrolls",
        "indexes": ["staff_id", "month", "status", "gym_id", "branch_id"],
        "ordering": ["-created_at"],
    }

    def to_dict(self):
        return {
            "id": str(self.id),
            "staffId": str(self.staff_id.id) if self.staff_id else "",
            "staffName": self.staff_name or "",
            "role": self.role or "",
            "month": self.month,
            "baseSalary": self.base_salary,
            "bonus": self.bonus,
            "deductions": self.deductions,
            "tax": self.tax,
            "netPay": self.net_pay,
            "status": self.status,
            "paymentDate": self.payment_date or "",
            "gym_id": self.gym_id,
            "branch_id": self.branch_id,
        }

    def save(self, *args, **kwargs):
        self.net_pay = self.base_salary + self.bonus - self.deductions - self.tax
        self.updated_at = datetime.now(timezone.utc)
        return super().save(*args, **kwargs)
