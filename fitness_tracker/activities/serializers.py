from rest_framework import serializers
from .models import ActivityLog

MET_VALUES = {
    'running': 9.8, 'walking': 3.5, 'cycling': 7.5,
    'swimming': 7.0, 'weightlifting': 5.0,
    'yoga': 3.0, 'hiit': 10.0, 'other': 5.0
}

class ActivityLogSerializer(serializers.ModelSerializer):
    class Meta:
        model = ActivityLog
        fields = '__all__'
        read_only_fields = ['user', 'calories_burned']

    def create(self, validated_data):
        user = self.context['request'].user
        weight = user.weight or 70
        exercise = validated_data['exercise_type']
        duration = validated_data['duration']
        met = MET_VALUES.get(exercise, 5.0)
        calories = (met * weight * duration) / 60
        validated_data['user'] = user
        validated_data['calories_burned'] = round(calories, 2)
        return super().create(validated_data)