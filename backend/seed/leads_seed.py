"""Seed data for Leads and CRM Activities."""
import random
from datetime import datetime, timedelta, timezone
from app.models.lead import Lead
from app.models.lead_activity import LeadActivity
from app.models.user import User
from app.models.branch import Branch
from seed.utils import fake, get_fake_phone

SOURCES = ["Instagram", "Facebook", "Google", "Website", "Referral", "WalkIn"]
STATUSES = ["New", "Contacted", "Trial", "Negotiation", "Converted", "Lost"]
ACTIVITY_TYPES = ["Call", "WhatsApp", "Email", "Meeting", "Note"]

def seed_leads(num_leads=1000):
    """Seed CRM leads and follow-up activities."""
    print(f"Seeding {num_leads} leads and CRM activities...")
    leads_created = 0
    activities_created = 0
    
    trainers = list(User.objects(role__in=["TRAINER", "RECEPTIONIST", "BRANCH_MANAGER"]))
    branches = list(Branch.objects())
    
    if not trainers or not branches:
        return 0, 0

    today = datetime.now()
    dates = [(today - timedelta(days=i)).strftime("%Y-%m-%d") for i in range(90)]

    for i in range(num_leads):
        branch = random.choice(branches)
        assigned_to = random.choice(trainers)
        
        status = random.choices(STATUSES, weights=[20, 30, 15, 10, 15, 10])[0]
        date = random.choice(dates)
        
        lead = Lead(
            name=fake.name(),
            phone=get_fake_phone(),
            email=f"{fake.user_name()}@gmail.com",
            source=random.choice(SOURCES),
            status=status,
            assigned_to=str(assigned_to.id),
            notes="Interested in annual package.",
            follow_up_date=(today + timedelta(days=random.randint(1, 14))).strftime("%Y-%m-%d") if status not in ["Converted", "Lost"] else "",
            gym_id="vikings",
            branch_id=branch.name.lower().replace(" ", "")
        ).save()
        leads_created += 1
        
        # Create 1-3 activities for each lead (unless it's New)
        if status != "New":
            for _ in range(random.randint(1, 3)):
                LeadActivity(
                    lead_id=str(lead.id),
                    activity_type=random.choice(ACTIVITY_TYPES),
                    notes="Followed up regarding trial session.",
                    date=random.choice(dates),
                    performed_by=str(assigned_to.id),
                    gym_id="vikings",
                    branch_id=branch.name.lower().replace(" ", "")
                ).save()
                activities_created += 1

        if (i+1) % 200 == 0:
            print(f"  Created {i+1} leads...")

    return leads_created, activities_created
