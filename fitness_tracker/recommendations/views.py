from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import permissions
from .models import Recommendation
from .serializers import RecommendationSerializer
import joblib
import os
import numpy as np

# Load the trained model once when server starts
MODEL_PATH = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'ai_module', 'fitness_model.pkl')
model = joblib.load(MODEL_PATH)

WORKOUT_RECOMMENDATIONS = {
    'sedentary': {
        'text': 'You are currently sedentary. Start with 20-minute walks 3x per week, light stretching daily, and gentle yoga sessions. Focus on building a consistent habit before increasing intensity.',
        'workouts': ['20-min morning walk', 'Basic stretching (10 mins)', 'Beginner yoga', 'Light cycling']
    },
    'lightly_active': {
        'text': 'You are lightly active. Increase to 30-minute moderate cardio sessions 4x per week. Add bodyweight exercises like squats and push-ups 3x per week to build strength.',
        'workouts': ['30-min brisk walk/jog', 'Bodyweight squats (3x15)', 'Push-ups (3x10)', 'Cycling 30 mins']
    },
    'moderately_active': {
        'text': 'You are moderately active — great work! Push further with 45-minute cardio or HIIT sessions 4-5x per week. Incorporate weight training 3x per week for muscle development.',
        'workouts': ['45-min run', 'HIIT (30 mins)', 'Weight training (upper/lower split)', 'Swimming laps']
    },
    'highly_active': {
        'text': 'You are highly active — excellent! Focus on performance goals. Train 5-6x per week with a mix of strength, cardio, and HIIT. Prioritize recovery with rest days and stretching.',
        'workouts': ['60-min run or cycling', 'Heavy weight training', '45-min HIIT', 'Sport-specific drills']
    },
}

def get_nutrition_feedback(user):
    weight = user.weight or 70
    height = user.height or 170
    age = user.age or 25
    gender = user.gender or 'other'

    # Calculate BMR using Mifflin-St Jeor
    if gender == 'male':
        bmr = (10 * weight) + (6.25 * height) - (5 * age) + 5
    else:
        bmr = (10 * weight) + (6.25 * height) - (5 * age) - 161

    tdee = bmr * 1.55  # Moderate activity multiplier

    goal = user.fitness_goal or 'maintain'
    if goal == 'lose_weight':
        target = tdee - 500
        advice = f'For weight loss, target {int(target)} calories/day (500 below your TDEE of {int(tdee)}).'
    elif goal == 'gain_muscle':
        target = tdee + 300
        advice = f'For muscle gain, target {int(target)} calories/day (300 above your TDEE of {int(tdee)}).'
    else:
        target = tdee
        advice = f'To maintain weight, target {int(target)} calories/day (your TDEE).'

    return advice, int(target)


class RecommendationView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        user = request.user

        # Get user features for AI model
        from bmi.models import BMIRecord
        from activities.models import ActivityLog
        from datetime import date, timedelta

        # Get latest BMI
        latest_bmi = BMIRecord.objects.filter(user=user).order_by('-date').first()
        bmi_value = latest_bmi.bmi_value if latest_bmi else 22.0

        # Get weekly activity stats
        week_ago = date.today() - timedelta(days=7)
        recent_activities = ActivityLog.objects.filter(user=user, date__gte=week_ago)
        weekly_count = recent_activities.count()
        avg_duration = recent_activities.values_list('duration', flat=True)
        avg_duration = sum(avg_duration) / len(avg_duration) if avg_duration else 30

        age = user.age or 25

        # Run AI prediction
        features = np.array([[age, bmi_value, weekly_count, avg_duration]])
        activity_level = model.predict(features)[0]

        # Get workout recommendation
        rec_data = WORKOUT_RECOMMENDATIONS[activity_level]

        # Get nutrition feedback
        nutrition_advice, calorie_target = get_nutrition_feedback(user)

        # Save recommendations to DB
        Recommendation.objects.create(
            user=user,
            rec_type='workout',
            recommendation_text=rec_data['text'],
            activity_level=activity_level
        )
        Recommendation.objects.create(
            user=user,
            rec_type='nutrition',
            recommendation_text=nutrition_advice,
            activity_level=activity_level
        )

        return Response({
            'activity_level': activity_level,
            'workout_recommendation': rec_data['text'],
            'suggested_workouts': rec_data['workouts'],
            'nutrition_advice': nutrition_advice,
            'daily_calorie_target': calorie_target,
        })


class RecommendationHistoryView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        recs = Recommendation.objects.filter(
            user=request.user).order_by('-created_at')[:10]
        return Response(RecommendationSerializer(recs, many=True).data)