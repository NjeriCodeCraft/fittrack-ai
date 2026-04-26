from django.urls import path
from .views import BMICalculateView, BMIHistoryView

urlpatterns = [
    path('calculate/', BMICalculateView.as_view(), name='bmi-calculate'),
    path('history/', BMIHistoryView.as_view(), name='bmi-history'),
]