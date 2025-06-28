from django.contrib import admin
from unfold.admin import ModelAdmin

# Register your models here.
from .models import Setting


admin.site.register(Setting)


class SettingAdmin(ModelAdmin):
    """
    Admin interface customization for the Setting model.

    Displays the ID, key, and a shortened value in the admin list view.
    """
    list_display = ('id', 'key', 'short_value')
    search_fields = ('key',)

    def short_value(self, obj: Setting):
        """
        Returns a short preview of the setting value.

        Args:
            obj (Setting): The setting object.

        Returns:
            str: Truncated string of the value.
        """
        return str(obj.get_value())[:50]
