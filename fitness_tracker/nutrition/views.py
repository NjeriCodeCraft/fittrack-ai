from rest_framework import generics, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from django.db.models import Sum
from datetime import date
from .models import NutritionLog
from .serializers import NutritionLogSerializer

class NutritionListCreateView(generics.ListCreateAPIView):
    serializer_class = NutritionLogSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return NutritionLog.objects.filter(
            user=self.request.user).order_by('-date')

class NutritionDeleteView(generics.DestroyAPIView):
    serializer_class = NutritionLogSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return NutritionLog.objects.filter(user=self.request.user)

class DailyNutritionSummaryView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        today = date.today()
        logs = NutritionLog.objects.filter(user=request.user, date=today)
        totals = logs.aggregate(
            total_calories=Sum('calories'),
            total_protein=Sum('protein'),
            total_carbs=Sum('carbohydrates'),
            total_fats=Sum('fats'),
        )
        return Response({
            'date': today,
            'total_calories': totals['total_calories'] or 0,
            'total_protein': totals['total_protein'] or 0,
            'total_carbs': totals['total_carbs'] or 0,
            'total_fats': totals['total_fats'] or 0,
            'logs': NutritionLogSerializer(logs, many=True).data
        })