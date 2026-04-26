from django.db import models
from django.conf import settings

class BMIRecord(models.Model):
    BMI_CATEGORIES = [
        ('underweight', 'Underweight'),
        ('normal', 'Normal Weight'),
        ('overweight', 'Overweight'),
        ('obese', 'Obese'),
    ]

    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='bmi_records')
    weight = models.FloatField(help_text="Weight in kg")
    height = models.FloatField(help_text="Height in cm")
    bmi_value = models.FloatField()
    category = models.CharField(max_length=20, choices=BMI_CATEGORIES)
    date = models.DateField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username} - BMI: {self.bmi_value} ({self.category})"