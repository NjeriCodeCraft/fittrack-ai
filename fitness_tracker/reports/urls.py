from django.urls import path
from .views import DownloadReportView

urlpatterns = [
    path('download/', DownloadReportView.as_view(), name='download-report'),
]