from rest_framework.routers import DefaultRouter
from .views import AdminInvoice

router = DefaultRouter()
router.register(r'invoice', AdminInvoice)

urlpatterns = router.urls
