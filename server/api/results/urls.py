"""
URL Configuration for the Results module.

This file defines routes for the Results feature, including:
- A route for the `ResultsView`, allowing interaction with the Results data.

Routes:
    - "results/": Endpoint for Results operations.

Note: The `DefaultRouter` is included for potential future API extensions.
"""

from django.urls import include, path
from .views import IndividualResultsViewSet, TeamResultsViewSet, InsightsViewSet
from rest_framework.routers import SimpleRouter

app_name = "results"

router = SimpleRouter()
router.register(
    "results/individual", IndividualResultsViewSet, basename="individual"
)
router.register("results/team", TeamResultsViewSet, basename="team")
router.register("results/insight", InsightsViewSet, basename="insight")

urlpatterns = [
    path("", include(router.urls), name="results"),
]
