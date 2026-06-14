"""Seed data for Diets."""
import random
from app.models.member import Member
from app.models.trainer import Trainer
from app.models.diet_plan import DietPlan

def seed_diets():
    """Seed diet plans for members."""
    print("Seeding diet plans...")
    diets_created = 0
    
    members = list(Member.objects())
    trainers = list(Trainer.objects())
    
    if not members or not trainers:
        return 0

    for member in members:
        # Give 40% of members a diet plan
        if random.random() < 0.4:
            trainer = random.choice(trainers)
            
            meals = [
                {"time": "08:00 AM", "meal_type": "Breakfast", "description": "Oatmeal with whey protein", "calories_estimate": 450},
                {"time": "11:00 AM", "meal_type": "Snack", "description": "Apple and almonds", "calories_estimate": 200},
                {"time": "01:30 PM", "meal_type": "Lunch", "description": "Chicken breast with brown rice", "calories_estimate": 600},
                {"time": "05:00 PM", "meal_type": "Pre-Workout", "description": "Banana and black coffee", "calories_estimate": 150},
                {"time": "08:30 PM", "meal_type": "Dinner", "description": "Grilled fish with mixed veggies", "calories_estimate": 500},
            ]

            DietPlan(
                title="Standard Muscle Gain Diet",
                assigned_to=str(member.id),
                assigned_to_name=member.name,
                created_by=str(trainer.id),
                created_by_name=trainer.name,
                goal="MuscleGain",
                total_calories=1900,
                meals=meals,
                notes="Drink 4L water daily",
                gym_id=member.gym_id,
                branch_id=member.branch_id
            ).save()
            diets_created += 1

    return diets_created
