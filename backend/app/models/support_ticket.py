"""Support Ticket model for issue tracking."""
from datetime import datetime, timezone
from app.extensions import db


class SupportTicket(db.Document):
    """Member support ticket/issue."""

    STATUS_CHOICES = ("Open", "In Progress", "Resolved", "Closed")

    member_id = db.ReferenceField("Member", dbref=False, required=True)
    member_name = db.StringField()
    subject = db.StringField(required=True, max_length=200)
    description = db.StringField(required=True)
    status = db.StringField(choices=STATUS_CHOICES, default="Open")
    assigned_to = db.ReferenceField("User", dbref=False)
    
    # Multi-tenancy
    gym_id = db.StringField(default="vikings")
    branch_id = db.StringField(default="aurangabad")

    # Timestamps
    created_at = db.DateTimeField(default=lambda: datetime.now(timezone.utc))
    updated_at = db.DateTimeField(default=lambda: datetime.now(timezone.utc))
    is_deleted = db.BooleanField(default=False)

    meta = {
        "collection": "support_tickets",
        "indexes": ["status", "member_id", "assigned_to", "gym_id", "branch_id"],
        "ordering": ["-created_at"],
    }

    def to_dict(self):
        return {
            "id": str(self.id),
            "memberId": str(self.member_id.id) if self.member_id else "",
            "memberName": self.member_name or "",
            "subject": self.subject,
            "description": self.description,
            "status": self.status,
            "assignedTo": str(self.assigned_to.id) if self.assigned_to else "",
            "gym_id": self.gym_id,
            "branch_id": self.branch_id,
            "createdAt": self.created_at.isoformat() if self.created_at else "",
            "updatedAt": self.updated_at.isoformat() if self.updated_at else "",
        }

    def save(self, *args, **kwargs):
        self.updated_at = datetime.now(timezone.utc)
        return super().save(*args, **kwargs)
