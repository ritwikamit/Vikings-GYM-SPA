"""Locker model."""
from datetime import datetime, timezone
from app.extensions import db


class Locker(db.Document):
    """Gym locker management."""

    STATUS_CHOICES = ("Available", "Occupied", "Maintenance")

    locker_number = db.StringField(required=True, unique=True)
    member_id = db.ReferenceField("Member", dbref=False)
    member_name = db.StringField(max_length=100)
    start_date = db.StringField()
    end_date = db.StringField()
    rent = db.FloatField(default=0)
    status = db.StringField(choices=STATUS_CHOICES, default="Available")

    # Multi-tenancy
    gym_id = db.StringField(default="vikings")
    branch_id = db.StringField(default="aurangabad")

    # Timestamps
    created_at = db.DateTimeField(default=lambda: datetime.now(timezone.utc))
    updated_at = db.DateTimeField(default=lambda: datetime.now(timezone.utc))
    is_deleted = db.BooleanField(default=False)

    meta = {
        "collection": "lockers",
        "indexes": ["locker_number", "status", "gym_id", "branch_id"],
    }

    def to_dict(self):
        return {
            "id": str(self.id),
            "number": self.locker_number,
            "assignedMemberId": str(self.member_id.id) if self.member_id else "",
            "assignedMemberName": self.member_name or "",
            "startDate": self.start_date or "",
            "endDate": self.end_date or "",
            "rentAmount": self.rent,
            "status": self.status,
            "gym_id": self.gym_id,
            "branch_id": self.branch_id,
        }

    def save(self, *args, **kwargs):
        self.updated_at = datetime.now(timezone.utc)
        return super().save(*args, **kwargs)
