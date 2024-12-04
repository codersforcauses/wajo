"""
URL Configuration for the manager module.

This file defines routes for the leaderboard feature, including:
- A route for the `LeaderboardView`, allowing interaction with the leaderboard data.

Routes:
    - "leaderboard/": Endpoint for leaderboard operations.

Note: The `DefaultRouter` is included for potential future API extensions.
"""

from .views import LeaderboardView
from rest_framework.routers import DefaultRouter
from django.urls import path, include


router = DefaultRouter()

app_name = "manager"

urlpatterns = [
    path("", include(router.urls)),
    path("leaderboard/", LeaderboardView.as_view(), name="leaderboard"),
]
