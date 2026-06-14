"""Progress tracking model."""
from datetime import datetime, timezone
from app.extensions import db


class Measurements(db.EmbeddedDocument):
    """Body measurements in cm."""
    chest = db.FloatField(default=0)
    waist = db.FloatField(default=0)
    arms = db.FloatField(default=0)
    neck = db.FloatField(default=0)
    thigh = db.FloatField(default=0)


class Progress(db.Document):
    """Member fitness progress records."""

    member_id = db.ReferenceField("Member", dbref=False, required=True)
    date = db.StringField(required=True)
    weight = db.FloatField(default=0)
    bmi = db.FloatField(default=0)
    body_fat_percent = db.FloatField(default=0)
    measurements = db.EmbeddedDocumentField(Measurements, default=Measurements)
    before_photo_url = db.StringField(default="")
    after_photo_url = db.StringField(default="")
    notes = db.StringField(default="")
    recorded_by = db.StringField(max_length=100)

    # Multi-tenancy
    gym_id = db.StringField(default="vikings")
    branch_id = db.StringField(default="aurangabad")

    # Timestamps
    created_at = db.DateTimeField(default=lambda: datetime.now(timezone.utc))
    updated_at = db.DateTimeField(default=lambda: datetime.now(timezone.utc))
    is_deleted = db.BooleanField(default=False)

    meta = {
        "collection": "progress",
        "indexes": ["member_id", "date", "gym_id", "branch_id"],
        "ordering": ["-date"],
    }

    def to_dict(self):
        m = self.measurements or Measurements()
        return {
            "id": str(self.id),
            "memberId": str(self.member_id.id) if self.member_id else "",
            "date": self.date,
            "weight": self.weight,
            "bmi": self.bmi,
            "bodyFatPct": self.body_fat_percent,
            "measurements": {
                "chest": m.chest,
                "waist": m.waist,
                "arms": m.arms,
                "neck": m.neck,
                "thigh": m.thigh,
            },
            "beforePhotoUrl": self.before_photo_url or "",
            "afterPhotoUrl": self.after_photo_url or "",
            "notes": self.notes or "",
            "recordedBy": self.recorded_by or "",
            "gym_id": self.gym_id,
            "branch_id": self.branch_id,
        }

    def save(self, *args, **kwargs):
        self.updated_at = datetime.now(timezone.utc)
        return super().save(*args, **kwargs)
