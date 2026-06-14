"""
Vikings Gym & Spa — Flask Application Factory
"""
import os
from flask import Flask
from .config import config_by_name
from .extensions import db, jwt, bcrypt, cors, socketio, scheduler


def create_app(config_name: str | None = None) -> Flask:
    """Create and configure the Flask application."""
    if config_name is None:
        config_name = os.getenv("FLASK_ENV", "development")

    app = Flask(__name__)
    app.config.from_object(config_by_name.get(config_name, config_by_name["development"]))

    # Ensure upload folder exists
    os.makedirs(app.config.get("UPLOAD_FOLDER", "uploads"), exist_ok=True)

    # Initialize extensions
    db.init_app(app)
    jwt.init_app(app)
    bcrypt.init_app(app)
    cors.init_app(app, resources={r"/api/*": {"origins": ["http://localhost:3000", "http://localhost:3001", "http://localhost:3002", "http://localhost:5173", "http://127.0.0.1:3000", "http://127.0.0.1:3001", "http://127.0.0.1:3002", "http://127.0.0.1:5173"]}}, supports_credentials=True)
    socketio.init_app(app)

    # JWT token blocklist (in-memory for dev, use Redis in prod)
    app.config["JWT_BLOCKLIST"] = set()

    @jwt.token_in_blocklist_loader
    def check_if_token_revoked(_jwt_header, jwt_payload):
        jti = jwt_payload["jti"]
        return jti in app.config["JWT_BLOCKLIST"]

    # Register blueprints
    _register_blueprints(app)

    # Start scheduler
    from .services.scheduler_service import register_jobs
    if not scheduler.running:
        register_jobs(app)
        scheduler.start()

    return app


def _register_blueprints(app: Flask) -> None:
    """Register all route blueprints."""
    from .routes.auth import auth_bp
    from .routes.members import members_bp
    from .routes.memberships import memberships_bp
    from .routes.attendance import attendance_bp
    from .routes.payments import payments_bp
    from .routes.trainers import trainers_bp
    from .routes.leads import leads_bp
    from .routes.workouts import workouts_bp
    from .routes.diet_plans import diet_plans_bp
    from .routes.progress import progress_bp
    from .routes.pt import pt_bp
    from .routes.expenses import expenses_bp
    from .routes.inventory import inventory_bp
    from .routes.lockers import lockers_bp
    from .routes.equipment import equipment_bp
    from .routes.announcements import announcements_bp
    from .routes.notifications import notifications_bp
    from .routes.referrals import referrals_bp
    from .routes.coupons import coupons_bp
    from .routes.analytics import analytics_bp
    from .routes.audit_logs import audit_logs_bp
    from .routes.dashboard import dashboard_bp

    blueprints = [
        (auth_bp, "/api/auth"),
        (members_bp, "/api/members"),
        (memberships_bp, "/api/memberships"),
        (attendance_bp, "/api/attendance"),
        (payments_bp, "/api/payments"),
        (trainers_bp, "/api/trainers"),
        (leads_bp, "/api/leads"),
        (workouts_bp, "/api/workouts"),
        (diet_plans_bp, "/api/diet"),
        (progress_bp, "/api/progress"),
        (pt_bp, "/api/pt"),
        (expenses_bp, "/api/expenses"),
        (inventory_bp, "/api/inventory"),
        (lockers_bp, "/api/lockers"),
        (equipment_bp, "/api/equipment"),
        (announcements_bp, "/api/announcements"),
        (notifications_bp, "/api/notifications"),
        (referrals_bp, "/api/referrals"),
        (coupons_bp, "/api/coupons"),
        (analytics_bp, "/api/analytics"),
        (audit_logs_bp, "/api/audit"),
        (dashboard_bp, "/api/dashboard"),
    ]

    for bp, prefix in blueprints:
        app.register_blueprint(bp, url_prefix=prefix)
