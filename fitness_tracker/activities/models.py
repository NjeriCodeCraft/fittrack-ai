from django.db import models
from django.conf import settings

class ActivityLog(models.Model):
    EXERCISE_TYPES = [
        ('running', 'Running'),
        ('walking', 'Walking'),
        ('cycling', 'Cycling'),
        ('swimming', 'Swimming'),
        ('weightlifting', 'Weightlifting'),
        ('yoga', 'Yoga'),
        ('hiit', 'HIIT'),
        ('other', 'Other'),
    ]
    INTENSITY_LEVELS = [
        ('low', 'Low'),
        ('moderate', 'Moderate'),
        ('high', 'High'),
    ]

    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='activities')
    exercise_type = models.CharField(max_length=50, choices=EXERCISE_TYPES)
    duration = models.IntegerField(help_text="Duration in minutes")
    intensity = models.CharField(max_length=20, choices=INTENSITY_LEVELS)
    calories_burned = models.FloatField(null=True, blank=True)
    date = models.DateField()
    notes = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username} - {self.exercise_type} on {self.date}"