"""Inventory model."""
from datetime import datetime, timezone
from app.extensions import db


class Inventory(db.Document):
    """Inventory / POS stock items."""

    CATEGORY_CHOICES = ("Supplement", "Merchandise", "Equipment", "Other",
                        "Supplements", "Equipment Parts")

    name = db.StringField(required=True, max_length=200)
    category = db.StringField(default="Other")
    sku = db.StringField(max_length=50)
    quantity = db.IntField(default=0)
    unit = db.StringField(default="pcs")
    cost_price = db.FloatField(default=0)
    selling_price = db.FloatField(default=0)
    low_stock_threshold = db.IntField(default=5)
    supplier = db.StringField(max_length=200)

    # Multi-tenancy
    gym_id = db.StringField(default="vikings")
    branch_id = db.StringField(default="aurangabad")

    # Timestamps
    created_at = db.DateTimeField(default=lambda: datetime.now(timezone.utc))
    updated_at = db.DateTimeField(default=lambda: datetime.now(timezone.utc))
    is_deleted = db.BooleanField(default=False)

    meta = {
        "collection": "inventory",
        "indexes": ["sku", "category", "gym_id", "branch_id"],
    }

    def to_dict(self):
        return {
            "id": str(self.id),
            "name": self.name,
            "category": self.category,
            "sku": self.sku or "",
            "stockLevel": self.quantity,
            "unit": self.unit,
            "costPrice": self.cost_price,
            "price": self.selling_price,
            "minAlertLevel": self.low_stock_threshold,
            "supplier": self.supplier or "",
            "gym_id": self.gym_id,
            "branch_id": self.branch_id,
        }

    def save(self, *args, **kwargs):
        self.updated_at = datetime.now(timezone.utc)
        return super().save(*args, **kwargs)
