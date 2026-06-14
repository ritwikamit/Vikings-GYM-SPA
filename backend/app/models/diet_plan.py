"""Diet Plan model."""
from datetime import datetime, timezone
from app.extensions import db


class FoodItem(db.EmbeddedDocument):
    """Single food item in a meal."""
    item = db.StringField(required=True)
    quantity = db.StringField(default="1 serving")
    calories = db.IntField(default=0)
    protein = db.FloatField(default=0)


class Meal(db.EmbeddedDocument):
    """Single meal in a diet plan."""
    name = db.StringField()  # Breakfast, Lunch, etc.
    time = db.StringField()  # e.g., "08:00 AM"
    meal_type = db.StringField(
        choices=["Breakfast", "Snack", "Lunch", "Pre-Workout", "Post-Workout", "Dinner"],
        default="Breakfast"
    )
    description = db.StringField(default="")
    foods = db.EmbeddedDocumentListField(FoodItem, default=list)
    calories_estimate = db.IntField(default=0)


class DietPlan(db.Document):
    """Diet / nutrition plan assigned to a member."""

    GOAL_CHOICES = ("WeightLoss", "MuscleGain", "Maintenance")

    title = db.StringField(required=True, max_length=200)
    created_by = db.ReferenceField("Trainer", dbref=False)
    created_by_name = db.StringField(max_length=100)
    assigned_to = db.ReferenceField("Member", dbref=False)
    assigned_to_name = db.StringField(max_length=100)
    goal = db.StringField(choices=GOAL_CHOICES, default="Maintenance")
    total_calories = db.IntField(default=2000)
    meals = db.EmbeddedDocumentListField(Meal, default=list)
    water_intake_liters = db.FloatField(default=3.0)
    notes = db.StringField(default="")

    # Multi-tenancy
    gym_id = db.StringField(default="vikings")
    branch_id = db.StringField(default="aurangabad")

    # Timestamps
    created_at = db.DateTimeField(default=lambda: datetime.now(timezone.utc))
    updated_at = db.DateTimeField(default=lambda: datetime.now(timezone.utc))
    is_deleted = db.BooleanField(default=False)

    meta = {
        "collection": "diet_plans",
        "indexes": ["assigned_to", "created_by", "gym_id", "branch_id"],
    }

    def to_dict(self):
        return {
            "id": str(self.id),
            "name": self.title,
            "memberId": str(self.assigned_to.id) if self.assigned_to else "",
            "memberName": self.assigned_to_name or "",
            "trainerId": str(self.created_by.id) if self.created_by else "",
            "trainerName": self.created_by_name or "",
            "caloriesTarget": self.total_calories,
            "goal": self.goal,
            "meals": [
                {
                    "time": m.time or "",
                    "type": m.meal_type or m.name or "",
                    "description": m.description or "",
                    "caloriesEstimate": m.calories_estimate,
                    "foods": [
                        {"item": f.item, "quantity": f.quantity, "calories": f.calories, "protein": f.protein}
                        for f in m.foods
                    ],
                }
                for m in self.meals
            ],
            "waterIntakeLiters": self.water_intake_liters,
            "notes": self.notes or "",
            "gym_id": self.gym_id,
            "branch_id": self.branch_id,
        }

    def save(self, *args, **kwargs):
        self.updated_at = datetime.now(timezone.utc)
        return super().save(*args, **kwargs)
