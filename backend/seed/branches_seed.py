"""Seed data for Branches."""
from app.models.branch import Branch
from seed.utils import fake, get_fake_phone

BRANCH_DATA = [
    {"name": "Aurangabad H.O", "location": "Connaught Place, CIDCO, Aurangabad", "manager": "Ravi Kadam"},
    {"name": "Pune Branch", "location": "Koregaon Park, Pune", "manager": "Aditi Sharma"},
    {"name": "Mumbai Branch", "location": "Andheri West, Mumbai", "manager": "Vikram Singh"},
    {"name": "Bangalore Branch", "location": "Indiranagar, Bangalore", "manager": "Neha Reddy"},
    {"name": "Delhi Branch", "location": "Vasant Vihar, New Delhi", "manager": "Arjun Malhotra"},
]

def seed_branches():
    """Seed 5 multi-city branches."""
    print("Seeding branches...")
    branches_created = 0
    for data in BRANCH_DATA:
        b = Branch.objects(name=data["name"]).first()
        if not b:
            b = Branch(
                name=data["name"],
                location=data["location"],
                manager=data["manager"],
                phone=get_fake_phone(),
                gym_id="vikings"
            )
            b.save()
            branches_created += 1
    return branches_created
