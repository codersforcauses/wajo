from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import TeamMemberViewSet, TeamViewSet

router = DefaultRouter()
router.register(r'teams', TeamViewSet)
router.register(r'team-members', TeamMemberViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
