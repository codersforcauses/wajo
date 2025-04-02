from django.contrib import admin
from unfold.admin import ModelAdmin

# Register your models here.
from .models import Invoice


admin.site.register(Invoice)


class invoiceAdmin(ModelAdmin):
    list_display = ("id", "school_name", "cost")
