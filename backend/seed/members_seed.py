"""Seed data for Members."""
import random
from datetime import datetime, timedelta, timezone
from app.models.member import Member
from app.models.user import User
from app.models.branch import Branch
from seed.utils import fake, get_fake_phone

GOALS = ["Weight Loss", "Muscle Gain", "General Fitness", "Endurance", "Flexibility", "Strength Training"]
MEDICAL_CONDITIONS = ["None", "None", "None", "Asthma", "Diabetes", "Hypertension", "Lower Back Pain", "Knee Injury"]

def seed_members(num_members=500):
    """Seed members with realistic Indian profiles."""
    print(f"Seeding {num_members} members...")
    members_created = 0
    
    branches = list(Branch.objects())
    if not branches:
        print("No branches found, cannot seed members!")
        return 0

    # Ensure Member User account exists for linking (optional, but good practice)
    member_user = User.objects(email="member@vikingsgym.in").first()

    for i in range(num_members):
        branch = random.choice(branches)
        
        gender = random.choice(["Male", "Female"])
        if gender == "Male":
            name = fake.name_male()
        else:
            name = fake.name_female()

        email = f"{name.lower().replace(' ', '.')}.{random.randint(100, 9999)}@gmail.com"
        
        # Determine if we link the first one to the test account
        user_link = str(member_user.id) if (i == 0 and member_user) else ""
        if i == 0 and member_user:
            email = member_user.email
            name = member_user.name
            
        if Member.objects(email=email).first():
            continue

        dob = fake.date_of_birth(minimum_age=16, maximum_age=65).isoformat()
        joined_date = fake.date_between(start_date="-2y", end_date="today").isoformat()
        
        height = random.randint(150, 190)
        weight = random.randint(50, 110)
        bmi = round(weight / ((height / 100) ** 2), 2)

        Member(
            user_id=user_link,
            member_id=f"VK-{i+1:04d}",
            name=name,
            phone=get_fake_phone(),
            email=email,
            dob=dob,
            gender=gender,
            address=fake.address().replace("\n", ", "),
            blood_group=random.choice(["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"]),
            medical_conditions=random.choice(MEDICAL_CONDITIONS),
            emergency_contact_name=fake.name(),
            emergency_contact_phone=get_fake_phone(),
            photo_url="",
            fitness_goal=random.choice(GOALS),
            height=height,
            weight=weight,
            bmi=bmi,
            referral_code=f"VIK-{i+1:04d}-{random.randint(10, 99)}",
            wallet_balance=random.choice([0, 0, 0, 500, 1000]),
            gym_id="vikings",
            branch_id=branch.name.lower().replace(" ", ""), # simplistically mapping it
            joined_date=joined_date
        ).save()
        members_created += 1
        
        if (i+1) % 100 == 0:
            print(f"  Created {i+1} members...")
            
    return members_created
