"""PT Session model."""
from datetime import datetime, timezone
from app.extensions import db


class SessionLog(db.EmbeddedDocument):
    """Log entry for a completed PT session."""
    date = db.StringField()
    notes = db.StringField(default="")
    trainer_id = db.StringField()


class PtSession(db.Document):
    """Personal Training session assignment for a member."""

    member_id = db.ReferenceField("Member", dbref=False, required=True)
    member_name = db.StringField(max_length=100)
    trainer_id = db.ReferenceField("Trainer", dbref=False, required=True)
    trainer_name = db.StringField(max_length=100)
    package_id = db.ReferenceField("PtPackage", dbref=False)
    sessions_total = db.IntField(default=0)
    sessions_completed = db.IntField(default=0)
    sessions_remaining = db.IntField(default=0)
    start_date = db.StringField()
    end_date = db.StringField()
    payment_id = db.ReferenceField("Payment", dbref=False)
    session_logs = db.EmbeddedDocumentListField(SessionLog, default=list)
    scheduled_date = db.StringField()
    scheduled_time = db.StringField()

    # Multi-tenancy
    gym_id = db.StringField(default="vikings")
    branch_id = db.StringField(default="aurangabad")

    # Timestamps
    created_at = db.DateTimeField(default=lambda: datetime.now(timezone.utc))
    updated_at = db.DateTimeField(default=lambda: datetime.now(timezone.utc))
    is_deleted = db.BooleanField(default=False)

    meta = {
        "collection": "pt_sessions",
        "indexes": ["member_id", "trainer_id", "gym_id", "branch_id"],
    }

    def to_dict(self):
        return {
            "id": str(self.id),
            "memberId": str(self.member_id.id) if self.member_id else "",
            "memberName": self.member_name or "",
            "trainerId": str(self.trainer_id.id) if self.trainer_id else "",
            "trainerName": self.trainer_name or "",
            "packageId": str(self.package_id.id) if self.package_id else "",
            "totalSessions": self.sessions_total,
            "completedSessions": self.sessions_completed,
            "sessionsRemaining": self.sessions_remaining,
            "startDate": self.start_date or "",
            "endDate": self.end_date or "",
            "scheduledDate": self.scheduled_date or "",
            "scheduledTime": self.scheduled_time or "",
            "sessionLogs": [
                {"date": l.date, "notes": l.notes, "trainerId": l.trainer_id}
                for l in self.session_logs
            ],
            "gym_id": self.gym_id,
            "branch_id": self.branch_id,
        }

    def save(self, *args, **kwargs):
        self.sessions_remaining = self.sessions_total - self.sessions_completed
        self.updated_at = datetime.now(timezone.utc)
        return super().save(*args, **kwargs)
