"""Seed data for Membership Plans."""
from app.models.membership import MembershipPlan

PLANS = [
    {"name": "Daily Pass", "duration_months": 0, "price": 500, "description": "1 day access"},
    {"name": "Weekly Pass", "duration_months": 0.25, "price": 2000, "description": "7 days access"},
    {"name": "Monthly Base", "duration_months": 1, "price": 3500, "description": "1 month base access"},
    {"name": "Quarterly Base", "duration_months": 3, "price": 9000, "description": "3 months base access"},
    {"name": "Half Yearly Base", "duration_months": 6, "price": 16000, "description": "6 months base access"},
    {"name": "Annual VIP", "duration_months": 12, "price": 28000, "description": "12 months VIP access"},
    {"name": "Premium Pass", "duration_months": 12, "price": 35000, "description": "12 months Premium + Spa"},
]

def seed_plans():
    """Seed membership plans."""
    print("Seeding membership plans...")
    plans_created = 0
    
    for plan in PLANS:
        p = MembershipPlan.objects(name=plan["name"]).first()
        if not p:
            MembershipPlan(
                name=plan["name"],
                duration_months=plan["duration_months"],
                price=plan["price"],
                description=plan["description"],
                gym_id="vikings",
                branch_id="aurangabad"
            ).save()
            plans_created += 1
            
    return plans_created
