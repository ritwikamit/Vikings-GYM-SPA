"""Member model."""
from datetime import datetime, timezone
from app.extensions import db


class Member(db.Document):
    """Gym member profile."""

    user_id = db.ReferenceField("User", dbref=False)
    member_id = db.StringField(unique=True)  # Auto: VK-001
    name = db.StringField(required=True, max_length=100)
    phone = db.StringField(required=True, max_length=15)
    email = db.StringField(required=True, max_length=150)
    dob = db.StringField(max_length=20)
    gender = db.StringField(choices=["Male", "Female", "Other"])
    address = db.StringField(max_length=500)
    blood_group = db.StringField(max_length=5)
    medical_conditions = db.StringField(default="")
    emergency_contact_name = db.StringField(max_length=100)
    emergency_contact_phone = db.StringField(max_length=15)
    photo_url = db.StringField(default="")
    fitness_goal = db.StringField(max_length=200)
    height = db.FloatField(default=0)  # cm
    weight = db.FloatField(default=0)  # kg
    bmi = db.FloatField(default=0)
    referral_code = db.StringField(unique=True)
    referred_by = db.StringField(default="")
    qr_code = db.StringField(default="")  # base64 PNG
    wallet_balance = db.FloatField(default=0)
    joined_date = db.StringField()

    # Multi-tenancy
    gym_id = db.StringField(default="vikings")
    branch_id = db.StringField(default="aurangabad")

    # Timestamps
    created_at = db.DateTimeField(default=lambda: datetime.now(timezone.utc))
    updated_at = db.DateTimeField(default=lambda: datetime.now(timezone.utc))
    is_deleted = db.BooleanField(default=False)

    meta = {
        "collection": "members",
        "indexes": ["member_id", "email", "phone", "referral_code", "gym_id", "branch_id"],
    }

    def calculate_bmi(self):
        if self.height and self.height > 0:
            height_m = self.height / 100
            self.bmi = round(self.weight / (height_m * height_m), 2)
        else:
            self.bmi = 0

    def to_dict(self):
        return {
            "id": str(self.id),
            "userId": str(self.user_id.id) if self.user_id else None,
            "memberId": self.member_id,
            "name": self.name,
            "phone": self.phone,
            "email": self.email,
            "dob": self.dob or "",
            "gender": self.gender or "",
            "address": self.address or "",
            "bloodGroup": self.blood_group or "",
            "medicalConditions": self.medical_conditions or "",
            "emergencyContactName": self.emergency_contact_name or "",
            "emergencyContactPhone": self.emergency_contact_phone or "",
            "photoUrl": self.photo_url or "",
            "fitnessGoal": self.fitness_goal or "",
            "height": self.height,
            "weight": self.weight,
            "bmi": self.bmi,
            "referralCode": self.referral_code or "",
            "referredBy": self.referred_by or "",
            "walletCredits": self.wallet_balance,
            "qrCode": self.qr_code or "",
            "joinedDate": self.joined_date or "",
            "gym_id": self.gym_id,
            "branch_id": self.branch_id,
        }

    def save(self, *args, **kwargs):
        self.calculate_bmi()
        self.updated_at = datetime.now(timezone.utc)
        return super().save(*args, **kwargs)
