"""Seed data for Notifications."""
import random
from datetime import datetime
from app.models.user import User
from app.models.notification import Notification
from seed.utils import fake

TYPES = ["MembershipExpiry", "Payment", "Attendance", "Announcement", "Expiry"]

def seed_notifications(num_notifications=1000):
    """Seed notifications for users."""
    print(f"Seeding {num_notifications} notifications...")
    notifications_created = 0
    
    users = list(User.objects())
    if not users:
        return 0

    for _ in range(num_notifications):
        user = random.choice(users)
        ntype = random.choice(TYPES)
        
        Notification(
            user_id=str(user.id),
            title=f"{ntype} Alert",
            message=f"This is an automated {ntype} notification.",
            notification_type=ntype,
            sent_at=datetime.fromisoformat(fake.date_this_year().isoformat()),
            is_read=random.choice([True, False]),
            gym_id=user.gym_id,
            branch_id=user.branch_id
        ).save()
        notifications_created += 1

    return notifications_created
