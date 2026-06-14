"""Lead model for CRM."""
from datetime import datetime, timezone
from app.extensions import db


class Lead(db.Document):
    """Sales lead / prospect."""

    SOURCE_CHOICES = ("Instagram", "Facebook", "Google", "Website", "Referral", "WalkIn")
    STATUS_CHOICES = ("New", "Contacted", "Trial", "Negotiation", "Converted", "Lost")

    name = db.StringField(required=True, max_length=100)
    phone = db.StringField(required=True, max_length=15)
    email = db.StringField(max_length=150)
    source = db.StringField(choices=SOURCE_CHOICES, default="WalkIn")
    status = db.StringField(choices=STATUS_CHOICES, default="New")
    assigned_to = db.ReferenceField("User", dbref=False)
    notes = db.StringField(default="")
    follow_up_date = db.StringField()
    converted_at = db.DateTimeField()

    # Multi-tenancy
    gym_id = db.StringField(default="vikings")
    branch_id = db.StringField(default="aurangabad")

    # Timestamps
    created_at = db.DateTimeField(default=lambda: datetime.now(timezone.utc))
    updated_at = db.DateTimeField(default=lambda: datetime.now(timezone.utc))
    is_deleted = db.BooleanField(default=False)

    meta = {
        "collection": "leads",
        "indexes": ["status", "source", "gym_id", "branch_id"],
        "ordering": ["-created_at"],
    }

    def to_dict(self):
        return {
            "id": str(self.id),
            "name": self.name,
            "phone": self.phone,
            "email": self.email or "",
            "source": self.source,
            "stage": self.status,
            "assignedTrainerId": str(self.assigned_to.id) if self.assigned_to else "",
            "notes": self.notes or "",
            "followUpDate": self.follow_up_date or "",
            "createdAt": self.created_at.strftime("%Y-%m-%d") if self.created_at else "",
            "gym_id": self.gym_id,
            "branch_id": self.branch_id,
        }

    def save(self, *args, **kwargs):
        self.updated_at = datetime.now(timezone.utc)
        return super().save(*args, **kwargs)
