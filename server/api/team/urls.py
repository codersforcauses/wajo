from rest_framework.routers import DefaultRouter
from .views import TeamViewSet, TeamMemberViewSet


router = DefaultRouter()
router.register(r'teams', TeamViewSet, basename='team')
router.register(r'team-members', TeamMemberViewSet, basename='team-member')

urlpatterns = router.urls
