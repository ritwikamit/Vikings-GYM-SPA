"""Workout model."""
from datetime import datetime, timezone
from app.extensions import db


class Exercise(db.EmbeddedDocument):
    """Single exercise within a workout plan."""
    day = db.StringField()  # e.g. "Monday"
    name = db.StringField(required=True)
    sets = db.IntField(default=3)
    reps = db.StringField(default="12")
    weight = db.FloatField(default=0)
    rest_seconds = db.IntField(default=60)
    notes = db.StringField(default="")


class Workout(db.Document):
    """Workout plan assigned to a member."""

    CATEGORY_CHOICES = (
        "Weight Loss", "Muscle Gain", "Fat Loss",
        "Strength", "Beginner", "Advanced",
    )

    title = db.StringField(required=True, max_length=200)
    category = db.StringField(choices=CATEGORY_CHOICES, default="Beginner")
    created_by = db.ReferenceField("Trainer", dbref=False)
    created_by_name = db.StringField(max_length=100)
    assigned_to = db.ReferenceField("Member", dbref=False)
    assigned_to_name = db.StringField(max_length=100)
    exercises = db.EmbeddedDocumentListField(Exercise, default=list)
    duration_weeks = db.IntField(default=4)
    days_per_week = db.IntField(default=5)
    start_from = db.StringField()
    end_at = db.StringField()
    notes = db.StringField(default="")

    # Multi-tenancy
    gym_id = db.StringField(default="vikings")
    branch_id = db.StringField(default="aurangabad")

    # Timestamps
    created_at = db.DateTimeField(default=lambda: datetime.now(timezone.utc))
    updated_at = db.DateTimeField(default=lambda: datetime.now(timezone.utc))
    is_deleted = db.BooleanField(default=False)

    meta = {
        "collection": "workouts",
        "indexes": ["assigned_to", "created_by", "category", "gym_id", "branch_id"],
    }

    def to_dict(self):
        return {
            "id": str(self.id),
            "name": self.title,
            "memberId": str(self.assigned_to.id) if self.assigned_to else "",
            "memberName": self.assigned_to_name or "",
            "trainerId": str(self.created_by.id) if self.created_by else "",
            "trainerName": self.created_by_name or "",
            "category": self.category,
            "exercises": [
                {
                    "day": e.day or "",
                    "name": e.name,
                    "sets": e.sets,
                    "reps": e.reps,
                    "weight": e.weight,
                    "restSeconds": e.rest_seconds,
                    "notes": e.notes or "",
                }
                for e in self.exercises
            ],
            "durationWeeks": self.duration_weeks,
            "daysPerWeek": self.days_per_week,
            "startFrom": self.start_from or "",
            "endAt": self.end_at or "",
            "notes": self.notes or "",
            "gym_id": self.gym_id,
            "branch_id": self.branch_id,
        }

    def save(self, *args, **kwargs):
        self.updated_at = datetime.now(timezone.utc)
        return super().save(*args, **kwargs)
