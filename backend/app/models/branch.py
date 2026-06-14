"""Branch model."""
from datetime import datetime, timezone
from app.extensions import db


class Branch(db.Document):
    """Gym branch / location."""

    name = db.StringField(required=True, max_length=100)
    location = db.StringField(max_length=300)
    manager = db.StringField(max_length=100)
    phone = db.StringField(max_length=15)

    gym_id = db.StringField(default="vikings")
    created_at = db.DateTimeField(default=lambda: datetime.now(timezone.utc))
    updated_at = db.DateTimeField(default=lambda: datetime.now(timezone.utc))
    is_deleted = db.BooleanField(default=False)

    meta = {
        "collection": "branches",
        "indexes": ["gym_id"],
    }

    def to_dict(self):
        return {
            "id": str(self.id),
            "name": self.name,
            "location": self.location or "",
            "manager": self.manager or "",
            "phone": self.phone or "",
            "gym_id": self.gym_id,
        }

    def save(self, *args, **kwargs):
        self.updated_at = datetime.now(timezone.utc)
        return super().save(*args, **kwargs)
