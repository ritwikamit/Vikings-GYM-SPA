"""Expenses routes — CRUD + analytics/P&L."""
from flask import Blueprint, request
from flask_jwt_extended import jwt_required
from app.models.expense import Expense
from app.middleware.rbac import roles_required, get_current_user
from app.middleware.audit import log_audit
from app.utils.response import success_response, error_response, paginate_query
from app.utils.helpers import get_pagination_args, get_client_ip

expenses_bp = Blueprint("expenses", __name__)


@expenses_bp.route("", methods=["GET"])
@jwt_required()
@roles_required("SUPER_ADMIN", "GYM_OWNER")
def list_expenses():
    page, per_page = get_pagination_args()
    category = request.args.get("category", "")
    month = request.args.get("month", "")  # YYYY-MM
    query = Expense.objects(is_deleted=False)
    if category:
        query = query.filter(category=category)
    if month:
        query = query.filter(date__startswith=month)
    items, pagination = paginate_query(query.order_by("-date"), page, per_page)
    return success_response([e.to_dict() for e in items], pagination=pagination)


@expenses_bp.route("", methods=["POST"])
@jwt_required()
@roles_required("SUPER_ADMIN", "GYM_OWNER")
def create_expense():
    data = request.get_json() or {}
    expense = Expense(
        category=data.get("category", "Other"),
        amount=float(data.get("amount", 0)),
        description=data.get("description", ""),
        date=data.get("date", ""),
        paid_by=data.get("paidTo", data.get("paidBy", "")),
        gym_id=data.get("gym_id", "vikings"),
        branch_id=data.get("branch_id", "aurangabad"),
    )
    expense.save()
    user = get_current_user()
    log_audit(user, f"Added expense ₹{expense.amount} for {expense.category}", "Finances", get_client_ip())
    return success_response(expense.to_dict(), "Expense recorded", status_code=201)


@expenses_bp.route("/<exp_id>", methods=["PUT"])
@jwt_required()
@roles_required("SUPER_ADMIN", "GYM_OWNER")
def update_expense(exp_id):
    expense = Expense.objects(id=exp_id, is_deleted=False).first()
    if not expense:
        return error_response("Expense not found", status_code=404)
    data = request.get_json() or {}
    for f in ["category", "description", "date"]:
        if f in data:
            setattr(expense, f, data[f])
    if "amount" in data:
        expense.amount = float(data["amount"])
    if "paidTo" in data:
        expense.paid_by = data["paidTo"]
    expense.save()
    return success_response(expense.to_dict(), "Expense updated")


@expenses_bp.route("/<exp_id>", methods=["DELETE"])
@jwt_required()
@roles_required("SUPER_ADMIN", "GYM_OWNER")
def delete_expense(exp_id):
    expense = Expense.objects(id=exp_id, is_deleted=False).first()
    if not expense:
        return error_response("Expense not found", status_code=404)
    expense.is_deleted = True
    expense.save()
    return success_response(message="Expense deleted")


@expenses_bp.route("/analytics", methods=["GET"])
@jwt_required()
@roles_required("SUPER_ADMIN", "GYM_OWNER")
def expense_analytics():
    """Monthly expense breakdown and P&L."""
    from app.models.payment import Payment
    expenses = Expense.objects(is_deleted=False)

    by_category = {}
    by_month = {}
    for e in expenses:
        cat = e.category or "Other"
        by_category[cat] = by_category.get(cat, 0) + e.amount
        month = e.date[:7] if e.date and len(e.date) >= 7 else "Unknown"
        by_month[month] = by_month.get(month, 0) + e.amount

    total_expenses = sum(by_category.values())
    total_revenue = sum((p.final_amount or p.amount) for p in Payment.objects(status="PAID", is_deleted=False))

    return success_response({
        "totalExpenses": total_expenses,
        "totalRevenue": total_revenue,
        "profitLoss": total_revenue - total_expenses,
        "byCategory": by_category,
        "byMonth": by_month,
    })
