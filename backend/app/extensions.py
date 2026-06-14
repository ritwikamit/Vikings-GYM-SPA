"""
Shared Flask extension instances.
Initialized in app factory create_app().
"""
import mongoengine
from flask_jwt_extended import JWTManager
from flask_bcrypt import Bcrypt
from flask_cors import CORS
from flask_socketio import SocketIO
from apscheduler.schedulers.background import BackgroundScheduler

class MongoEngineProxy:
    def __getattr__(self, name):
        return getattr(mongoengine, name)

    def init_app(self, app):
        settings = app.config.get('MONGODB_SETTINGS', {})
        mongoengine.connect(**settings)

db = MongoEngineProxy()
jwt = JWTManager()
bcrypt = Bcrypt()
cors = CORS()
socketio = SocketIO(cors_allowed_origins="*", async_mode=None)
scheduler = BackgroundScheduler(daemon=True)
