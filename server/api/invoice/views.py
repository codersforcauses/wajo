from rest_framework.permissions import IsAdminUser
from rest_framework import viewsets
from .serializers import invoiceSerializer
from .models import Invoice
from rest_framework.decorators import permission_classes

from django.http import FileResponse
from datetime import datetime
from .utils.docx_generator import generate_invoice_docx


@permission_classes([IsAdminUser])
class AdminInvoice(viewsets.ModelViewSet):
    """
    A viewset for managing invoices by admin users.

    Methods:
    - retrieve the invoice for a specific school

    """

    queryset = Invoice.objects.all()
    serializer_class = invoiceSerializer


class InvoiceDocxViewSet(viewsets.ViewSet):
    """
    A viewset that only allows GET requests to generate and download a sample invoice.
    """

    def list(self, request):
        """
        Return a sample invoice with placeholder values (GET /public-invoice-template/)
        """
        context_text = {
            "year": str(datetime.now().year),
            "date": datetime.now().strftime("%-d %B %Y"),
            "school_name": "SCHOOL NAME",
            "school_address": "SCHOOL ADDRESS 1\nADDRESS 2\nADDRESS 3",
            "total_fees": 100,
            "total_count": 10,
            "account_name": "BANK ACCOUNT NAME",
            "bsb": "000-000",
            "account_number": "000000000",
        }
        context_table = {
            "department": "c/- Department of Mathematics and Statistics (M019)",
            "address": "The University of Western Australia\n 35 Stirling Highway, Crawley WA 6009",
            "email": "EMAIL ADDRESS",
            "website": "WAJO WEBSITE",
            "chair_name": "THE CHAIR NAME",
            "chair_title": "THE CHAIR TITLE",
        }
        context_image = {
            "signature": (
                "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAALCAYAAABlNU3NAAAAAXNSR0IArs4c6"
                "QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAAFiUAABYlAUlSJPAAAAGHaVRYdFhNTDpjb20uYWRvYmUueG1wA"
                "AAAAAA8P3hwYWNrZXQgYmVnaW49J++7vycgaWQ9J1c1TTBNcENlaGlIenJlU3pOVGN6a2M5ZCc/Pg0KPHg6eG"
                "1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyI+PHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3Lncz"
                "Lm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj48cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0idXVpZD"
                "pmYWY1YmRkNS1iYTNkLTExZGEtYWQzMS1kMzNkNzUxODJmMWIiIHhtbG5zOnRpZmY9Imh0dHA6Ly9ucy5hZG9i"
                "ZS5jb20vdGlmZi8xLjAvIj48dGlmZjpPcmllbnRhdGlvbj4xPC90aWZmOk9yaWVudGF0aW9uPjwvcmRmOkRlc2"
                "NyaXB0aW9uPjwvcmRmOlJERj48L3g6eG1wbWV0YT4NCjw/eHBhY2tldCBlbmQ9J3cnPz4slJgLAAAAcklEQVQ4"
                "T82SQQ6AMAgEWf//5/EiDW5KrYkH56SUZWhUAJICiLfs5A4vfM0/BJK81OK9j4IMeNCRNO1ZCjIABDCG+CDvqy"
                "wFcYVmz4nLnJug29Bxab7PckPQXbNKtfjvu7roTjaowrp9Hfn4DXbJm/u+J5AWRBxdLUmcAAAAAElFTkSuQmCC"),
        }
        buffer = generate_invoice_docx(context_text, context_table, context_image)

        return FileResponse(
            buffer,
            as_attachment=True,
            filename=f"{context_text['school_name']} Invoice.docx",
            content_type="application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        )
