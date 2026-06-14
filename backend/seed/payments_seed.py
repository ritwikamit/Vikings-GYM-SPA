"""Seed data for Payments and Invoices."""
import random
from datetime import datetime, timedelta, timezone
from app.models.member import Member
from app.models.payment import Payment
from app.models.invoice import Invoice
from seed.utils import fake

def seed_payments_and_invoices(num_payments=2000):
    """Seed payment records and corresponding invoices."""
    print(f"Seeding {num_payments} payments and invoices...")
    payments_created = 0
    invoices_created = 0
    
    members = list(Member.objects())
    if not members:
        return 0, 0

    METHODS = ["Cash", "UPI", "Card", "Razorpay"]
    CATEGORIES = ["Membership", "PT_Package", "POS", "Locker"]
    STATUSES = ["PAID", "PAID", "PAID", "PENDING", "FAILED"]

    # Pre-generate dates
    today = datetime.now()
    dates = [(today - timedelta(days=i)).strftime("%Y-%m-%d") for i in range(365)]

    for i in range(num_payments):
        member = random.choice(members)
        amount = random.choice([500, 2000, 3500, 9000, 16000, 28000, 35000])
        discount = random.choice([0, 0, 0, 500, 1000]) if amount > 2000 else 0
        final_amount = amount - discount
        
        status = random.choice(STATUSES)
        date = random.choice(dates)
        
        # 1. Create Payment
        payment = Payment(
            member_id=str(member.id),
            member_name=member.name,
            amount=amount,
            discount=discount,
            final_amount=final_amount,
            method=random.choice(METHODS),
            category=random.choice(CATEGORIES),
            status=status,
            invoice_number=f"INV-{date[:4]}-{i+1:04d}-{random.randint(100, 999)}",
            date=date,
            gym_id=member.gym_id,
            branch_id=member.branch_id
        ).save()
        payments_created += 1

        # 2. Create Invoice for PAID payments
        if status == "PAID":
            gst_amount = round(final_amount * 0.18, 2)
            total_amount = final_amount + gst_amount
            
            Invoice(
                invoice_number=payment.invoice_number,
                payment_id=str(payment.id),
                member_id=str(member.id),
                member_name=member.name,
                amount=final_amount,
                gst_amount=gst_amount,
                total_amount=total_amount,
                due_date=date,
                status="Paid",
                gym_id=member.gym_id,
                branch_id=member.branch_id
            ).save()
            invoices_created += 1
            
        if (i+1) % 500 == 0:
            print(f"  Created {i+1} payments...")

    return payments_created, invoices_created
