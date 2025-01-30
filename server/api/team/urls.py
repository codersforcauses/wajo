from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import TeamViewSet, TeamMemberViewSet, TeamStudentListView


router = DefaultRouter()
router.register(r'teams', TeamViewSet, basename='team')
router.register(r'team-members', TeamMemberViewSet, basename='team-member')

urlpatterns = [
    path("", include(router.urls)),
    # to view the team list in the frontend
    path("students/", TeamStudentListView.as_view(), name="team-students"),
]
