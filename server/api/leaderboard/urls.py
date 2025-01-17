"""
URL Configuration for the leaderboard module.

This file defines routes for the leaderboard feature, including:
- A route for the `LeaderboardView`, allowing interaction with the leaderboard data.

Routes:
    - "leaderboard/": Endpoint for leaderboard operations.

Note: The `DefaultRouter` is included for potential future API extensions.
"""

from django.urls import include, path
from .views import IndividualLeaderboardViewSet
from rest_framework.routers import SimpleRouter

app_name = "leaderboard"

router = SimpleRouter()
router.register("leaderboard/individual", IndividualLeaderboardViewSet, basename="individual")
router.register("leaderboard/team", IndividualLeaderboardViewSet, basename="team")

urlpatterns = [
    path("", include(router.urls), name="leaderboard"),
]