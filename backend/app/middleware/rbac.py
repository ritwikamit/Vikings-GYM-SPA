"""RBAC (Role-Based Access Control) middleware decorators."""
from functools import wraps
from flask import jsonify
from flask_jwt_extended import get_jwt_identity, verify_jwt_in_request
from app.models.user import User


def roles_required(*allowed_roles):
    """
    Decorator that restricts access to users with specified roles.
    Usage: @roles_required("SUPER_ADMIN", "GYM_OWNER")
    """
    def decorator(fn):
        @wraps(fn)
        def wrapper(*args, **kwargs):
            verify_jwt_in_request()
            identity = get_jwt_identity()
            user = User.objects(id=identity, is_deleted=False).first()
            if not user:
                return jsonify({"success": False, "message": "User not found"}), 401
            if user.role not in allowed_roles:
                return jsonify({
                    "success": False,
                    "message": f"Access denied. Required roles: {', '.join(allowed_roles)}"
                }), 403
            return fn(*args, **kwargs)
        return wrapper
    return decorator


def admin_only(fn):
    """Shortcut: only SUPER_ADMIN and GYM_OWNER."""
    return roles_required("SUPER_ADMIN", "GYM_OWNER")(fn)


def staff_or_above(fn):
    """Shortcut: SUPER_ADMIN, GYM_OWNER, RECEPTIONIST."""
    return roles_required("SUPER_ADMIN", "GYM_OWNER", "RECEPTIONIST")(fn)


def trainer_or_above(fn):
    """Shortcut: SUPER_ADMIN, GYM_OWNER, TRAINER."""
    return roles_required("SUPER_ADMIN", "GYM_OWNER", "TRAINER")(fn)


def get_current_user():
    """Helper to fetch the current authenticated user from JWT identity."""
    try:
        identity = get_jwt_identity()
        return User.objects(id=identity, is_deleted=False).first()
    except Exception:
        return None
