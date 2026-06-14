"""Inventory routes — CRUD + POS."""
from flask import Blueprint, request
from flask_jwt_extended import jwt_required
from app.models.inventory import Inventory
from app.middleware.rbac import roles_required, get_current_user
from app.middleware.audit import log_audit
from app.utils.response import success_response, error_response, paginate_query
from app.utils.helpers import get_pagination_args, get_client_ip, generate_invoice_number
from app.services.notification_service import NotificationService

inventory_bp = Blueprint("inventory", __name__)


@inventory_bp.route("", methods=["GET"])
@jwt_required()
@roles_required("SUPER_ADMIN", "GYM_OWNER", "RECEPTIONIST")
def list_inventory():
    page, per_page = get_pagination_args()
    category = request.args.get("category", "")
    query = Inventory.objects(is_deleted=False)
    if category:
        query = query.filter(category=category)
    items, pagination = paginate_query(query.order_by("name"), page, per_page)
    return success_response([i.to_dict() for i in items], pagination=pagination)


@inventory_bp.route("", methods=["POST"])
@jwt_required()
@roles_required("SUPER_ADMIN", "GYM_OWNER")
def create_item():
    data = request.get_json() or {}
    item = Inventory(
        name=data.get("name", ""),
        category=data.get("category", "Other"),
        sku=data.get("sku", ""),
        quantity=int(data.get("stockLevel", data.get("quantity", 0))),
        unit=data.get("unit", "pcs"),
        cost_price=float(data.get("costPrice", 0)),
        selling_price=float(data.get("price", data.get("sellingPrice", 0))),
        low_stock_threshold=int(data.get("minAlertLevel", 5)),
        supplier=data.get("supplier", ""),
        gym_id=data.get("gym_id", "vikings"),
        branch_id=data.get("branch_id", "aurangabad"),
    )
    item.save()
    user = get_current_user()
    log_audit(user, f"Added inventory item {item.name}", "Inventory", get_client_ip())
    return success_response(item.to_dict(), "Item added", status_code=201)


@inventory_bp.route("/<item_id>", methods=["PUT"])
@jwt_required()
@roles_required("SUPER_ADMIN", "GYM_OWNER")
def update_item(item_id):
    item = Inventory.objects(id=item_id, is_deleted=False).first()
    if not item:
        return error_response("Item not found", status_code=404)
    data = request.get_json() or {}
    for f in ["name", "category", "sku", "unit", "supplier"]:
        if f in data:
            setattr(item, f, data[f])
    if "stockLevel" in data or "quantity" in data:
        item.quantity = int(data.get("stockLevel", data.get("quantity", item.quantity)))
    if "costPrice" in data:
        item.cost_price = float(data["costPrice"])
    if "price" in data or "sellingPrice" in data:
        item.selling_price = float(data.get("price", data.get("sellingPrice", item.selling_price)))
    if "minAlertLevel" in data:
        item.low_stock_threshold = int(data["minAlertLevel"])
    item.save()
    return success_response(item.to_dict(), "Item updated")


@inventory_bp.route("/<item_id>", methods=["DELETE"])
@jwt_required()
@roles_required("SUPER_ADMIN", "GYM_OWNER")
def delete_item(item_id):
    item = Inventory.objects(id=item_id, is_deleted=False).first()
    if not item:
        return error_response("Item not found", status_code=404)
    item.is_deleted = True
    item.save()
    return success_response(message="Item deleted")


@inventory_bp.route("/<item_id>/stock-in", methods=["POST"])
@jwt_required()
@roles_required("SUPER_ADMIN", "GYM_OWNER", "RECEPTIONIST")
def stock_in(item_id):
    """Add stock to an item."""
    item = Inventory.objects(id=item_id, is_deleted=False).first()
    if not item:
        return error_response("Item not found", status_code=404)
    data = request.get_json() or {}
    qty = int(data.get("quantity", 0))
    item.quantity += qty
    item.save()
    return success_response(item.to_dict(), f"Added {qty} units")


@inventory_bp.route("/<item_id>/stock-out", methods=["POST"])
@jwt_required()
@roles_required("SUPER_ADMIN", "GYM_OWNER", "RECEPTIONIST")
def stock_out(item_id):
    """Reduce stock (POS sale)."""
    item = Inventory.objects(id=item_id, is_deleted=False).first()
    if not item:
        return error_response("Item not found", status_code=404)
    data = request.get_json() or {}
    qty = int(data.get("quantity", 0))
    if item.quantity < qty:
        return error_response("Insufficient stock")
    item.quantity -= qty
    item.save()

    if item.quantity <= item.low_stock_threshold:
        NotificationService.notify_low_stock(item.name, item.quantity)

    return success_response(item.to_dict(), f"Removed {qty} units")


@inventory_bp.route("/low-stock", methods=["GET"])
@jwt_required()
@roles_required("SUPER_ADMIN", "GYM_OWNER", "RECEPTIONIST")
def low_stock():
    """Items below threshold."""
    items = Inventory.objects(is_deleted=False)
    low = [i.to_dict() for i in items if i.quantity <= i.low_stock_threshold]
    return success_response(low)


@inventory_bp.route("/pos/bill", methods=["POST"])
@jwt_required()
@roles_required("SUPER_ADMIN", "GYM_OWNER", "RECEPTIONIST")
def pos_bill():
    """Generate POS bill with GST."""
    data = request.get_json() or {}
    items_list = data.get("items", [])
    coupon_code = data.get("couponCode", "")

    subtotal = 0
    bill_items = []
    for entry in items_list:
        item = Inventory.objects(id=entry.get("id"), is_deleted=False).first()
        if not item:
            return error_response(f"Item not found: {entry.get('id')}")
        qty = int(entry.get("qty", 1))
        if item.quantity < qty:
            return error_response(f"Insufficient stock for {item.name}")
        line_total = item.selling_price * qty
        subtotal += line_total
        bill_items.append({"name": item.name, "qty": qty, "price": item.selling_price, "total": line_total})

        item.quantity -= qty
        item.save()
        if item.quantity <= item.low_stock_threshold:
            NotificationService.notify_low_stock(item.name, item.quantity)

    # Apply coupon
    discount = 0
    if coupon_code:
        from app.services.payment_service import PaymentService
        discount, _ = PaymentService.apply_coupon(coupon_code, subtotal)

    gst = round((subtotal - discount) * 0.18, 2)
    grand_total = round(subtotal - discount + gst, 2)
    invoice = generate_invoice_number()

    return success_response({
        "items": bill_items,
        "subtotal": subtotal,
        "discount": discount,
        "gst": gst,
        "grandTotal": grand_total,
        "invoice": invoice,
    }, "POS bill generated")
