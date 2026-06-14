"""
Seed MongoDB with realistic demo data for Vikings Gym & Spa.
Run: python -m seed.seed_data
"""
import os
import sys
import random
from datetime import datetime, timedelta, timezone

# Add parent to path so imports work
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from dotenv import load_dotenv
load_dotenv()

from app import create_app
from app.extensions import bcrypt
from app.models import (
    User, Member, Trainer, Branch, MembershipPlan, Membership,
    Attendance, Payment, Lead, Expense, Inventory,
    Workout, Exercise, DietPlan, Meal, FoodItem,
    Progress, Measurements, PtPackage, PtSession,
    Equipment, Locker, Announcement, Notification,
    Referral, Coupon, AuditLog,
)
from app.services.qr_service import generate_member_qr
from app.utils.helpers import generate_referral_code

app = create_app()


def clear_all():
    """Drop all collections."""
    for model in [User, Member, Trainer, Branch, MembershipPlan, Membership,
                  Attendance, Payment, Lead, Expense, Inventory, Workout, DietPlan,
                  Progress, PtPackage, PtSession, Equipment, Locker, Announcement,
                  Notification, Referral, Coupon, AuditLog]:
        model.drop_collection()
    print("✅ All collections cleared.")


def hash_pw(pw):
    return bcrypt.generate_password_hash(pw).decode("utf-8")


def seed():
    with app.app_context():
        clear_all()

        # ── Branch ──
        branch = Branch(name="Aurangabad", location="CIDCO, Aurangabad, MH", manager="Vikram Singh", phone="9876543210", gym_id="vikings").save()
        print("✅ Branch created")

        # ── Users ──
        admin = User(name="Admin Vikings", email="admin@vikingsgym.in", phone="9876543210",
                     password_hash=hash_pw("Admin@123"), role="SUPER_ADMIN").save()
        owner = User(name="Vikram Singh", email="vikram@vikingsgym.in", phone="9876543211",
                     password_hash=hash_pw("Owner@123"), role="GYM_OWNER").save()
        rec1 = User(name="Priya Sharma", email="priya@vikingsgym.in", phone="9876543212",
                    password_hash=hash_pw("Recep@123"), role="RECEPTIONIST").save()
        rec2 = User(name="Neha Patel", email="neha@vikingsgym.in", phone="9876543213",
                    password_hash=hash_pw("Recep@123"), role="RECEPTIONIST").save()
        t1_user = User(name="Arjun Reddy", email="arjun@vikingsgym.in", phone="9876543214",
                       password_hash=hash_pw("Trainer@123"), role="TRAINER").save()
        t2_user = User(name="Kavita Nair", email="kavita@vikingsgym.in", phone="9876543215",
                       password_hash=hash_pw("Trainer@123"), role="TRAINER").save()
        t3_user = User(name="Rohit Kumar", email="rohit@vikingsgym.in", phone="9876543216",
                       password_hash=hash_pw("Trainer@123"), role="TRAINER").save()
        print("✅ 7 staff users created")

        # ── Trainers ──
        trainer1 = Trainer(user_id=t1_user.id, name="Arjun Reddy", phone="9876543214",
                           email="arjun@vikingsgym.in", experience_years=6,
                           certifications=["ACE CPT", "CrossFit L2"],
                           specializations=["Weight Training", "CrossFit"],
                           salary=35000, commission_percent=15, rating=4.8).save()
        trainer2 = Trainer(user_id=t2_user.id, name="Kavita Nair", phone="9876543215",
                           email="kavita@vikingsgym.in", experience_years=4,
                           certifications=["NASM CPT", "Yoga Alliance RYT-200"],
                           specializations=["Yoga", "Pilates", "Weight Loss"],
                           salary=30000, commission_percent=12, rating=4.6).save()
        trainer3 = Trainer(user_id=t3_user.id, name="Rohit Kumar", phone="9876543216",
                           email="rohit@vikingsgym.in", experience_years=8,
                           certifications=["ISSA CPT", "Sports Nutrition"],
                           specializations=["Powerlifting", "Bodybuilding"],
                           salary=40000, commission_percent=18, rating=4.9).save()
        trainers = [trainer1, trainer2, trainer3]
        print("✅ 3 trainers created")

        # ── Membership Plans ──
        p1 = MembershipPlan(name="Monthly Basic", duration_months=1, price=1500, description="Basic gym access for 1 month").save()
        p2 = MembershipPlan(name="Quarterly Silver", duration_months=3, price=4000, description="3-month silver plan with locker access").save()
        p3 = MembershipPlan(name="Half-Yearly Gold", duration_months=6, price=7000, description="6-month gold plan with PT session").save()
        p4 = MembershipPlan(name="Annual Platinum", duration_months=12, price=12000, description="Annual all-access VIP membership").save()
        plans = [p1, p2, p3, p4]
        print("✅ 4 membership plans created")

        # ── Members (20) ──
        member_names = [
            ("Rahul Deshmukh", "Male", "rahul.d@gmail.com"), ("Sneha Kulkarni", "Female", "sneha.k@gmail.com"),
            ("Amit Joshi", "Male", "amit.j@gmail.com"), ("Pooja Wagh", "Female", "pooja.w@gmail.com"),
            ("Sagar Patil", "Male", "sagar.p@gmail.com"), ("Anjali More", "Female", "anjali.m@gmail.com"),
            ("Vishal Shinde", "Male", "vishal.s@gmail.com"), ("Ritu Chauhan", "Female", "ritu.c@gmail.com"),
            ("Kunal Deshpande", "Male", "kunal.d@gmail.com"), ("Meena Iyer", "Female", "meena.i@gmail.com"),
            ("Akash Gaikwad", "Male", "akash.g@gmail.com"), ("Divya Rao", "Female", "divya.r@gmail.com"),
            ("Nikhil Pawar", "Male", "nikhil.p@gmail.com"), ("Swati Jadhav", "Female", "swati.j@gmail.com"),
            ("Rohan Bhosale", "Male", "rohan.b@gmail.com"), ("Tanvi Shah", "Female", "tanvi.s@gmail.com"),
            ("Varun Kale", "Male", "varun.k@gmail.com"), ("Shruti Mishra", "Female", "shruti.m@gmail.com"),
            ("Pranav Thakur", "Male", "pranav.t@gmail.com"), ("Nisha Gupta", "Female", "nisha.g@gmail.com"),
        ]
        members = []
        member_users = []
        for i, (name, gender, email) in enumerate(member_names):
            phone = f"98765{43220 + i}"
            u = User(name=name, email=email, phone=phone,
                     password_hash=hash_pw("Member@123"), role="MEMBER").save()
            member_users.append(u)

            mid = f"VK-{i+1:03d}"
            ref_code = generate_referral_code(name)
            qr = generate_member_qr(mid)
            height = random.randint(155, 190)
            weight = random.randint(50, 95)
            h_m = height / 100
            bmi = round(weight / (h_m * h_m), 2)
            dob = f"{random.randint(1990, 2003)}-{random.randint(1,12):02d}-{random.randint(1,28):02d}"
            joined = (datetime.now(timezone.utc) - timedelta(days=random.randint(10, 365))).strftime("%Y-%m-%d")

            m = Member(
                user_id=u.id, member_id=mid, name=name, phone=phone, email=email,
                dob=dob, gender=gender, address=f"{random.randint(1,500)} Colony, Aurangabad",
                blood_group=random.choice(["A+", "B+", "O+", "AB+", "A-", "O-"]),
                medical_conditions=random.choice(["None", "Asthma", "Diabetes", "None", "None"]),
                emergency_contact_name="Family Contact",
                emergency_contact_phone=f"98765{43250 + i}",
                fitness_goal=random.choice(["Weight Loss", "Muscle Gain", "General Fitness", "Strength"]),
                height=height, weight=weight, bmi=bmi,
                referral_code=ref_code, qr_code=qr, wallet_balance=random.choice([0, 100, 200, 500]),
                joined_date=joined,
            ).save()
            members.append(m)
        print("✅ 20 members created")

        # ── Memberships (20) ──
        statuses = ["ACTIVE"] * 14 + ["EXPIRED"] * 4 + ["FREEZED"] * 1 + ["CANCELLED"] * 1
        for i, member in enumerate(members):
            plan = random.choice(plans)
            status = statuses[i]
            start = datetime.now(timezone.utc) - timedelta(days=random.randint(0, 180))
            end = start + timedelta(days=plan.duration_months * 30)
            if status == "EXPIRED":
                end = datetime.now(timezone.utc) - timedelta(days=random.randint(1, 30))

            Membership(
                member_id=member.id, plan_id=plan.id, plan_name=plan.name, plan_type=plan.name,
                start_date=start.strftime("%Y-%m-%d"), end_date=end.strftime("%Y-%m-%d"),
                price=plan.price, status=status,
            ).save()
        print("✅ 20 memberships created")

        # ── Attendance (3 months) ──
        att_count = 0
        for day_offset in range(90):
            date = (datetime.now(timezone.utc) - timedelta(days=day_offset))
            if date.weekday() == 6:  # skip Sundays
                continue
            daily_members = random.sample(members, k=min(random.randint(5, 15), len(members)))
            for m in daily_members:
                hour = random.randint(5, 20)
                check_in = date.replace(hour=hour, minute=random.randint(0, 59))
                check_out = check_in + timedelta(minutes=random.randint(45, 120))
                Attendance(
                    member_id=m.id, member_name=m.name, member_email=m.email,
                    check_in=check_in, check_out=check_out,
                    duration_minutes=int((check_out - check_in).total_seconds() / 60),
                    method=random.choice(["QR", "Manual", "Reception"]),
                    date=date.strftime("%Y-%m-%d"),
                ).save()
                att_count += 1
        print(f"✅ {att_count} attendance records created")

        # ── Payments (10) ──
        for i in range(10):
            m = random.choice(members)
            amt = random.choice([1500, 4000, 7000, 12000, 500, 2500])
            Payment(
                member_id=m.id, member_name=m.name, amount=amt, final_amount=amt,
                method=random.choice(["Cash", "UPI", "Card", "Razorpay"]),
                category=random.choice(["Membership", "POS", "PT", "Locker"]),
                status="PAID",
                invoice_number=f"INV-2025-{i+1:03d}",
                date=(datetime.now(timezone.utc) - timedelta(days=random.randint(0, 60))).strftime("%Y-%m-%d"),
            ).save()
        print("✅ 10 payments created")

        # ── Leads (5) ──
        lead_data = [
            ("Aditya Verma", "9990001111", "New", "Instagram"),
            ("Priyanka Singh", "9990002222", "Contacted", "Facebook"),
            ("Rajesh Mehta", "9990003333", "Trial", "Google"),
            ("Sunita Rao", "9990004444", "Negotiation", "WalkIn"),
            ("Kiran Jain", "9990005555", "Converted", "Referral"),
        ]
        for name, phone, status, source in lead_data:
            Lead(name=name, phone=phone, email=f"{name.lower().replace(' ','.')}@gmail.com",
                 source=source, status=status, notes=f"Interested in gym membership").save()
        print("✅ 5 leads created")

        # ── Workout Plans (3) ──
        for i, cat in enumerate(["Weight Loss", "Muscle Gain", "Strength"]):
            member = members[i]
            trainer = trainers[i % 3]
            exercises = [
                Exercise(day="Monday", name="Bench Press", sets=4, reps="10", weight=40),
                Exercise(day="Monday", name="Incline Dumbbell Press", sets=3, reps="12", weight=14),
                Exercise(day="Tuesday", name="Squats", sets=4, reps="8", weight=60),
                Exercise(day="Tuesday", name="Leg Press", sets=3, reps="12", weight=80),
                Exercise(day="Wednesday", name="Pull-ups", sets=4, reps="8", weight=0),
                Exercise(day="Thursday", name="Shoulder Press", sets=4, reps="10", weight=20),
                Exercise(day="Friday", name="Deadlift", sets=4, reps="6", weight=80),
            ]
            Workout(
                title=f"{cat} Program - Week 1-4", category=cat,
                created_by=trainer.id, created_by_name=trainer.name,
                assigned_to=member.id, assigned_to_name=member.name,
                exercises=exercises, duration_weeks=4, days_per_week=5,
                start_from=datetime.now(timezone.utc).strftime("%Y-%m-%d"),
                end_at=(datetime.now(timezone.utc) + timedelta(days=28)).strftime("%Y-%m-%d"),
            ).save()
        print("✅ 3 workout plans created")

        # ── Diet Plans (3) ──
        for i in range(3):
            member = members[i + 3]
            trainer = trainers[i % 3]
            meals = [
                Meal(name="Breakfast", time="08:00 AM", meal_type="Breakfast",
                     description="Oats with protein shake",
                     foods=[FoodItem(item="Oats", quantity="100g", calories=380, protein=13),
                            FoodItem(item="Whey Protein", quantity="1 scoop", calories=120, protein=24)],
                     calories_estimate=500),
                Meal(name="Lunch", time="01:00 PM", meal_type="Lunch",
                     description="Rice, dal, chicken",
                     foods=[FoodItem(item="Brown Rice", quantity="150g", calories=170, protein=4),
                            FoodItem(item="Grilled Chicken", quantity="200g", calories=330, protein=50)],
                     calories_estimate=600),
                Meal(name="Dinner", time="08:00 PM", meal_type="Dinner",
                     description="Roti, sabzi, salad",
                     foods=[FoodItem(item="Whole Wheat Roti", quantity="3 pcs", calories=240, protein=9),
                            FoodItem(item="Mixed Vegetables", quantity="200g", calories=100, protein=4)],
                     calories_estimate=400),
            ]
            DietPlan(
                title=f"Nutrition Plan {i+1}", goal=random.choice(["WeightLoss", "MuscleGain", "Maintenance"]),
                created_by=trainer.id, created_by_name=trainer.name,
                assigned_to=member.id, assigned_to_name=member.name,
                total_calories=random.choice([1800, 2200, 2500]), meals=meals,
                water_intake_liters=3.5,
            ).save()
        print("✅ 3 diet plans created")

        # ── Progress (entries for first 5 members) ──
        for i in range(5):
            m = members[i]
            for j in range(3):
                w = m.weight + random.uniform(-2, 1)
                h_m = m.height / 100
                Progress(
                    member_id=m.id,
                    date=(datetime.now(timezone.utc) - timedelta(days=30 * (2 - j))).strftime("%Y-%m-%d"),
                    weight=round(w, 1), bmi=round(w / (h_m * h_m), 2),
                    body_fat_percent=round(random.uniform(12, 30), 1),
                    measurements=Measurements(
                        chest=random.randint(85, 110), waist=random.randint(70, 95),
                        arms=random.randint(28, 42), neck=random.randint(33, 42),
                        thigh=random.randint(48, 62)),
                ).save()
        print("✅ Progress records created")

        # ── Inventory (5) ──
        inv_data = [
            ("ON Whey Protein 2.2kg", "Supplements", 25, 2800, 3500, 5),
            ("Gym T-Shirt (L)", "Merchandise", 50, 200, 499, 10),
            ("BCAAs 300g", "Supplements", 15, 600, 900, 3),
            ("Gym Shaker Bottle", "Merchandise", 30, 80, 199, 5),
            ("Resistance Bands Set", "Equipment", 10, 300, 599, 3),
        ]
        for name, cat, qty, cost, price, threshold in inv_data:
            Inventory(name=name, category=cat, quantity=qty, cost_price=cost,
                      selling_price=price, low_stock_threshold=threshold,
                      sku=f"SKU-{name[:3].upper()}-001").save()
        print("✅ 5 inventory items created")

        # ── Equipment (5) ──
        eq_data = [
            ("Treadmill Proform T-900", "Cardio", "2023-01-15", 85000),
            ("Smith Machine", "Strength", "2022-06-20", 120000),
            ("Adjustable Bench Press", "Free Weights", "2023-03-10", 25000),
            ("Cable Crossover Machine", "Strength", "2022-11-05", 95000),
            ("Rowing Machine", "Cardio", "2024-02-01", 55000),
        ]
        for name, cat, pdate, price in eq_data:
            last_service = (datetime.now(timezone.utc) - timedelta(days=random.randint(30, 120))).strftime("%Y-%m-%d")
            next_service = (datetime.now(timezone.utc) + timedelta(days=random.randint(5, 60))).strftime("%Y-%m-%d")
            Equipment(name=name, category=cat, purchase_date=pdate, purchase_price=price,
                      last_service_date=last_service, next_service_date=next_service,
                      status="Operational").save()
        print("✅ 5 equipment items created")

        # ── Lockers (5) ──
        for i in range(5):
            locker = Locker(locker_number=f"L-{i+1:02d}", rent=300)
            if i < 3:
                m = members[i]
                locker.member_id = m.id
                locker.member_name = m.name
                locker.status = "Occupied"
                locker.start_date = datetime.now(timezone.utc).strftime("%Y-%m-%d")
                locker.end_date = (datetime.now(timezone.utc) + timedelta(days=90)).strftime("%Y-%m-%d")
            else:
                locker.status = "Available"
            locker.save()
        print("✅ 5 lockers created")

        # ── PT Packages (2) ──
        pkg1 = PtPackage(name="Starter PT (12 Sessions)", sessions_total=12, price=6000,
                         validity_days=45, trainer_commission_percent=15,
                         trainer_id=trainer1.id, trainer_name=trainer1.name).save()
        pkg2 = PtPackage(name="Pro PT (24 Sessions)", sessions_total=24, price=10000,
                         validity_days=90, trainer_commission_percent=18,
                         trainer_id=trainer3.id, trainer_name=trainer3.name).save()
        print("✅ 2 PT packages created")

        # ── PT Sessions (5) ──
        for i in range(5):
            m = members[i]
            t = trainers[i % 3]
            pkg = pkg1 if i < 3 else pkg2
            PtSession(
                member_id=m.id, member_name=m.name,
                trainer_id=t.id, trainer_name=t.name,
                package_id=pkg.id, sessions_total=pkg.sessions_total,
                sessions_completed=random.randint(0, 8),
                start_date=(datetime.now(timezone.utc) - timedelta(days=20)).strftime("%Y-%m-%d"),
                end_date=(datetime.now(timezone.utc) + timedelta(days=40)).strftime("%Y-%m-%d"),
            ).save()
        print("✅ 5 PT sessions created")

        # ── Expenses (10) ──
        exp_data = [
            ("Rent", 50000), ("Electricity", 8000), ("Internet", 2000),
            ("Salary", 150000), ("Marketing", 15000), ("Maintenance", 5000),
            ("Equipment", 25000), ("Salary", 150000), ("Rent", 50000), ("Marketing", 10000),
        ]
        for i, (cat, amt) in enumerate(exp_data):
            Expense(
                category=cat, amount=amt, description=f"{cat} payment",
                date=(datetime.now(timezone.utc) - timedelta(days=30 * (i % 3))).strftime("%Y-%m-%d"),
                paid_by="Vikram Singh",
            ).save()
        print("✅ 10 expenses created")

        # ── Announcements (3) ──
        Announcement(title="Welcome to Vikings Gym!", body="We are excited to have you. Check out our new equipment!",
                     target_roles=["ALL"], is_published=True,
                     published_at=datetime.now(timezone.utc), created_by="Admin").save()
        Announcement(title="Summer Offer — 20% Off", body="Get 20% off on annual plans this summer. Use code SUMMER20.",
                     target_roles=["ALL"], is_published=True,
                     published_at=datetime.now(timezone.utc), created_by="Admin").save()
        Announcement(title="Trainer Meeting — Friday", body="All trainers please join the meeting at 10 AM Friday.",
                     target_roles=["TRAINER"], is_published=True,
                     published_at=datetime.now(timezone.utc), created_by="Admin").save()
        print("✅ 3 announcements created")

        # ── Coupons (3) ──
        Coupon(code="SUMMER20", discount_type="Percentage", discount_value=20,
               max_uses=50, expiry_date="2026-09-30").save()
        Coupon(code="FLAT500", discount_type="Flat", discount_value=500,
               max_uses=100, expiry_date="2026-12-31").save()
        Coupon(code="WELCOME10", discount_type="Percentage", discount_value=10,
               max_uses=200, expiry_date="2027-03-31").save()
        print("✅ 3 coupons created")

        # ── Referrals (3) ──
        for i in range(3):
            Referral(
                referrer_id=members[i].id, referrer_name=members[i].name,
                referred_name=f"Friend of {members[i].name}",
                referred_phone=f"99900{60000+i}",
                referral_code=members[i].referral_code,
                status=random.choice(["Pending", "Converted"]),
                reward_amount=200,
            ).save()
        print("✅ 3 referrals created")

        # ── Notifications ──
        for m in members[:5]:
            uid = str(m.user_id.id) if m.user_id else str(m.id)
            Notification(user_id=uid, notification_type="Announcement",
                         title="Welcome to Vikings!", message="Your membership is active. Start your fitness journey!").save()
        print("✅ Notifications created")

        # ── Audit Logs ──
        AuditLog(user_id=str(admin.id), user_name=admin.name, user_email=admin.email,
                 role="SUPER_ADMIN", action="Seeded database", module="System",
                 ip_address="127.0.0.1").save()
        print("✅ Audit log created")

        print("\n🎉 Database seeded successfully!")
        print(f"   Login: admin@vikingsgym.in / Admin@123")


if __name__ == "__main__":
    seed()
