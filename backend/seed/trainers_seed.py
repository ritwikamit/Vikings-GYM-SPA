"""Seed data for Trainers."""
import random
from app.models.user import User
from app.models.trainer import Trainer
from seed.utils import fake, get_fake_phone

SPECIALIZATIONS = ["Weight Loss", "Muscle Gain", "CrossFit", "Powerlifting", "Yoga", "Cardio", "Functional Training"]
CERTIFICATIONS = ["ACE Certified", "NASM CPT", "ISSA Personal Trainer", "CrossFit Level 1", "Yoga Alliance RYT 200"]

def seed_trainers(num_trainers=20):
    """Seed trainers linked to User accounts."""
    print(f"Seeding {num_trainers} trainers...")
    trainers_created = 0
    
    # Get all users with TRAINER role
    trainer_users = User.objects(role="TRAINER", is_deleted=False)
    
    # We want exactly num_trainers (if we don't have enough users, we will skip or cap)
    for u in list(trainer_users)[:num_trainers]:
        existing = Trainer.objects(user_id=str(u.id)).first()
        if not existing:
            Trainer(
                user_id=str(u.id),
                name=u.name,
                phone=u.phone,
                email=u.email,
                experience_years=random.randint(1, 15),
                certifications=random.sample(CERTIFICATIONS, k=random.randint(1, 3)),
                specializations=random.sample(SPECIALIZATIONS, k=random.randint(1, 3)),
                salary=random.choice([25000, 30000, 40000, 50000, 60000]),
                commission_percent=random.choice([10, 15, 20, 25, 30]),
                assigned_members=[str(random.randint(100, 999)) for _ in range(random.randint(0, 25))],
                rating=round(random.uniform(3.5, 5.0), 1),
                gym_id=u.gym_id,
                branch_id=u.branch_id
            ).save()
            trainers_created += 1
            
    return trainers_created
