"""Main seed entry point for Vikings Gym ERP."""
import os
import sys
import argparse
from mongoengine import connect

# Add the backend directory to path if needed so app can be imported
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.config import Config
from app.extensions import bcrypt
from flask import Flask

from seed.branches_seed import seed_branches
from seed.users_seed import seed_users
from seed.trainers_seed import seed_trainers
from seed.plans_seed import seed_plans
from seed.members_seed import seed_members
from seed.memberships_seed import seed_memberships
from seed.attendance_seed import seed_attendance
from seed.workouts_seed import seed_workouts
from seed.diets_seed import seed_diets
from seed.payments_seed import seed_payments_and_invoices
from seed.leads_seed import seed_leads
from seed.equipment_seed import seed_equipment
from seed.payroll_seed import seed_payroll
from seed.tickets_seed import seed_tickets
from seed.notifications_seed import seed_notifications

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)
    connect(host=Config.MONGODB_SETTINGS["host"])
    bcrypt.init_app(app)
    return app

def clear_db():
    print("Clearing database collections...")
    import mongoengine
    db = mongoengine.get_db()
    for coll in db.list_collection_names():
        if coll != "system.indexes":
            db.drop_collection(coll)
    print("Database cleared.")

def main():
    parser = argparse.ArgumentParser(description="Vikings Gym ERP Seed Data Generator")
    parser.add_argument("--reset", action="store_true", help="Clear the database before seeding")
    parser.add_argument("--attendance-only", action="store_true", help="Only seed attendance")
    parser.add_argument("--members-only", action="store_true", help="Only seed members")
    args = parser.parse_args()

    app = create_app()
    with app.app_context():
        if args.reset:
            clear_db()

        if args.attendance_only:
            seed_attendance()
            return

        if args.members_only:
            seed_members()
            return

        # Complete Seeding process
        print("Starting enterprise seed generation...")
        
        stats = {}
        
        # 1. Core Config
        stats["Branches"] = seed_branches()
        stats["Users"] = seed_users()
        stats["Trainers"] = seed_trainers()
        stats["Plans"] = seed_plans()
        
        # 2. Members and Subscriptions
        stats["Members"] = seed_members(500)
        stats["Memberships"] = seed_memberships()
        
        # 3. Daily Operations
        stats["Attendance"] = seed_attendance(10000)
        stats["Workouts"] = seed_workouts()
        stats["Diets"] = seed_diets()
        
        # 4. Finance
        payments, invoices = seed_payments_and_invoices(2000)
        stats["Payments"] = payments
        stats["Invoices"] = invoices
        
        # 5. CRM & Admin
        leads, activities = seed_leads(1000)
        stats["Leads"] = leads
        stats["LeadActivities"] = activities
        
        stats["Equipment"] = seed_equipment(100)
        stats["Payroll"] = seed_payroll()
        stats["Tickets"] = seed_tickets(500)
        stats["Notifications"] = seed_notifications(1000)

        # Print Final Report
        print("\n" + "="*40)
        print("SEED GENERATION COMPLETE")
        print("="*40)
        for key, count in stats.items():
            print(f"✓ {key} Created: {count}")
        print("="*40)

if __name__ == "__main__":
    main()
