from rest_framework import serializers
from .models import BMIRecord

class BMIRecordSerializer(serializers.ModelSerializer):
    class Meta:
        model = BMIRecord
        fields = '__all__'
        read_only_fields = ['user', 'bmi_value', 'category']