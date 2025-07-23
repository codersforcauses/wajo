from rest_framework.permissions import IsAdminUser
from rest_framework import viewsets

from api.permissions import IsTeacher, IsAdmin
from api.setting.models import Setting
from api.users.models import School
from .serializers import invoiceSerializer
from .models import Invoice
from rest_framework.decorators import permission_classes

from django.http import FileResponse
from .utils.docx_generator import InvoiceDocxGenerator
from rest_framework.response import Response
from rest_framework import status


@permission_classes([IsAdminUser])
class AdminInvoice(viewsets.ModelViewSet):
    """
    A viewset for managing invoices by admin users.

    Methods:
    - retrieve the invoice for a specific school

    """

    queryset = Invoice.objects.all()
    serializer_class = invoiceSerializer


@permission_classes([IsTeacher | IsAdmin | IsAdminUser])
class InvoiceDocxViewSet(viewsets.ViewSet):
    """
    A viewset that only allows GET requests to generate and download a sample invoice.
    """

    def list(self, request):
        """
        Return a sample invoice with placeholder values (GET /public-invoice-template/)
        """
        school_id = request.query_params.get("school_id")
        user = self.request.user
        school = None

        if hasattr(user, "teacher"):
            school = School.objects.filter(id=user.teacher.school_id).first()
            if not school:
                return Response({"error": "School not found."}, status=status.HTTP_404_NOT_FOUND)
        else:
            school = School.objects.filter(id=school_id).first()

        # Get settings and generate invoice
        setting = Setting.objects.filter(key="invoice").first()
        if not setting:
            return Response({"error": "Setting not found."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        generator = InvoiceDocxGenerator(setting.get_value(), school)
        buffer = generator.generate_invoice_docx()

        return FileResponse(
            buffer,
            as_attachment=True,
            filename=f"{generator.school_name} Invoice.docx",
            content_type="application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        )
