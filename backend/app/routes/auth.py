"""Auth routes — login, register, password management, token refresh."""
import os
import json
import urllib.request
import urllib.parse
from flask import Blueprint, request, current_app
from flask_jwt_extended import (
    jwt_required, get_jwt_identity, get_jwt,
    create_access_token,
)
from app.services.auth_service import AuthService
from app.services.member_service import ensure_member_for_user
from app.middleware.rbac import roles_required, get_current_user
from app.middleware.audit import log_audit
from app.middleware.rate_limit import rate_limit
from app.utils.response import success_response, error_response
from app.utils.validators import validate_email, validate_required_fields
from app.utils.helpers import get_client_ip
from app.models.user import User
from app.services.notification_service import NotificationService

auth_bp = Blueprint("auth", __name__)


@auth_bp.route("/login", methods=["POST"])
@rate_limit(max_requests=20, window_seconds=60)
def login():
    """Authenticate user and return JWT tokens."""
    data = request.get_json() or {}
    errors = validate_required_fields(data, ["email", "password"])
    if errors:
        return error_response("Validation error", errors)

    user, err = AuthService.authenticate(data["email"], data["password"])
    if not user:
        return error_response(err, status_code=401)

    tokens = AuthService.generate_tokens(user)
    log_audit(user, "User logged in successfully", "Authentication", get_client_ip())
    return success_response(tokens, "Login successful")


@auth_bp.route("/register", methods=["POST"])
@rate_limit()
def register():
    """Register a new user."""
    data = request.get_json() or {}
    errors = validate_required_fields(data, ["name", "email", "password"])
    if errors:
        return error_response("Validation error", errors)

    if not validate_email(data["email"]):
        return error_response("Invalid email format")

    role = data.get("role", "MEMBER")

    # Only admins can create non-MEMBER roles
    if role != "MEMBER":
        try:
            from flask_jwt_extended import verify_jwt_in_request
            verify_jwt_in_request()
            current = get_current_user()
            if not current or current.role not in ("SUPER_ADMIN", "GYM_OWNER"):
                return error_response("Only admins can create staff accounts", status_code=403)
        except Exception:
            return error_response("Authentication required for creating staff accounts", status_code=401)

    user, err = AuthService.register_user(
        name=data["name"],
        email=data["email"],
        password=data["password"],
        phone=data.get("phone", ""),
        role=role,
        gym_id=data.get("gym_id", "vikings"),
        branch_id=data.get("branch_id", "aurangabad"),
    )
    if not user:
        return error_response(err)

    # Auto-link a Member profile for self-registered members.
    if user.role == "MEMBER":
        ensure_member_for_user(user)

    tokens = AuthService.generate_tokens(user)
    return success_response(tokens, "Registration successful", status_code=201)


@auth_bp.route("/me", methods=["GET"])
@jwt_required()
def me():
    """Get current authenticated user profile."""
    user = get_current_user()
    if not user:
        return error_response("User not found", status_code=404)
    return success_response(user.to_dict())


@auth_bp.route("/refresh", methods=["POST"])
@jwt_required(refresh=True)
def refresh():
    """Refresh the access token."""
    identity = get_jwt_identity()
    user = User.objects(id=identity, is_deleted=False).first()
    if not user:
        return error_response("User not found", status_code=404)

    new_token = create_access_token(
        identity=identity,
        additional_claims={"role": user.role, "email": user.email}
    )
    return success_response({"access_token": new_token}, "Token refreshed")


@auth_bp.route("/logout", methods=["POST"])
@jwt_required()
def logout():
    """Blacklist the current JWT token."""
    jti = get_jwt()["jti"]
    current_app.config["JWT_BLOCKLIST"].add(jti)
    user = get_current_user()
    if user:
        log_audit(user, "User logged out", "Authentication", get_client_ip())
    return success_response(message="Logged out successfully")


@auth_bp.route("/change-password", methods=["POST"])
@jwt_required()
def change_password():
    """Change password for authenticated user."""
    data = request.get_json() or {}
    errors = validate_required_fields(data, ["old_password", "new_password"])
    if errors:
        return error_response("Validation error", errors)

    user = get_current_user()
    if not user:
        return error_response("User not found", status_code=404)

    ok, msg = AuthService.change_password(user, data["old_password"], data["new_password"])
    if not ok:
        return error_response(msg)

    log_audit(user, "Changed password", "Authentication", get_client_ip())
    return success_response(message=msg)


@auth_bp.route("/forgot-password", methods=["POST"])
@rate_limit(max_requests=5, window_seconds=300)
def forgot_password():
    """Send password reset email (stub — logs for now)."""
    data = request.get_json() or {}
    email = data.get("email", "")
    if not email or not validate_email(email):
        return error_response("Valid email required")

    user = User.objects(email=email.lower().strip(), is_deleted=False).first()
    reset_link = ""
    if user:
        from app.config import Config
        base_url = os.getenv("FRONTEND_URL", Config.FRONTEND_URL).rstrip("/")
        reset_link = f"{base_url}/reset-password?email={email}"
        sent = NotificationService.send_email(
            to_email=email,
            subject="Password Reset — Vikings Gym & Spa",
            body=f"Hi {user.name},\n\nUse this link to reset your password: "
                 f"{reset_link}\n\n"
                 f"If you didn't request this, ignore this email.",
        )
        # SMTP not configured in dev → surface the link so the flow still works.
        if not sent:
            return success_response(
                message="Email delivery is not configured yet. Use the reset link below.",
                data={"reset_link": reset_link},
            )

    # Always return success (don't reveal if email exists)
    return success_response(message="If the email exists, a reset link has been sent.")


@auth_bp.route("/reset-password", methods=["POST"])
@rate_limit(max_requests=5, window_seconds=300)
def reset_password():
    """Reset password with email and new password."""
    data = request.get_json() or {}
    errors = validate_required_fields(data, ["email", "new_password"])
    if errors:
        return error_response("Validation error", errors)

    ok, msg = AuthService.reset_password(data["email"], data["new_password"])
    if not ok:
        return error_response(msg)
    return success_response(message=msg)


def _social_register_or_login(email: str, name: str, social_id: str, provider: str):
    """Find user by email, or create a MEMBER user + linked Member for social login."""
    email = (email or "").lower().strip()
    user = User.objects(email=email, is_deleted=False).first() if email else None
    if not user:
        if not email:
            email = f"{provider}_{social_id}@social.local"
        # Random unusable password — login must go through the social provider.
        import secrets
        user, _ = AuthService.register_user(
            name=name or "Warrior Member",
            email=email,
            password=secrets.token_urlsafe(24),
            phone="",
            role="MEMBER",
        )
        ensure_member_for_user(user)
    return user


@auth_bp.route("/google", methods=["POST"])
@rate_limit(max_requests=10, window_seconds=60)
def google_login():
    """Login/register with a Google ID token (OIDC)."""
    data = request.get_json() or {}
    id_token = data.get("id_token", "") or data.get("credential", "")
    if not id_token:
        return error_response("Missing Google id_token")

    params = urllib.parse.urlencode({"id_token": id_token})
    try:
        with urllib.request.urlopen(
            f"https://oauth2.googleapis.com/tokeninfo?{params}", timeout=10
        ) as resp:
            info = json.loads(resp.read().decode("utf-8"))
    except Exception:
        return error_response("Invalid Google token", status_code=400)

    aud = info.get("aud", "")
    expected = os.getenv("GOOGLE_CLIENT_ID", "")
    if expected and aud != expected:
        return error_response("Google token audience mismatch", status_code=400)
    if not info.get("email"):
        return error_response("Google account has no email", status_code=400)

    user = _social_register_or_login(
        email=info["email"],
        name=info.get("name", ""),
        social_id=info.get("sub", ""),
        provider="google",
    )

    tokens = AuthService.generate_tokens(user)
    log_audit(user, f"Logged in via Google ({user.email})", "Authentication", get_client_ip())
    return success_response(tokens, "Google login successful")


@auth_bp.route("/facebook", methods=["POST"])
@rate_limit(max_requests=10, window_seconds=60)
def facebook_login():
    """Login/register with a Facebook access token (Graph API)."""
    data = request.get_json() or {}
    access_token = data.get("access_token", "")
    if not access_token:
        return error_response("Missing Facebook access_token")

    url = (
        "https://graph.facebook.com/me?fields=id,name,email"
        f"&access_token={urllib.parse.quote(access_token)}"
    )
    try:
        with urllib.request.urlopen(url, timeout=10) as resp:
            info = json.loads(resp.read().decode("utf-8"))
    except Exception:
        return error_response("Invalid Facebook token", status_code=400)

    if not info.get("id"):
        return error_response("Invalid Facebook token", status_code=400)

    user = _social_register_or_login(
        email=info.get("email", ""),
        name=info.get("name", ""),
        social_id=info.get("id", ""),
        provider="facebook",
    )

    tokens = AuthService.generate_tokens(user)
    log_audit(user, f"Logged in via Facebook ({user.email})", "Authentication", get_client_ip())
    return success_response(tokens, "Facebook login successful")
