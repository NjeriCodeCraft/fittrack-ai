from django.db import models
from django.conf import settings

class NutritionLog(models.Model):
    MEAL_TYPES = [
        ('breakfast', 'Breakfast'),
        ('lunch', 'Lunch'),
        ('dinner', 'Dinner'),
        ('snack', 'Snack'),
    ]

    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='nutrition_logs')
    food_item = models.CharField(max_length=200)
    meal_type = models.CharField(max_length=20, choices=MEAL_TYPES)
    calories = models.FloatField()
    protein = models.FloatField(default=0)
    carbohydrates = models.FloatField(default=0)
    fats = models.FloatField(default=0)
    date = models.DateField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username} - {self.food_item} ({self.meal_type})"