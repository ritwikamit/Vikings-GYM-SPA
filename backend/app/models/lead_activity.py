"""Lead Activity model for CRM follow-ups."""
from datetime import datetime, timezone
from app.extensions import db


class LeadActivity(db.Document):
    """Activity tracking for leads (Calls, WhatsApp, Meetings)."""

    TYPE_CHOICES = ("Call", "WhatsApp", "Email", "Meeting", "Note")

    lead_id = db.ReferenceField("Lead", dbref=False, required=True)
    activity_type = db.StringField(choices=TYPE_CHOICES, default="Note")
    notes = db.StringField(required=True)
    date = db.StringField()
    performed_by = db.ReferenceField("User", dbref=False)
    
    # Multi-tenancy
    gym_id = db.StringField(default="vikings")
    branch_id = db.StringField(default="aurangabad")

    # Timestamps
    created_at = db.DateTimeField(default=lambda: datetime.now(timezone.utc))
    updated_at = db.DateTimeField(default=lambda: datetime.now(timezone.utc))
    is_deleted = db.BooleanField(default=False)

    meta = {
        "collection": "lead_activities",
        "indexes": ["lead_id", "activity_type", "date", "gym_id", "branch_id"],
        "ordering": ["-created_at"],
    }

    def to_dict(self):
        return {
            "id": str(self.id),
            "leadId": str(self.lead_id.id) if self.lead_id else "",
            "activityType": self.activity_type,
            "notes": self.notes,
            "date": self.date or "",
            "performedBy": str(self.performed_by.id) if self.performed_by else "",
            "gym_id": self.gym_id,
            "branch_id": self.branch_id,
        }

    def save(self, *args, **kwargs):
        self.updated_at = datetime.now(timezone.utc)
        return super().save(*args, **kwargs)
