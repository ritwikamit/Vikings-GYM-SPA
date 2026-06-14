"""General helper utilities."""
import random
import string
from datetime import datetime, timezone
from flask import request


def generate_member_id() -> str:
    """Generate next member ID like VK-001, VK-002, etc."""
    from app.models.member import Member
    count = Member.objects.count()
    return f"VK-{count + 1:03d}"


def generate_invoice_number() -> str:
    """Generate invoice number like INV-2024-001."""
    from app.models.payment import Payment
    year = datetime.now(timezone.utc).year
    count = Payment.objects.count()
    return f"INV-{year}-{count + 1:03d}"


def generate_referral_code(name: str) -> str:
    """Generate unique referral code from member name."""
    prefix = name.upper().replace(" ", "")[:4]
    suffix = "".join(random.choices(string.digits, k=4))
    return f"{prefix}{suffix}"


def get_pagination_args():
    """Extract page and per_page from query params."""
    try:
        page = int(request.args.get("page", 1))
    except (ValueError, TypeError):
        page = 1
    try:
        per_page = int(request.args.get("per_page", 20))
    except (ValueError, TypeError):
        per_page = 20
    return max(1, page), min(max(1, per_page), 100)


def calculate_bmi(weight_kg: float, height_cm: float) -> float:
    """Calculate BMI from weight (kg) and height (cm)."""
    if height_cm <= 0:
        return 0
    height_m = height_cm / 100
    return round(weight_kg / (height_m * height_m), 2)


def today_str() -> str:
    """Return today's date as YYYY-MM-DD string."""
    return datetime.now(timezone.utc).strftime("%Y-%m-%d")


def parse_date(date_str: str) -> datetime | None:
    """Parse YYYY-MM-DD string to datetime."""
    try:
        return datetime.strptime(date_str, "%Y-%m-%d")
    except (ValueError, TypeError):
        return None


def get_client_ip() -> str:
    """Get client IP address from request."""
    if request.headers.get("X-Forwarded-For"):
        return request.headers["X-Forwarded-For"].split(",")[0].strip()
    return request.remote_addr or "127.0.0.1"
