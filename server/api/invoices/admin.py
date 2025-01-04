from django.contrib import admin

# Register your models here.
from .models import Invoice


class InvoiceAdmin(admin.ModelAdmin):
    list_display = ("invoice_id", "amount")


admin.site.register(Invoice, InvoiceAdmin)
