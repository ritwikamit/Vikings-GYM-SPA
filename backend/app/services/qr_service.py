"""QR Code generation service."""
import io
import base64
import json
import qrcode
from qrcode.image.pil import PilImage


def generate_member_qr(member_id: str, gym_id: str = "vikings") -> str:
    """
    Generate a QR code for a member.
    Returns base64-encoded PNG string.
    """
    data = json.dumps({"member_id": member_id, "gym_id": gym_id})

    qr = qrcode.QRCode(
        version=1,
        error_correction=qrcode.constants.ERROR_CORRECT_M,
        box_size=10,
        border=4,
    )
    qr.add_data(data)
    qr.make(fit=True)

    img: PilImage = qr.make_image(fill_color="black", back_color="white")

    buffer = io.BytesIO()
    img.save(buffer, format="PNG")
    buffer.seek(0)

    b64 = base64.b64encode(buffer.getvalue()).decode("utf-8")
    return f"data:image/png;base64,{b64}"


def decode_qr_data(qr_string: str) -> dict | None:
    """
    Decode QR data string back to dict.
    Expects JSON: {"member_id": "VK-001", "gym_id": "vikings"}
    """
    try:
        return json.loads(qr_string)
    except (json.JSONDecodeError, TypeError):
        return None
