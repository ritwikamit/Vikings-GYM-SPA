"""Attendance model."""
from datetime import datetime, timezone
from app.extensions import db


class Attendance(db.Document):
    """Member check-in/check-out records."""

    member_id = db.ReferenceField("Member", dbref=False, required=True)
    member_name = db.StringField(max_length=100)
    member_email = db.StringField(max_length=150)
    check_in = db.DateTimeField()
    check_out = db.DateTimeField()
    duration_minutes = db.IntField(default=0)
    method = db.StringField(choices=["QR", "Manual", "Reception", "RFID"], default="QR")
    date = db.StringField(required=True)  # YYYY-MM-DD

    # Multi-tenancy
    gym_id = db.StringField(default="vikings")
    branch_id = db.StringField(default="aurangabad")

    # Timestamps
    created_at = db.DateTimeField(default=lambda: datetime.now(timezone.utc))
    updated_at = db.DateTimeField(default=lambda: datetime.now(timezone.utc))
    is_deleted = db.BooleanField(default=False)

    meta = {
        "collection": "attendance",
        "indexes": ["member_id", "date", "gym_id", "branch_id"],
        "ordering": ["-check_in"],
    }

    def to_dict(self):
        return {
            "id": str(self.id),
            "memberId": str(self.member_id.id) if self.member_id else "",
            "memberName": self.member_name or "",
            "memberEmail": self.member_email or "",
            "date": self.date,
            "checkInTime": self.check_in.strftime("%I:%M %p") if self.check_in else "",
            "checkOutTime": self.check_out.strftime("%I:%M %p") if self.check_out else "",
            "durationMinutes": self.duration_minutes,
            "method": self.method,
            "gym_id": self.gym_id,
            "branch_id": self.branch_id,
        }

    def save(self, *args, **kwargs):
        if self.check_in and self.check_out:
            diff = self.check_out - self.check_in
            self.duration_minutes = int(diff.total_seconds() / 60)
        self.updated_at = datetime.now(timezone.utc)
        return super().save(*args, **kwargs)
