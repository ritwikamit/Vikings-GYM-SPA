"""Coupon model."""
from datetime import datetime, timezone
from app.extensions import db


class Coupon(db.Document):
    """Discount coupons for memberships and POS."""

    code = db.StringField(required=True, unique=True, max_length=50)
    discount_type = db.StringField(choices=["Flat", "Percentage"], default="Flat")
    discount_value = db.FloatField(required=True)
    max_uses = db.IntField(default=100)
    used_count = db.IntField(default=0)
    expiry_date = db.StringField()
    is_active = db.BooleanField(default=True)
    applicable_plans = db.ListField(db.StringField(), default=list)

    # Multi-tenancy
    gym_id = db.StringField(default="vikings")
    branch_id = db.StringField(default="aurangabad")

    # Timestamps
    created_at = db.DateTimeField(default=lambda: datetime.now(timezone.utc))
    updated_at = db.DateTimeField(default=lambda: datetime.now(timezone.utc))
    is_deleted = db.BooleanField(default=False)

    meta = {
        "collection": "coupons",
        "indexes": ["code", "is_active", "gym_id", "branch_id"],
    }

    def to_dict(self):
        return {
            "id": str(self.id),
            "code": self.code,
            "type": self.discount_type.upper() if self.discount_type else "FLAT",
            "value": self.discount_value,
            "expiryDate": self.expiry_date or "",
            "usageLimit": self.max_uses,
            "timesUsed": self.used_count,
            "isActive": self.is_active,
            "applicablePlans": self.applicable_plans,
            "gym_id": self.gym_id,
            "branch_id": self.branch_id,
        }

    def save(self, *args, **kwargs):
        self.updated_at = datetime.now(timezone.utc)
        return super().save(*args, **kwargs)
