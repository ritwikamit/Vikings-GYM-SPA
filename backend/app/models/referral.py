"""Referral model."""
from datetime import datetime, timezone
from app.extensions import db


class Referral(db.Document):
    """Member referral tracking and rewards."""

    STATUS_CHOICES = ("Pending", "Converted", "Rewarded")

    referrer_id = db.ReferenceField("Member", dbref=False, required=True)
    referrer_name = db.StringField(max_length=100)
    referred_name = db.StringField(required=True, max_length=100)
    referred_phone = db.StringField(max_length=15)
    referred_id = db.ReferenceField("Member", dbref=False)
    referral_code = db.StringField()
    status = db.StringField(choices=STATUS_CHOICES, default="Pending")
    reward_amount = db.FloatField(default=0)
    reward_credited = db.BooleanField(default=False)

    # Multi-tenancy
    gym_id = db.StringField(default="vikings")
    branch_id = db.StringField(default="aurangabad")

    # Timestamps
    created_at = db.DateTimeField(default=lambda: datetime.now(timezone.utc))
    updated_at = db.DateTimeField(default=lambda: datetime.now(timezone.utc))
    is_deleted = db.BooleanField(default=False)

    meta = {
        "collection": "referrals",
        "indexes": ["referrer_id", "status", "referral_code", "gym_id", "branch_id"],
    }

    def to_dict(self):
        return {
            "id": str(self.id),
            "referrerId": str(self.referrer_id.id) if self.referrer_id else "",
            "referrerName": self.referrer_name or "",
            "refereeName": self.referred_name,
            "refereeId": str(self.referred_id.id) if self.referred_id else "",
            "referralCode": self.referral_code or "",
            "status": self.status.upper() if self.status else "PENDING",
            "rewardCredits": self.reward_amount,
            "date": self.created_at.strftime("%Y-%m-%d") if self.created_at else "",
            "gym_id": self.gym_id,
            "branch_id": self.branch_id,
        }

    def save(self, *args, **kwargs):
        self.updated_at = datetime.now(timezone.utc)
        return super().save(*args, **kwargs)
