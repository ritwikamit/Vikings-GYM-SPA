"""Notifications routes."""
from flask import Blueprint
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.models.notification import Notification
from app.utils.response import success_response, error_response, paginate_query
from app.utils.helpers import get_pagination_args

notifications_bp = Blueprint("notifications", __name__)


@notifications_bp.route("", methods=["GET"])
@jwt_required()
def list_notifications():
    identity = get_jwt_identity()
    page, per_page = get_pagination_args()
    query = Notification.objects(user_id=identity, is_deleted=False).order_by("-sent_at")
    items, pagination = paginate_query(query, page, per_page)
    return success_response([n.to_dict() for n in items], pagination=pagination)


@notifications_bp.route("/<notif_id>/read", methods=["PUT"])
@jwt_required()
def mark_read(notif_id):
    notif = Notification.objects(id=notif_id, is_deleted=False).first()
    if not notif:
        return error_response("Notification not found", status_code=404)
    notif.is_read = True
    notif.save()
    return success_response(notif.to_dict(), "Marked as read")


@notifications_bp.route("/read-all", methods=["PUT"])
@jwt_required()
def mark_all_read():
    identity = get_jwt_identity()
    Notification.objects(user_id=identity, is_read=False).update(set__is_read=True)
    return success_response(message="All notifications marked as read")


@notifications_bp.route("/<notif_id>", methods=["DELETE"])
@jwt_required()
def delete_notification(notif_id):
    notif = Notification.objects(id=notif_id, is_deleted=False).first()
    if not notif:
        return error_response("Notification not found", status_code=404)
    notif.is_deleted = True
    notif.save()
    return success_response(message="Notification deleted")


@notifications_bp.route("/unread-count", methods=["GET"])
@jwt_required()
def unread_count():
    identity = get_jwt_identity()
    count = Notification.objects(user_id=identity, is_read=False, is_deleted=False).count()
    return success_response({"count": count})
