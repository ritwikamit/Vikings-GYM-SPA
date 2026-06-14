"""Input validation helpers."""
import re
from datetime import datetime


def validate_email(email: str) -> bool:
    """Validate email format."""
    pattern = r"^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$"
    return bool(re.match(pattern, email))


def validate_phone(phone: str) -> bool:
    """Validate phone number (10 digits, optional +91 prefix)."""
    cleaned = re.sub(r"[\s\-\+]", "", phone)
    if cleaned.startswith("91") and len(cleaned) == 12:
        cleaned = cleaned[2:]
    return bool(re.match(r"^\d{10}$", cleaned))


def validate_date(date_str: str) -> bool:
    """Validate date in YYYY-MM-DD format."""
    try:
        datetime.strptime(date_str, "%Y-%m-%d")
        return True
    except (ValueError, TypeError):
        return False


def validate_required_fields(data: dict, required: list[str]) -> list[str]:
    """
    Check that all required fields are present and non-empty.
    Returns a list of error messages for missing fields.
    """
    errors = []
    for field in required:
        value = data.get(field)
        if value is None or (isinstance(value, str) and value.strip() == ""):
            errors.append(f"{field} is required")
    return errors


def validate_file_upload(file) -> tuple[bool, str]:
    """
    Validate file upload: check type and size.
    Returns (is_valid, error_message).
    """
    ALLOWED = {"jpg", "jpeg", "png", "pdf"}
    MAX_SIZE = 5 * 1024 * 1024  # 5 MB

    if not file or not file.filename:
        return False, "No file provided"

    ext = file.filename.rsplit(".", 1)[-1].lower() if "." in file.filename else ""
    if ext not in ALLOWED:
        return False, f"File type '{ext}' not allowed. Allowed: {', '.join(ALLOWED)}"

    # Check size by reading and seeking back
    file.seek(0, 2)  # seek to end
    size = file.tell()
    file.seek(0)  # seek back to start
    if size > MAX_SIZE:
        return False, f"File size {size} bytes exceeds maximum of {MAX_SIZE} bytes (5MB)"

    return True, ""


def sanitize_string(value: str, max_length: int = 500) -> str:
    """Strip and truncate a string."""
    if not value:
        return ""
    return value.strip()[:max_length]
