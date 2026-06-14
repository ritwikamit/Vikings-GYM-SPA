"""Seed data for Workouts."""
import random
from datetime import datetime, timedelta
from app.models.member import Member
from app.models.trainer import Trainer
from app.models.workout import Workout

CATEGORIES = ["Weight Loss", "Muscle Gain", "Fat Loss", "Strength", "Beginner", "Advanced"]

def seed_workouts():
    """Seed workout plans for members."""
    print("Seeding workout plans...")
    workouts_created = 0
    
    members = list(Member.objects())
    trainers = list(Trainer.objects())
    
    if not members or not trainers:
        return 0

    for member in members:
        # Give 50% of members a workout plan
        if random.random() < 0.5:
            trainer = random.choice(trainers)
            start_date = datetime.now() - timedelta(days=random.randint(0, 30))
            end_date = start_date + timedelta(days=30)
            
            exercises = []
            for day in ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]:
                exercises.append({
                    "day": day,
                    "name": random.choice(["Bench Press", "Squats", "Deadlift", "Pull-ups", "Push-ups", "Bicep Curls", "Tricep Dips", "Lunges", "Plank", "Leg Press"]),
                    "sets": random.randint(3, 5),
                    "reps": str(random.randint(8, 15)),
                    "notes": "Keep form strict"
                })

            Workout(
                title=f"{random.choice(CATEGORIES)} Program",
                assigned_to=str(member.id),
                assigned_to_name=member.name,
                created_by=str(trainer.id),
                created_by_name=trainer.name,
                category=random.choice(CATEGORIES),
                exercises=exercises,
                start_from=start_date.strftime("%Y-%m-%d"),
                end_at=end_date.strftime("%Y-%m-%d"),
                gym_id=member.gym_id,
                branch_id=member.branch_id
            ).save()
            workouts_created += 1

    return workouts_created
