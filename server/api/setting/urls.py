from rest_framework.routers import DefaultRouter
from .views import SettingViewSet

router = DefaultRouter()
router.register(r"config", SettingViewSet, basename="config")

urlpatterns = router.urls
