from django.contrib import admin
from .models import ExtendedUser


@admin.register(ExtendedUser)
class ExtendedUserAdmin(admin.ModelAdmin):
    list_display = ('user', 'role',
                    'created_at', 'updated_at')
    readonly_fields = ('created_at', 'updated_at')
