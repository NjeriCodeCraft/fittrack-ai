from django.urls import path
from .views import ActivityListCreateView, ActivityDeleteView

urlpatterns = [
    path('', ActivityListCreateView.as_view(), name='activity-list'),
    path('<int:pk>/', ActivityDeleteView.as_view(), name='activity-delete'),
]