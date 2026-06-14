"""Seed data for Subscriptions / Memberships."""
import random
from datetime import datetime, timedelta, timezone
from app.models.member import Member
from app.models.membership import MembershipPlan, Membership
from seed.utils import fake

def seed_memberships():
    """Assign active, expired, and frozen memberships to members."""
    print("Seeding member memberships...")
    memberships_created = 0
    
    members = list(Member.objects())
    plans = list(MembershipPlan.objects())
    
    if not members or not plans:
        print("Missing members or plans, cannot seed memberships!")
        return 0

    statuses = ["ACTIVE", "ACTIVE", "ACTIVE", "EXPIRED", "FREEZED", "CANCELLED"]

    for member in members:
        # Give each member 1 or 2 memberships (maybe an expired one and an active one)
        num_plans = random.choices([1, 2, 3], weights=[70, 25, 5])[0]
        
        for i in range(num_plans):
            plan = random.choice(plans)
            status = random.choice(statuses) if i == 0 else "EXPIRED" # Ensure previous ones are expired
            
            start_date_obj = datetime.strptime(member.joined_date, "%Y-%m-%d")
            if i > 0:
                # Add some time for consecutive plans
                start_date_obj += timedelta(days=365 * i)
                
            end_date_obj = start_date_obj + timedelta(days=plan.duration_months * 30 if plan.duration_months > 0 else 7)
            
            frozen_days = random.randint(10, 30) if status == "FREEZED" else 0

            Membership(
                member_id=str(member.id),
                plan_id=str(plan.id),
                plan_name=plan.name,
                start_date=start_date_obj.strftime("%Y-%m-%d"),
                end_date=end_date_obj.strftime("%Y-%m-%d"),
                price=plan.price,
                status=status,
                frozen_days=frozen_days,
                gym_id=member.gym_id,
                branch_id=member.branch_id
            ).save()
            memberships_created += 1

    return memberships_created
