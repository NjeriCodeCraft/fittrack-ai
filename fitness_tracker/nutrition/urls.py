from django.urls import path
from .views import NutritionListCreateView, NutritionDeleteView, DailyNutritionSummaryView

urlpatterns = [
    path('', NutritionListCreateView.as_view(), name='nutrition-list'),
    path('<int:pk>/', NutritionDeleteView.as_view(), name='nutrition-delete'),
    path('summary/', DailyNutritionSummaryView.as_view(), name='nutrition-summary'),
]