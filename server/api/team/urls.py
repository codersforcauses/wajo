from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import TeamViewSet
from . import views

# app_name = "team"
router = DefaultRouter()
router.register(r'', TeamViewSet)
# router.register(r'member', TeamMemberViewSet)

urlpatterns = [
    path('member/', views.member_list, name='member-list'),

    path('', include(router.urls)),

    # For specific team details
    path('<int:pk>/', views.team_detail, name='team-detail'),
    path('member/<int:pk>/', views.team_member_detail,
         name='team-member-detail'),  # For specific team member details
]
