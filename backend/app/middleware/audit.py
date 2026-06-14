"""Audit logging middleware."""
from functools import wraps
from flask import request
from flask_jwt_extended import get_jwt_identity, verify_jwt_in_request
from app.models.audit_log import AuditLog
from app.models.user import User


def audit_action(module: str, action_template: str = ""):
    """
    Decorator that automatically logs POST/PUT/DELETE actions to AuditLog.

    Usage:
        @audit_action("Members Module", "Created new member")
    """
    def decorator(fn):
        @wraps(fn)
        def wrapper(*args, **kwargs):
            # Execute the actual function first
            result = fn(*args, **kwargs)

            # Only log mutating operations
            if request.method in ("POST", "PUT", "PATCH", "DELETE"):
                try:
                    verify_jwt_in_request(optional=True)
                    identity = get_jwt_identity()
                    user = User.objects(id=identity).first() if identity else None

                    action = action_template or f"{request.method} {request.path}"

                    AuditLog(
                        user_id=str(user.id) if user else "anonymous",
                        user_name=user.name if user else "Anonymous",
                        user_email=user.email if user else "",
                        role=user.role if user else "GUEST",
                        action=action,
                        module=module,
                        ip_address=request.remote_addr or "127.0.0.1",
                        details=f"{request.method} {request.path}",
                        gym_id=user.gym_id if user else "vikings",
                        branch_id=user.branch_id if user else "aurangabad",
                    ).save()
                except Exception:
                    pass  # Never let audit logging break the actual request

            return result
        return wrapper
    return decorator


def log_audit(user, action: str, module: str, ip_address: str = "127.0.0.1"):
    """Direct audit log helper for use inside route functions."""
    try:
        AuditLog(
            user_id=str(user.id) if user else "anonymous",
            user_name=user.name if user else "Anonymous",
            user_email=user.email if user else "",
            role=user.role if user else "GUEST",
            action=action,
            module=module,
            ip_address=ip_address,
            details=action,
            gym_id=user.gym_id if user else "vikings",
            branch_id=user.branch_id if user else "aurangabad",
        ).save()
    except Exception:
        pass
