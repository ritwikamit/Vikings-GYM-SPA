"""Expense model."""
from datetime import datetime, timezone
from app.extensions import db


class Expense(db.Document):
    """Business expense records."""

    CATEGORY_CHOICES = (
        "Rent", "Electricity", "Internet", "Salary",
        "Marketing", "Maintenance", "Equipment", "Other",
    )

    category = db.StringField(choices=CATEGORY_CHOICES, required=True)
    amount = db.FloatField(required=True)
    description = db.StringField(default="")
    date = db.StringField(required=True)
    paid_by = db.StringField(max_length=100)
    receipt_url = db.StringField(default="")

    # Multi-tenancy
    gym_id = db.StringField(default="vikings")
    branch_id = db.StringField(default="aurangabad")

    # Timestamps
    created_at = db.DateTimeField(default=lambda: datetime.now(timezone.utc))
    updated_at = db.DateTimeField(default=lambda: datetime.now(timezone.utc))
    is_deleted = db.BooleanField(default=False)

    meta = {
        "collection": "expenses",
        "indexes": ["category", "date", "gym_id", "branch_id"],
        "ordering": ["-date"],
    }

    def to_dict(self):
        return {
            "id": str(self.id),
            "category": self.category,
            "amount": self.amount,
            "description": self.description or "",
            "date": self.date,
            "paidTo": self.paid_by or "",
            "receiptUrl": self.receipt_url or "",
            "gym_id": self.gym_id,
            "branch_id": self.branch_id,
        }

    def save(self, *args, **kwargs):
        self.updated_at = datetime.now(timezone.utc)
        return super().save(*args, **kwargs)
