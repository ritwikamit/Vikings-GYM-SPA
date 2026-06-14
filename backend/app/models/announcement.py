"""Announcement model."""
from datetime import datetime, timezone
from app.extensions import db


class Announcement(db.Document):
    """Gym announcements and broadcasts."""

    title = db.StringField(required=True, max_length=200)
    body = db.StringField(required=True)
    target_roles = db.ListField(db.StringField(), default=lambda: ["ALL"])
    scheduled_at = db.DateTimeField()
    published_at = db.DateTimeField()
    is_published = db.BooleanField(default=False)
    created_by = db.StringField(max_length=100)

    # Multi-tenancy
    gym_id = db.StringField(default="vikings")
    branch_id = db.StringField(default="aurangabad")

    # Timestamps
    created_at = db.DateTimeField(default=lambda: datetime.now(timezone.utc))
    updated_at = db.DateTimeField(default=lambda: datetime.now(timezone.utc))
    is_deleted = db.BooleanField(default=False)

    meta = {
        "collection": "announcements",
        "indexes": ["is_published", "gym_id", "branch_id"],
        "ordering": ["-created_at"],
    }

    def to_dict(self):
        target = self.target_roles[0] if self.target_roles else "ALL"
        return {
            "id": str(self.id),
            "title": self.title,
            "content": self.body,
            "date": self.published_at.strftime("%Y-%m-%d") if self.published_at else
                     self.created_at.strftime("%Y-%m-%d") if self.created_at else "",
            "scheduledTime": self.scheduled_at.isoformat() if self.scheduled_at else "",
            "pushed": self.is_published,
            "targetRole": target,
            "createdBy": self.created_by or "",
            "gym_id": self.gym_id,
            "branch_id": self.branch_id,
        }

    def save(self, *args, **kwargs):
        self.updated_at = datetime.now(timezone.utc)
        return super().save(*args, **kwargs)
