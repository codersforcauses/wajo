from .views import StudentViewSet
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register(r'students', StudentViewSet, basename='students')
urlpatterns = router.urls
