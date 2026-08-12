"""Member service — ensures a Member profile is linked to a User."""
from app.models.member import Member
from app.utils.helpers import generate_member_id, generate_referral_code
from app.services.qr_service import generate_member_qr


def ensure_member_for_user(user) -> Member:
    """
    Return the Member profile linked to this User, creating one if missing.
    Used so self-registered members always have a Member record (wire phone,
    name, email from the User into the profile).
    """
    member = Member.objects(user_id=user.id, is_deleted=False).first() if user else None
    if member:
        return member

    member = Member(
        user_id=user.id,
        member_id=generate_member_id(),
        name=(user.name or "").strip(),
        phone=(user.phone or "").strip(),
        email=(user.email or "").strip(),
        referred_by="",
        referral_code=generate_referral_code(user.name or "MEMBER"),
        qr_code="",
        joined_date="",
        gym_id=getattr(user, "gym_id", "vikings"),
        branch_id=getattr(user, "branch_id", "aurangabad"),
    )
    member.save()
    member.qr_code = generate_member_qr(member.member_id, member.gym_id)
    member.save()
    return member