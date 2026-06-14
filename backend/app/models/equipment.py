"""Equipment model."""
from datetime import datetime, timezone
from app.extensions import db


class Equipment(db.Document):
    """Gym equipment tracking and maintenance."""

    STATUS_CHOICES = ("Operational", "Under Maintenance", "Needs Service", "Retired")

    name = db.StringField(required=True, max_length=200)
    category = db.StringField(max_length=100)
    purchase_date = db.StringField()
    purchase_price = db.FloatField(default=0)
    last_service_date = db.StringField()
    next_service_date = db.StringField()
    status = db.StringField(choices=STATUS_CHOICES, default="Operational")
    notes = db.StringField(default="")

    # Multi-tenancy
    gym_id = db.StringField(default="vikings")
    branch_id = db.StringField(default="aurangabad")

    # Timestamps
    created_at = db.DateTimeField(default=lambda: datetime.now(timezone.utc))
    updated_at = db.DateTimeField(default=lambda: datetime.now(timezone.utc))
    is_deleted = db.BooleanField(default=False)

    meta = {
        "collection": "equipment",
        "indexes": ["status", "next_service_date", "gym_id", "branch_id"],
    }

    def to_dict(self):
        return {
            "id": str(self.id),
            "name": self.name,
            "category": self.category or "",
            "purchaseDate": self.purchase_date or "",
            "purchasePrice": self.purchase_price,
            "lastServiceDate": self.last_service_date or "",
            "nextServiceDate": self.next_service_date or "",
            "status": self.status,
            "notes": self.notes or "",
            "gym_id": self.gym_id,
            "branch_id": self.branch_id,
        }

    def save(self, *args, **kwargs):
        self.updated_at = datetime.now(timezone.utc)
        return super().save(*args, **kwargs)
