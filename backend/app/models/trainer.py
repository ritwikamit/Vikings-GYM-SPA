"""Trainer model."""
from datetime import datetime, timezone
from app.extensions import db


class Trainer(db.Document):
    """Gym trainer profile."""

    user_id = db.ReferenceField("User", dbref=False)
    name = db.StringField(required=True, max_length=100)
    phone = db.StringField(required=True, max_length=15)
    email = db.StringField(required=True, max_length=150)
    experience_years = db.IntField(default=0)
    certifications = db.ListField(db.StringField(), default=list)
    specializations = db.ListField(db.StringField(), default=list)
    salary = db.FloatField(default=0)
    commission_percent = db.FloatField(default=0)
    assigned_members = db.ListField(db.StringField(), default=list)
    rating = db.FloatField(default=0)
    status = db.StringField(choices=["Active", "Inactive"], default="Active")

    # Multi-tenancy
    gym_id = db.StringField(default="vikings")
    branch_id = db.StringField(default="aurangabad")

    # Timestamps
    created_at = db.DateTimeField(default=lambda: datetime.now(timezone.utc))
    updated_at = db.DateTimeField(default=lambda: datetime.now(timezone.utc))
    is_deleted = db.BooleanField(default=False)

    meta = {
        "collection": "trainers",
        "indexes": ["email", "gym_id", "branch_id"],
    }

    def to_dict(self):
        return {
            "id": str(self.id),
            "userId": str(self.user_id.id) if self.user_id else None,
            "name": self.name,
            "phone": self.phone,
            "email": self.email,
            "experienceYears": self.experience_years,
            "certifications": self.certifications,
            "specializations": self.specializations,
            "salary": self.salary,
            "commissionRate": self.commission_percent,
            "assignedClientsCount": len(self.assigned_members),
            "rating": self.rating,
            "status": self.status,
            "gym_id": self.gym_id,
            "branch_id": self.branch_id,
        }

    def save(self, *args, **kwargs):
        self.updated_at = datetime.now(timezone.utc)
        return super().save(*args, **kwargs)
