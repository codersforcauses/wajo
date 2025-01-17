from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import TeamMemberViewSet, TeamViewSet
from . import views

router = DefaultRouter()
router.register(r'', TeamViewSet)
router.register(r'members', TeamMemberViewSet)

urlpatterns = [
    # Handles all basic CRUD for teams and team members
    path('', include(router.urls)),
    path('<int:team_id>/member/', views.team_members_by_team,
         name='team-members-by-team'),  # For members of a specific team
    # For specific team details
    path('<int:pk>/', views.team_detail, name='team-detail'),
    path('member/<int:pk>/', views.team_member_detail,
         name='team-member-detail'),  # For specific team member details
]
