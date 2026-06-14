"""Seed data for Support Tickets."""
import random
from app.models.member import Member
from app.models.user import User
from app.models.support_ticket import SupportTicket
from seed.utils import fake

SUBJECTS = ["Equipment Issue", "App not working", "Billing discrepancy", "Locker assignment", "PT schedule conflict"]
STATUSES = ["Open", "In Progress", "Resolved", "Closed"]

def seed_tickets(num_tickets=500):
    """Seed support tickets."""
    print(f"Seeding {num_tickets} support tickets...")
    tickets_created = 0
    
    members = list(Member.objects())
    staff = list(User.objects(role__in=["RECEPTIONIST", "BRANCH_MANAGER"]))
    
    if not members or not staff:
        return 0

    for i in range(num_tickets):
        member = random.choice(members)
        assigned = random.choice(staff)
        
        SupportTicket(
            member_id=str(member.id),
            member_name=member.name,
            subject=random.choice(SUBJECTS),
            description="Detailed description of the problem goes here.",
            status=random.choice(STATUSES),
            assigned_to=str(assigned.id),
            gym_id=member.gym_id,
            branch_id=member.branch_id
        ).save()
        tickets_created += 1

    return tickets_created
