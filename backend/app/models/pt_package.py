"""PT Package model."""
from datetime import datetime, timezone
from app.extensions import db


class PtPackage(db.Document):
    """Personal Training package template."""

    name = db.StringField(required=True, max_length=100)
    sessions_total = db.IntField(required=True)
    price = db.FloatField(required=True)
    validity_days = db.IntField(default=30)
    trainer_commission_percent = db.FloatField(default=0)
    trainer_id = db.ReferenceField("Trainer", dbref=False)
    trainer_name = db.StringField(max_length=100)
    is_active = db.BooleanField(default=True)

    # Multi-tenancy
    gym_id = db.StringField(default="vikings")
    branch_id = db.StringField(default="aurangabad")

    # Timestamps
    created_at = db.DateTimeField(default=lambda: datetime.now(timezone.utc))
    updated_at = db.DateTimeField(default=lambda: datetime.now(timezone.utc))
    is_deleted = db.BooleanField(default=False)

    meta = {
        "collection": "pt_packages",
        "indexes": ["is_active", "gym_id", "branch_id"],
    }

    def to_dict(self):
        return {
            "id": str(self.id),
            "name": self.name,
            "sessionsCount": self.sessions_total,
            "price": self.price,
            "validityDays": self.validity_days,
            "trainerCommissionPercent": self.trainer_commission_percent,
            "trainerId": str(self.trainer_id.id) if self.trainer_id else "",
            "trainerName": self.trainer_name or "",
            "isActive": self.is_active,
            "gym_id": self.gym_id,
            "branch_id": self.branch_id,
        }

    def save(self, *args, **kwargs):
        self.updated_at = datetime.now(timezone.utc)
        return super().save(*args, **kwargs)
