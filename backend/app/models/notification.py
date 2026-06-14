"""Notification model."""
from datetime import datetime, timezone
from app.extensions import db


class Notification(db.Document):
    """In-app notifications for users."""

    TYPE_CHOICES = ("MembershipExpiry", "Birthday", "Payment", "Attendance",
                    "Announcement", "Expiry")

    user_id = db.StringField(required=True)
    notification_type = db.StringField(choices=TYPE_CHOICES, default="Announcement")
    title = db.StringField(required=True, max_length=200)
    message = db.StringField(required=True)
    is_read = db.BooleanField(default=False)
    sent_at = db.DateTimeField(default=lambda: datetime.now(timezone.utc))

    # Multi-tenancy
    gym_id = db.StringField(default="vikings")
    branch_id = db.StringField(default="aurangabad")

    # Timestamps
    created_at = db.DateTimeField(default=lambda: datetime.now(timezone.utc))
    updated_at = db.DateTimeField(default=lambda: datetime.now(timezone.utc))
    is_deleted = db.BooleanField(default=False)

    meta = {
        "collection": "notifications",
        "indexes": ["user_id", "is_read", "gym_id", "branch_id"],
        "ordering": ["-sent_at"],
    }

    def to_dict(self):
        return {
            "id": str(self.id),
            "userId": self.user_id,
            "type": self.notification_type,
            "title": self.title,
            "message": self.message,
            "read": self.is_read,
            "date": self.sent_at.strftime("%Y-%m-%d") if self.sent_at else "",
            "gym_id": self.gym_id,
            "branch_id": self.branch_id,
        }

    def save(self, *args, **kwargs):
        self.updated_at = datetime.now(timezone.utc)
        return super().save(*args, **kwargs)
