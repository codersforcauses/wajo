from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import TeamMemberViewSet, TeamViewSet
from . import views

router = DefaultRouter()
router.register(r'', TeamViewSet)
router.register(r'member', TeamMemberViewSet)

urlpatterns = [
    # Handles all basic CRUD for teams and team members
    path('', include(router.urls)),

    # For specific team details
    path('<int:pk>/', views.team_detail, name='team-detail'),
    #     path('member/', views.member_list, name='member-list'),
    path('member/<int:pk>/', views.team_member_detail,
         name='team-member-detail'),  # For specific team member details
]
