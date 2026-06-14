"""Seed data for Equipment Inventory."""
import random
from datetime import datetime, timedelta, timezone
from app.models.equipment import Equipment
from app.models.branch import Branch
from seed.utils import fake

EQUIPMENT_TYPES = [
    ("Treadmill T900", "Cardio"),
    ("Elliptical E500", "Cardio"),
    ("Spin Bike S300", "Cardio"),
    ("Bench Press Station", "Strength"),
    ("Squat Rack Pro", "Strength"),
    ("Dumbbell Set 2-50kg", "Free Weights"),
    ("Kettlebell Set", "Free Weights"),
    ("Leg Press Machine", "Machines"),
    ("Lat Pulldown", "Machines"),
    ("Cable Crossover", "Machines"),
]

def seed_equipment(num_items=100):
    """Seed equipment inventory across branches."""
    print(f"Seeding {num_items} equipment items...")
    items_created = 0
    
    branches = list(Branch.objects())
    if not branches:
        return 0

    today = datetime.now()

    for i in range(num_items):
        branch = random.choice(branches)
        equip_name, equip_cat = random.choice(EQUIPMENT_TYPES)
        
        purchase_date = (today - timedelta(days=random.randint(30, 1000))).strftime("%Y-%m-%d")
        last_service = (today - timedelta(days=random.randint(5, 180))).strftime("%Y-%m-%d")
        next_service = (today + timedelta(days=random.randint(15, 90))).strftime("%Y-%m-%d")
        
        Equipment(
            name=f"{equip_name} - {fake.bothify(text='??-####').upper()}",
            purchase_date=purchase_date,
            last_service_date=last_service,
            next_service_date=next_service,
            status=random.choices(["Operational", "Under Maintenance", "Needs Service", "Retired"], weights=[80, 10, 8, 2])[0],
            notes="Regular wear and tear.",
            gym_id="vikings",
            branch_id=branch.name.lower().replace(" ", "")
        ).save()
        items_created += 1

    return items_created
