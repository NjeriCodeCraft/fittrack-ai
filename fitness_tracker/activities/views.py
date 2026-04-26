from rest_framework import generics, permissions
from .models import ActivityLog
from .serializers import ActivityLogSerializer

class ActivityListCreateView(generics.ListCreateAPIView):
    serializer_class = ActivityLogSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return ActivityLog.objects.filter(
            user=self.request.user).order_by('-date')

class ActivityDeleteView(generics.DestroyAPIView):
    serializer_class = ActivityLogSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return ActivityLog.objects.filter(user=self.request.user)