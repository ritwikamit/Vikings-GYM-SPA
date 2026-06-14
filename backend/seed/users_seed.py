"""Seed data for Users (Staff, Admin, Managers)."""
import random
from app.models.user import User
from app.services.auth_service import AuthService
from seed.utils import fake, get_fake_phone

TEST_ACCOUNTS = [
    {"name": "Admin User", "email": "admin@vikingsgym.in", "role": "SUPER_ADMIN", "password": "Admin@123"},
    {"name": "Owner User", "email": "owner@vikingsgym.in", "role": "GYM_OWNER", "password": "Owner@123"},
    {"name": "Receptionist User", "email": "reception@vikingsgym.in", "role": "RECEPTIONIST", "password": "Recep@123"},
    {"name": "Trainer User", "email": "trainer@vikingsgym.in", "role": "TRAINER", "password": "Trainer@123"},
    {"name": "Member User", "email": "member@vikingsgym.in", "role": "MEMBER", "password": "Member@123"},
]

def seed_users(num_staff=50):
    """Seed test accounts and random staff users."""
    print(f"Seeding users...")
    users_created = 0
    
    # 1. Create strict test accounts
    for acc in TEST_ACCOUNTS:
        u = User.objects(email=acc["email"]).first()
        if not u:
            User(
                name=acc["name"],
                email=acc["email"],
                phone=get_fake_phone(),
                password_hash=AuthService.hash_password(acc["password"]),
                role=acc["role"],
                gym_id="vikings",
                branch_id="aurangabad"
            ).save()
            users_created += 1

    # 2. Generate random staff members (excluding members and test accounts)
    staff_roles = ["RECEPTIONIST", "TRAINER", "BRANCH_MANAGER", "ACCOUNTANT", "NUTRITIONIST"]
    
    for _ in range(num_staff):
        role = random.choice(staff_roles)
        name = fake.name()
        email = f"{name.lower().replace(' ', '.')}.{random.randint(1,99)}@vikingsgym.in"
        if not User.objects(email=email).first():
            User(
                name=name,
                email=email,
                phone=get_fake_phone(),
                password_hash=AuthService.hash_password("Staff@123"),
                role=role,
                gym_id="vikings",
                branch_id=random.choice(["aurangabad", "pune", "mumbai", "bangalore", "delhi"])
            ).save()
            users_created += 1
            
    return users_created
