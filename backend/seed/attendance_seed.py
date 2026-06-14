"""Seed data for Attendance."""
import random
from datetime import datetime, timedelta, timezone
from app.models.member import Member
from app.models.attendance import Attendance
from seed.utils import fake

def seed_attendance(num_records=10000):
    """Seed random attendance records for members."""
    print(f"Seeding {num_records} attendance records...")
    attendance_created = 0
    
    members = list(Member.objects())
    if not members:
        print("Missing members, cannot seed attendance!")
        return 0

    batch_size = 1000
    batch = []
    
    # Pre-generate dates to make it faster
    today = datetime.now()
    dates = [(today - timedelta(days=i)).strftime("%Y-%m-%d") for i in range(180)] # Last 6 months
    
    METHODS = ["QR", "RFID", "MANUAL", "APP"]

    for i in range(num_records):
        member = random.choice(members)
        date = random.choice(dates)
        
        date_obj = datetime.strptime(date, "%Y-%m-%d")
        
        # Check-in time between 5 AM and 9 PM
        hour = random.randint(5, 21)
        minute = random.randint(0, 59)
        check_in = date_obj.replace(hour=hour, minute=minute)
        
        # Duration between 30 and 150 mins
        duration = random.randint(30, 150)
        check_out = check_in + timedelta(minutes=duration)
        
        batch.append(Attendance(
            member_id=str(member.id),
            member_name=member.name,
            member_email=member.email,
            date=date,
            check_in=check_in,
            check_out=check_out,
            duration_minutes=duration,
            method=random.choice(METHODS),
            gym_id=member.gym_id,
            branch_id=member.branch_id
        ))
        
        if len(batch) >= batch_size:
            Attendance.objects.insert(batch)
            attendance_created += len(batch)
            print(f"  Inserted {attendance_created} attendance records...")
            batch = []

    if batch:
        Attendance.objects.insert(batch)
        attendance_created += len(batch)

    return attendance_created
