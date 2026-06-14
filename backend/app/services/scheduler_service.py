"""Scheduler service — APScheduler cron jobs for automated alerts."""
import logging
from datetime import datetime, timedelta, timezone
from app.extensions import scheduler

logger = logging.getLogger(__name__)


def register_jobs(app):
    """Register all scheduled jobs with the APScheduler."""

    @scheduler.scheduled_job("cron", hour=8, minute=0, id="membership_expiry_check")
    def check_membership_expiry():
        with app.app_context():
            _check_membership_expiry()

    @scheduler.scheduled_job("cron", hour=8, minute=5, id="birthday_wishes")
    def send_birthday_wishes():
        with app.app_context():
            _send_birthday_wishes()

    @scheduler.scheduled_job("cron", hour=8, minute=10, id="equipment_maintenance_check")
    def check_equipment_maintenance():
        with app.app_context():
            _check_equipment_maintenance()

    @scheduler.scheduled_job("cron", hour=8, minute=15, id="low_stock_check")
    def check_low_stock():
        with app.app_context():
            _check_low_stock()

    @scheduler.scheduled_job("cron", hour=8, minute=20, id="inactive_member_check")
    def check_inactive_members():
        with app.app_context():
            _check_inactive_members()

    @scheduler.scheduled_job("cron", hour=0, minute=0, id="rate_limit_cleanup")
    def cleanup_rate_limits():
        from app.middleware.rate_limit import cleanup_old_entries
        cleanup_old_entries()

    logger.info("All scheduled jobs registered successfully.")


def _check_membership_expiry():
    """Notify members whose memberships are expiring in 7, 3, 1, 0 days."""
    from app.models.membership import Membership
    from app.models.member import Member
    from app.services.notification_service import NotificationService

    today = datetime.now(timezone.utc).date()
    alert_days = [7, 3, 1, 0]

    for days in alert_days:
        target_date = (today + timedelta(days=days)).strftime("%Y-%m-%d")
        expiring = Membership.objects(
            end_date=target_date, status="ACTIVE", is_deleted=False
        )
        for membership in expiring:
            try:
                member = Member.objects(id=membership.member_id.id).first()
                if member:
                    user_id = str(member.user_id.id) if member.user_id else str(member.id)
                    NotificationService.notify_membership_expiry(
                        user_id=user_id,
                        member_name=member.name,
                        days_remaining=days,
                        gym_id=member.gym_id,
                        branch_id=member.branch_id,
                    )
            except Exception as e:
                logger.error(f"Expiry notification error: {e}")

    # Auto-expire past-due memberships
    expired = Membership.objects(
        end_date__lt=today.strftime("%Y-%m-%d"),
        status="ACTIVE", is_deleted=False,
    )
    for m in expired:
        m.status = "EXPIRED"
        m.save()

    logger.info(f"Membership expiry check complete. Expired {expired.count()} memberships.")


def _send_birthday_wishes():
    """Send birthday notifications to members."""
    from app.models.member import Member
    from app.services.notification_service import NotificationService

    today_mmdd = datetime.now(timezone.utc).strftime("-%m-%d")  # e.g. "-06-14"
    members = Member.objects(is_deleted=False)

    for member in members:
        if member.dob and member.dob.endswith(today_mmdd):
            user_id = str(member.user_id.id) if member.user_id else str(member.id)
            NotificationService.notify_birthday(
                user_id=user_id,
                member_name=member.name,
                gym_id=member.gym_id,
                branch_id=member.branch_id,
            )

    logger.info("Birthday wishes check complete.")


def _check_equipment_maintenance():
    """Alert when equipment needs service within 3 days."""
    from app.models.equipment import Equipment
    from app.services.notification_service import NotificationService

    today = datetime.now(timezone.utc).date()

    equipment_list = Equipment.objects(is_deleted=False)
    for eq in equipment_list:
        if eq.next_service_date:
            try:
                service_date = datetime.strptime(eq.next_service_date, "%Y-%m-%d").date()
                days_until = (service_date - today).days
                if 0 <= days_until <= 3:
                    NotificationService.notify_equipment_maintenance(
                        equipment_name=eq.name,
                        days_until=days_until,
                        gym_id=eq.gym_id,
                        branch_id=eq.branch_id,
                    )
            except ValueError:
                pass

    logger.info("Equipment maintenance check complete.")


def _check_low_stock():
    """Alert when inventory items are below threshold."""
    from app.models.inventory import Inventory
    from app.services.notification_service import NotificationService

    low_items = Inventory.objects(is_deleted=False)
    for item in low_items:
        if item.quantity <= item.low_stock_threshold:
            NotificationService.notify_low_stock(
                item_name=item.name,
                current_stock=item.quantity,
                gym_id=item.gym_id,
                branch_id=item.branch_id,
            )

    logger.info("Low stock check complete.")


def _check_inactive_members():
    """Alert about members with no attendance in the last 7 days."""
    from app.models.member import Member
    from app.models.attendance import Attendance
    from app.services.notification_service import NotificationService

    seven_days_ago = (datetime.now(timezone.utc) - timedelta(days=7)).strftime("%Y-%m-%d")
    members = Member.objects(is_deleted=False)

    for member in members:
        recent = Attendance.objects(
            member_id=member.id,
            date__gte=seven_days_ago,
            is_deleted=False,
        ).count()

        if recent == 0:
            NotificationService.send_in_app(
                user_id="admin",
                title="Inactive Member Alert",
                message=f"{member.name} has not visited the gym in 7+ days.",
                notification_type="Attendance",
                gym_id=member.gym_id,
                branch_id=member.branch_id,
            )

    logger.info("Inactive member check complete.")
