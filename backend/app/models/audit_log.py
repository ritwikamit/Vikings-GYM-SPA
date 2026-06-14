"""Audit Log model."""
from datetime import datetime, timezone
from app.extensions import db


class AuditLog(db.Document):
    """Immutable audit trail for all user actions."""

    user_id = db.StringField()
    user_name = db.StringField(max_length=100)
    user_email = db.StringField(max_length=150)
    role = db.StringField(max_length=20)
    action = db.StringField(required=True)
    module = db.StringField(max_length=100)
    ip_address = db.StringField(max_length=45)
    details = db.StringField(default="")
    timestamp = db.DateTimeField(default=lambda: datetime.now(timezone.utc))

    # Multi-tenancy
    gym_id = db.StringField(default="vikings")
    branch_id = db.StringField(default="aurangabad")

    meta = {
        "collection": "audit_logs",
        "indexes": ["user_id", "module", "timestamp", "gym_id", "branch_id"],
        "ordering": ["-timestamp"],
    }

    def to_dict(self):
        return {
            "id": str(self.id),
            "userName": self.user_name or "",
            "userEmail": self.user_email or "",
            "role": self.role or "",
            "action": self.action,
            "module": self.module or "",
            "timestamp": self.timestamp.strftime("%Y-%m-%d %H:%M:%S") if self.timestamp else "",
            "ipAddress": self.ip_address or "",
            "details": self.details or "",
            "gym_id": self.gym_id,
            "branch_id": self.branch_id,
        }
