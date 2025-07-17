from rest_framework.routers import DefaultRouter
from .views import AdminInvoice, InvoiceDocxViewSet

router = DefaultRouter()
router.register(r"invoice", AdminInvoice)
router.register(r"invoice_docx", InvoiceDocxViewSet, basename="invoice_docx")

urlpatterns = router.urls
