"""Notification service — in-app, email, and WhatsApp (stub)."""
import os
import smtplib
import logging
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from datetime import datetime, timezone
from app.models.notification import Notification

logger = logging.getLogger(__name__)


class NotificationService:
    """Handles all notification channels."""

    @staticmethod
    def send_in_app(user_id: str, title: str, message: str,
                    notification_type: str = "Announcement",
                    gym_id: str = "vikings",
                    branch_id: str = "aurangabad") -> Notification:
        """Create an in-app notification (saved to DB)."""
        notif = Notification(
            user_id=user_id,
            notification_type=notification_type,
            title=title,
            message=message,
            is_read=False,
            sent_at=datetime.now(timezone.utc),
            gym_id=gym_id,
            branch_id=branch_id,
        )
        notif.save()
        return notif

    @staticmethod
    def send_email(to_email: str, subject: str, body: str, html: bool = False) -> bool:
        """
        Send an email via SMTP.
        Returns True on success, False on failure.
        """
        mail_server = os.getenv("MAIL_SERVER", "smtp.gmail.com")
        mail_port = int(os.getenv("MAIL_PORT", 587))
        mail_username = os.getenv("MAIL_USERNAME", "")
        mail_password = os.getenv("MAIL_PASSWORD", "")

        if not mail_username or not mail_password:
            logger.warning(f"Email not configured. Would send to {to_email}: {subject}")
            return False

        try:
            msg = MIMEMultipart("alternative")
            msg["From"] = mail_username
            msg["To"] = to_email
            msg["Subject"] = subject

            if html:
                msg.attach(MIMEText(body, "html"))
            else:
                msg.attach(MIMEText(body, "plain"))

            with smtplib.SMTP(mail_server, mail_port) as server:
                server.starttls()
                server.login(mail_username, mail_password)
                server.sendmail(mail_username, to_email, msg.as_string())

            logger.info(f"Email sent to {to_email}: {subject}")
            return True
        except Exception as e:
            logger.error(f"Failed to send email to {to_email}: {e}")
            return False

    @staticmethod
    def send_whatsapp(phone: str, message: str) -> bool:
        """
        WhatsApp notification stub — logs the message.
        Ready for future Twilio/WhatsApp Business API integration.
        """
        logger.info(f"[WhatsApp STUB] To: {phone} | Message: {message}")
        return True

    @staticmethod
    def notify_membership_expiry(user_id: str, member_name: str,
                                 days_remaining: int,
                                 gym_id: str = "vikings",
                                 branch_id: str = "aurangabad"):
        """Send membership expiry notification."""
        if days_remaining == 0:
            title = "Membership Expired!"
            message = f"Hi {member_name}, your membership has expired today. Please renew to continue."
        else:
            title = f"Membership Expiring in {days_remaining} day(s)"
            message = f"Hi {member_name}, your membership expires in {days_remaining} day(s). Renew now!"

        NotificationService.send_in_app(
            user_id=user_id, title=title, message=message,
            notification_type="MembershipExpiry",
            gym_id=gym_id, branch_id=branch_id,
        )

    @staticmethod
    def notify_birthday(user_id: str, member_name: str,
                        gym_id: str = "vikings", branch_id: str = "aurangabad"):
        """Send birthday wishes."""
        NotificationService.send_in_app(
            user_id=user_id,
            title="🎂 Happy Birthday!",
            message=f"Happy Birthday, {member_name}! Vikings Gym & Spa wishes you a fantastic day. 💪",
            notification_type="Birthday",
            gym_id=gym_id, branch_id=branch_id,
        )

    @staticmethod
    def notify_low_stock(item_name: str, current_stock: int,
                         gym_id: str = "vikings", branch_id: str = "aurangabad"):
        """Alert admin about low stock."""
        NotificationService.send_in_app(
            user_id="admin",
            title="⚠️ Low Stock Alert",
            message=f"{item_name} is running low! Current stock: {current_stock} units.",
            notification_type="Announcement",
            gym_id=gym_id, branch_id=branch_id,
        )

    @staticmethod
    def notify_equipment_maintenance(equipment_name: str, days_until: int,
                                     gym_id: str = "vikings",
                                     branch_id: str = "aurangabad"):
        """Alert about equipment needing service."""
        NotificationService.send_in_app(
            user_id="admin",
            title="🔧 Equipment Maintenance Due",
            message=f"{equipment_name} needs servicing in {days_until} day(s).",
            notification_type="Announcement",
            gym_id=gym_id, branch_id=branch_id,
        )
