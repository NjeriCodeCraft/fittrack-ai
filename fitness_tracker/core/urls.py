from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/users/', include('users.urls')),
    path('api/activities/', include('activities.urls')),
    path('api/nutrition/', include('nutrition.urls')),
    path('api/bmi/', include('bmi.urls')),
    path('api/goals/', include('goals.urls')),
    path('api/recommendations/', include('recommendations.urls')),
    path('api/reports/', include('reports.urls')),
]