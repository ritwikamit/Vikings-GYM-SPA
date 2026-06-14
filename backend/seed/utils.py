"""Utility functions for seeding."""
import random
from datetime import datetime, timedelta
from faker import Faker

# Initialize Indian locale faker
fake = Faker('en_IN')


def get_random_date_between(start_date: datetime, end_date: datetime) -> datetime:
    """Returns a random datetime between two datetimes."""
    delta = end_date - start_date
    random_days = random.randrange(delta.days) if delta.days > 0 else 0
    random_seconds = random.randrange(86400)
    return start_date + timedelta(days=random_days, seconds=random_seconds)


def get_fake_phone() -> str:
    """Generate a realistic 10-digit Indian phone number."""
    prefixes = ['98', '99', '97', '96', '95', '94', '93', '91', '90', '89', '88', '87', '86', '85', '84', '83', '82', '81', '80', '79', '78', '77', '76', '75', '74', '73', '72', '70', '63']
    return random.choice(prefixes) + str(random.randint(10000000, 99999999))


def get_fake_gst() -> str:
    """Generate a fake Indian GST number."""
    state_code = str(random.randint(10, 35))
    pan = fake.pystr(min_chars=5, max_chars=5).upper() + str(random.randint(1000, 9999)) + fake.pystr(min_chars=1, max_chars=1).upper()
    entity = str(random.randint(1, 9))
    z = 'Z'
    checksum = fake.pystr(min_chars=1, max_chars=1).upper()
    return f"{state_code}{pan}{entity}{z}{checksum}"


def get_fake_upi(name: str) -> str:
    """Generate a realistic fake UPI ID."""
    providers = ['okicici', 'okhdfcbank', 'oksbi', 'paytm', 'ybl', 'axl']
    name_slug = name.lower().replace(" ", "").replace(".", "")
    return f"{name_slug}@{random.choice(providers)}"

