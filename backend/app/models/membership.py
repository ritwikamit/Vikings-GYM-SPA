"""Membership and MembershipPlan models."""
from datetime import datetime, timezone
from app.extensions import db


class MembershipPlan(db.Document):
    """Plan catalog (templates for memberships)."""

    name = db.StringField(required=True, max_length=100)
    duration_months = db.IntField(required=True)
    price = db.FloatField(required=True)
    description = db.StringField(default="")

    gym_id = db.StringField(default="vikings")
    branch_id = db.StringField(default="aurangabad")
    created_at = db.DateTimeField(default=lambda: datetime.now(timezone.utc))
    updated_at = db.DateTimeField(default=lambda: datetime.now(timezone.utc))
    is_deleted = db.BooleanField(default=False)

    meta = {
        "collection": "membership_plans",
        "indexes": ["gym_id", "branch_id"],
    }

    def to_dict(self):
        return {
            "id": str(self.id),
            "name": self.name,
            "durationMonths": self.duration_months,
            "price": self.price,
            "description": self.description or "",
            "gym_id": self.gym_id,
            "branch_id": self.branch_id,
        }


class Membership(db.Document):
    """Member's active/past membership subscription."""

    STATUS_CHOICES = ("ACTIVE", "EXPIRED", "FREEZED", "CANCELLED")

    member_id = db.ReferenceField("Member", dbref=False, required=True)
    plan_id = db.ReferenceField("MembershipPlan", dbref=False)
    plan_name = db.StringField(max_length=100)
    plan_type = db.StringField(max_length=50)  # Monthly/Quarterly/HalfYearly/Annual
    start_date = db.StringField(required=True)
    end_date = db.StringField(required=True)
    price = db.FloatField(default=0)
    discount = db.FloatField(default=0)
    coupon_code = db.StringField(default="")
    status = db.StringField(choices=STATUS_CHOICES, default="ACTIVE")
    payment_id = db.ReferenceField("Payment", dbref=False)
    freeze_start = db.StringField()
    freeze_end = db.StringField()
    frozen_days = db.IntField(default=0)
    auto_renew = db.BooleanField(default=False)

    # Multi-tenancy
    gym_id = db.StringField(default="vikings")
    branch_id = db.StringField(default="aurangabad")

    # Timestamps
    created_at = db.DateTimeField(default=lambda: datetime.now(timezone.utc))
    updated_at = db.DateTimeField(default=lambda: datetime.now(timezone.utc))
    is_deleted = db.BooleanField(default=False)

    meta = {
        "collection": "memberships",
        "indexes": ["member_id", "status", "end_date", "gym_id", "branch_id"],
    }

    def to_dict(self):
        return {
            "id": str(self.id),
            "memberId": str(self.member_id.id) if self.member_id else "",
            "planId": str(self.plan_id.id) if self.plan_id else "",
            "planName": self.plan_name or "",
            "startDate": self.start_date,
            "endDate": self.end_date,
            "price": self.price,
            "status": self.status,
            "frozenDays": self.frozen_days,
            "gym_id": self.gym_id,
            "branch_id": self.branch_id,
        }

    def save(self, *args, **kwargs):
        self.updated_at = datetime.now(timezone.utc)
        return super().save(*args, **kwargs)
