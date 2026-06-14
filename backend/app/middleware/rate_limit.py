"""Simple in-memory rate limiter."""
import time
from functools import wraps
from flask import request, jsonify

# In-memory store: { ip: [timestamp1, timestamp2, ...] }
_request_log: dict[str, list[float]] = {}

# Config
RATE_LIMIT = 100  # max requests
RATE_WINDOW = 60  # per N seconds


def rate_limit(max_requests: int = RATE_LIMIT, window_seconds: int = RATE_WINDOW):
    """
    Decorator to rate-limit an endpoint by IP address.
    Uses a sliding window approach.
    """
    def decorator(fn):
        @wraps(fn)
        def wrapper(*args, **kwargs):
            ip = request.remote_addr or "unknown"
            now = time.time()

            if ip not in _request_log:
                _request_log[ip] = []

            # Remove timestamps outside the window
            _request_log[ip] = [t for t in _request_log[ip] if now - t < window_seconds]

            if len(_request_log[ip]) >= max_requests:
                return jsonify({
                    "success": False,
                    "message": f"Rate limit exceeded. Max {max_requests} requests per {window_seconds}s."
                }), 429

            _request_log[ip].append(now)
            return fn(*args, **kwargs)
        return wrapper
    return decorator


def cleanup_old_entries():
    """Periodic cleanup to prevent memory leak. Call from scheduler."""
    now = time.time()
    stale_ips = [ip for ip, times in _request_log.items()
                 if all(now - t > RATE_WINDOW * 2 for t in times)]
    for ip in stale_ips:
        del _request_log[ip]
