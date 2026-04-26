from django.db import models
from django.conf import settings

class Goal(models.Model):
    GOAL_TYPES = [
        ('weight', 'Target Weight'),
        ('activity', 'Weekly Activity Frequency'),
        ('calories', 'Daily Calorie Target'),
    ]

    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='goals')
    goal_type = models.CharField(max_length=20, choices=GOAL_TYPES)
    target_value = models.FloatField()
    deadline = models.DateField(null=True, blank=True)
    achieved = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username} - {self.goal_type}: {self.target_value}"