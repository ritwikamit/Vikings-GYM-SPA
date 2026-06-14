"""Standardized API response helpers."""
from flask import jsonify


def success_response(data=None, message="Operation successful", pagination=None, status_code=200):
    """Return a standardized success JSON response."""
    payload = {
        "success": True,
        "message": message,
        "data": data,
    }
    if pagination:
        payload["pagination"] = pagination
    return jsonify(payload), status_code


def error_response(message="An error occurred", errors=None, status_code=400):
    """Return a standardized error JSON response."""
    payload = {
        "success": False,
        "message": message,
    }
    if errors:
        payload["errors"] = errors
    return jsonify(payload), status_code


def paginate_query(query, page=1, per_page=20):
    """
    Paginate a MongoEngine queryset and return (items, pagination_dict).
    """
    page = max(1, page)
    per_page = min(max(1, per_page), 100)

    total = query.count()
    pages = (total + per_page - 1) // per_page if total > 0 else 1
    items = query.skip((page - 1) * per_page).limit(per_page)

    pagination = {
        "page": page,
        "per_page": per_page,
        "total": total,
        "pages": pages,
    }
    return list(items), pagination
