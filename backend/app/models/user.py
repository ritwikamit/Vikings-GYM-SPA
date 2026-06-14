"""User model with RBAC roles."""
from datetime import datetime, timezone
from app.extensions import db


class User(db.Document):
    """User model supporting all application roles."""

    ROLE_CHOICES = (
        ("SUPER_ADMIN", "Super Admin"),
        ("GYM_OWNER", "Gym Owner"),
        ("BRANCH_MANAGER", "Branch Manager"),
        ("RECEPTIONIST", "Receptionist"),
        ("TRAINER", "Trainer"),
        ("ACCOUNTANT", "Accountant"),
        ("NUTRITIONIST", "Nutritionist"),
        ("MEMBER", "Member"),
    )

    name = db.StringField(required=True, max_length=100)
    email = db.StringField(required=True, unique=True, max_length=150)
    phone = db.StringField(max_length=15)
    password_hash = db.StringField(required=True)
    role = db.StringField(required=True, choices=[r[0] for r in ROLE_CHOICES])
    is_active = db.BooleanField(default=True)
    last_login = db.DateTimeField()
    avatar = db.StringField(default="")

    # Multi-tenancy
    gym_id = db.StringField(default="vikings")
    branch_id = db.StringField(default="aurangabad")

    # Timestamps
    created_at = db.DateTimeField(default=lambda: datetime.now(timezone.utc))
    updated_at = db.DateTimeField(default=lambda: datetime.now(timezone.utc))
    is_deleted = db.BooleanField(default=False)

    meta = {
        "collection": "users",
        "indexes": ["email", "role", "gym_id", "branch_id"],
    }

    def to_dict(self):
        return {
            "id": str(self.id),
            "name": self.name,
            "email": self.email,
            "phone": self.phone or "",
            "role": self.role,
            "is_active": self.is_active,
            "last_login": self.last_login.isoformat() if self.last_login else None,
            "avatar": self.avatar or "",
            "gym_id": self.gym_id,
            "branch_id": self.branch_id,
            "created_at": self.created_at.isoformat() if self.created_at else None,
        }

    def save(self, *args, **kwargs):
        self.updated_at = datetime.now(timezone.utc)
        return super().save(*args, **kwargs)
