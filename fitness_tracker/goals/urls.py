from django.urls import path
from .views import GoalListCreateView, GoalUpdateDeleteView

urlpatterns = [
    path('', GoalListCreateView.as_view(), name='goal-list'),
    path('<int:pk>/', GoalUpdateDeleteView.as_view(), name='goal-detail'),
]