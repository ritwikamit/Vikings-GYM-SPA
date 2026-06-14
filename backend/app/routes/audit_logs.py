"""Audit Logs routes."""
from flask import Blueprint, request
from flask_jwt_extended import jwt_required
from app.models.audit_log import AuditLog
from app.middleware.rbac import roles_required
from app.utils.response import success_response, paginate_query
from app.utils.helpers import get_pagination_args

audit_logs_bp = Blueprint("audit_logs", __name__)


@audit_logs_bp.route("", methods=["GET"])
@jwt_required()
@roles_required("SUPER_ADMIN", "GYM_OWNER")
def list_audit_logs():
    """List audit logs with filters."""
    page, per_page = get_pagination_args()
    user_id = request.args.get("userId", "")
    module = request.args.get("module", "")
    date = request.args.get("date", "")

    query = AuditLog.objects()
    if user_id:
        query = query.filter(user_id=user_id)
    if module:
        query = query.filter(module__icontains=module)
    if date:
        from datetime import datetime, timedelta
        try:
            day_start = datetime.strptime(date, "%Y-%m-%d")
            day_end = day_start + timedelta(days=1)
            query = query.filter(timestamp__gte=day_start, timestamp__lt=day_end)
        except ValueError:
            pass

    items, pagination = paginate_query(query.order_by("-timestamp"), page, per_page)
    return success_response([l.to_dict() for l in items], pagination=pagination)
