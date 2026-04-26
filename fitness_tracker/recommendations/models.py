from django.db import models
from django.conf import settings

class Recommendation(models.Model):
    REC_TYPES = [
        ('workout', 'Workout'),
        ('nutrition', 'Nutrition'),
    ]

    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='recommendations')
    rec_type = models.CharField(max_length=20, choices=REC_TYPES)
    recommendation_text = models.TextField()
    activity_level = models.CharField(max_length=30, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username} - {self.rec_type} recommendation"