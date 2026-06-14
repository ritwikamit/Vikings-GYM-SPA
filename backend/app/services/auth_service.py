"""Authentication service — login, token generation, password management."""
from datetime import datetime, timezone
from flask_jwt_extended import create_access_token, create_refresh_token
from app.extensions import bcrypt
from app.models.user import User


class AuthService:
    """Handles authentication logic."""

    @staticmethod
    def authenticate(email: str, password: str) -> tuple[User | None, str]:
        """
        Validate email + password. Returns (user, error_message).
        """
        user = User.objects(email=email.lower().strip(), is_deleted=False).first()
        if not user:
            return None, "Invalid email or password"
        if not user.is_active:
            return None, "Account is deactivated. Contact admin."
        if not bcrypt.check_password_hash(user.password_hash, password):
            return None, "Invalid email or password"

        # Update last login
        user.last_login = datetime.now(timezone.utc)
        user.save()
        return user, ""

    @staticmethod
    def generate_tokens(user: User) -> dict:
        """Generate JWT access + refresh tokens for a user."""
        identity = str(user.id)
        access_token = create_access_token(
            identity=identity,
            additional_claims={"role": user.role, "email": user.email}
        )
        refresh_token = create_refresh_token(identity=identity)
        return {
            "access_token": access_token,
            "refresh_token": refresh_token,
            "user": user.to_dict(),
        }

    @staticmethod
    def register_user(name: str, email: str, password: str, phone: str = "",
                      role: str = "MEMBER", gym_id: str = "vikings",
                      branch_id: str = "aurangabad") -> tuple[User | None, str]:
        """
        Register a new user. Returns (user, error_message).
        """
        email = email.lower().strip()
        existing = User.objects(email=email).first()
        if existing:
            return None, "Email already registered"

        password_hash = bcrypt.generate_password_hash(password).decode("utf-8")
        user = User(
            name=name.strip(),
            email=email,
            phone=phone.strip(),
            password_hash=password_hash,
            role=role,
            gym_id=gym_id,
            branch_id=branch_id,
        )
        user.save()
        return user, ""

    @staticmethod
    def change_password(user: User, old_password: str, new_password: str) -> tuple[bool, str]:
        """Change user password after verifying old password."""
        if not bcrypt.check_password_hash(user.password_hash, old_password):
            return False, "Current password is incorrect"
        user.password_hash = bcrypt.generate_password_hash(new_password).decode("utf-8")
        user.save()
        return True, "Password changed successfully"

    @staticmethod
    def reset_password(email: str, new_password: str) -> tuple[bool, str]:
        """Reset user password (called after token verification)."""
        user = User.objects(email=email.lower().strip(), is_deleted=False).first()
        if not user:
            return False, "User not found"
        user.password_hash = bcrypt.generate_password_hash(new_password).decode("utf-8")
        user.save()
        return True, "Password reset successfully"

    @staticmethod
    def hash_password(password: str) -> str:
        """Hash a password for seeding or programmatic use."""
        return bcrypt.generate_password_hash(password).decode("utf-8")
