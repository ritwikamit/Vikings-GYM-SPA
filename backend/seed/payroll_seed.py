"""Seed data for Staff Payroll."""
import random
from datetime import datetime
from app.models.payroll import Payroll
from app.models.user import User

def seed_payroll():
    """Seed payroll records for staff."""
    print("Seeding payroll records...")
    payroll_created = 0
    
    staff_members = list(User.objects(role__in=["RECEPTIONIST", "TRAINER", "BRANCH_MANAGER", "ACCOUNTANT", "NUTRITIONIST"]))
    if not staff_members:
        return 0

    months = ["2023-10", "2023-11", "2023-12", "2024-01", "2024-02", "2024-03", "2024-04"]

    for staff in staff_members:
        base = random.choice([25000, 30000, 45000, 60000])
        
        for month in months:
            bonus = random.choice([0, 0, 5000, 10000])
            tax = base * 0.1
            
            Payroll(
                staff_id=str(staff.id),
                staff_name=staff.name,
                role=staff.role,
                month=month,
                base_salary=base,
                bonus=bonus,
                deductions=0,
                tax=tax,
                net_pay=base + bonus - tax,
                status="Paid",
                payment_date=f"{month}-05",
                gym_id=staff.gym_id,
                branch_id=staff.branch_id
            ).save()
            payroll_created += 1

    return payroll_created
