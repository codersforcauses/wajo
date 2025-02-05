from django.contrib import admin

# Register your models here.
from .models import Invoice


admin.site.register(Invoice)


class invoiceAdmin(admin.ModelAdmin):
    list_display = ("id", "school_name", "cost")
