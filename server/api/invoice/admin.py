from django.contrib import admin
from unfold.admin import ModelAdmin
from import_export.admin import ImportExportModelAdmin

# Register your models here.
from .models import Invoice


admin.site.register(Invoice)


class invoiceAdmin(ModelAdmin, ImportExportModelAdmin):
    list_display = ("id", "school_name", "cost")
