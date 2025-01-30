from rest_framework.permissions import IsAdminUser
from rest_framework import viewsets
from .serializers import invoiceSerializer
from .models import Invoice
from rest_framework.decorators import permission_classes


@permission_classes([IsAdminUser])
class AdminInvoice(viewsets.ModelViewSet):
    """
    A viewset for managing invoices by admin users.

    Methods:
    - retrieve the invoice for a specific school

    """
    queryset = Invoice.objects.all()
    serializer_class = invoiceSerializer
