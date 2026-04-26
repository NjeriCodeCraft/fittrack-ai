from django.urls import path
from .views import RecommendationView, RecommendationHistoryView

urlpatterns = [
    path('', RecommendationView.as_view(), name='recommendations'),
    path('history/', RecommendationHistoryView.as_view(), name='rec-history'),
]