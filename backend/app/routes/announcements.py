"""Announcements routes."""
from datetime import datetime, timezone
from flask import Blueprint, request
from flask_jwt_extended import jwt_required
from app.models.announcement import Announcement
from app.models.user import User
from app.middleware.rbac import roles_required, get_current_user
from app.middleware.audit import log_audit
from app.utils.response import success_response, error_response, paginate_query
from app.utils.helpers import get_pagination_args, get_client_ip
from app.services.notification_service import NotificationService

announcements_bp = Blueprint("announcements", __name__)


@announcements_bp.route("", methods=["GET"])
@jwt_required()
def list_announcements():
    page, per_page = get_pagination_args()
    query = Announcement.objects(is_deleted=False)
    role = request.args.get("role", "")
    if role:
        query = query.filter(target_roles__in=[role, "ALL"])
    items, pagination = paginate_query(query.order_by("-created_at"), page, per_page)
    return success_response([a.to_dict() for a in items], pagination=pagination)


@announcements_bp.route("", methods=["POST"])
@jwt_required()
@roles_required("SUPER_ADMIN", "GYM_OWNER")
def create_announcement():
    data = request.get_json() or {}
    ann = Announcement(
        title=data.get("title", ""),
        body=data.get("content", data.get("body", "")),
        target_roles=data.get("targetRoles", [data.get("targetRole", "ALL")]),
        created_by=data.get("createdBy", ""),
        gym_id=data.get("gym_id", "vikings"),
        branch_id=data.get("branch_id", "aurangabad"),
    )
    ann.save()
    user = get_current_user()
    log_audit(user, f"Created announcement: {ann.title}", "Announcements", get_client_ip())
    return success_response(ann.to_dict(), "Announcement created", status_code=201)


@announcements_bp.route("/<ann_id>", methods=["PUT"])
@jwt_required()
@roles_required("SUPER_ADMIN", "GYM_OWNER")
def update_announcement(ann_id):
    ann = Announcement.objects(id=ann_id, is_deleted=False).first()
    if not ann:
        return error_response("Announcement not found", status_code=404)
    data = request.get_json() or {}
    if "title" in data:
        ann.title = data["title"]
    if "content" in data or "body" in data:
        ann.body = data.get("content", data.get("body", ann.body))
    if "targetRole" in data or "targetRoles" in data:
        ann.target_roles = data.get("targetRoles", [data.get("targetRole", "ALL")])
    ann.save()
    return success_response(ann.to_dict(), "Announcement updated")


@announcements_bp.route("/<ann_id>", methods=["DELETE"])
@jwt_required()
@roles_required("SUPER_ADMIN", "GYM_OWNER")
def delete_announcement(ann_id):
    ann = Announcement.objects(id=ann_id, is_deleted=False).first()
    if not ann:
        return error_response("Announcement not found", status_code=404)
    ann.is_deleted = True
    ann.save()
    return success_response(message="Announcement deleted")


@announcements_bp.route("/<ann_id>/publish", methods=["POST"])
@jwt_required()
@roles_required("SUPER_ADMIN", "GYM_OWNER")
def publish_announcement(ann_id):
    """Publish immediately and notify target users."""
    ann = Announcement.objects(id=ann_id, is_deleted=False).first()
    if not ann:
        return error_response("Announcement not found", status_code=404)

    ann.is_published = True
    ann.published_at = datetime.now(timezone.utc)
    ann.save()

    # Notify target users
    target = ann.target_roles[0] if ann.target_roles else "ALL"
    users = User.objects(is_deleted=False)
    for u in users:
        if target == "ALL" or u.role == target:
            NotificationService.send_in_app(
                user_id=str(u.id),
                title=f"📢 {ann.title}",
                message=ann.body,
                notification_type="Announcement",
            )

    return success_response(ann.to_dict(), "Announcement published")


@announcements_bp.route("/<ann_id>/schedule", methods=["POST"])
@jwt_required()
@roles_required("SUPER_ADMIN", "GYM_OWNER")
def schedule_announcement(ann_id):
    """Schedule for later."""
    data = request.get_json() or {}
    ann = Announcement.objects(id=ann_id, is_deleted=False).first()
    if not ann:
        return error_response("Announcement not found", status_code=404)

    scheduled_at = data.get("scheduledAt", "")
    if scheduled_at:
        ann.scheduled_at = datetime.fromisoformat(scheduled_at)
    ann.save()
    return success_response(ann.to_dict(), "Announcement scheduled")
