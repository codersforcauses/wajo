from unfold.admin import ModelAdmin, StackedInline
from .models import School, Student, Teacher
from django.contrib import admin
from django.contrib.auth.models import User
from import_export.admin import ImportExportModelAdmin


class StudentInline(StackedInline):
    ordering = ('created_at',)
    model = Student
    extra = 0


class TeacherInline(StackedInline):
    ordering = ('created_at',)
    model = Teacher
    extra = 0


@admin.register(School)
class SchoolAdmin(ModelAdmin, ImportExportModelAdmin):
    list_display = ("id", "name", "code", "type", "abbreviation", "is_country")
    search_fields = ("name", "code", "type", "abbreviation", "is_country")
    ordering = ("id",)


@admin.register(Student)
class StudentAdmin(ModelAdmin, ImportExportModelAdmin):
    list_display = ('user', 'school',
                    'year_level', 'created_at')
    list_filter = ('school', 'year_level')
    search_fields = ('user__username', 'school__name', 'year_level')
    ordering = ('created_at',)
    readonly_fields = ('created_at',)


@admin.register(Teacher)
class TeacherAdmin(ModelAdmin, ImportExportModelAdmin):
    list_display = ("user", "school", "phone")
    list_filter = ("school",)
    search_fields = ("user__username", "school__name", "phone")
    ordering = ("user",)


class CustomUserAdmin(ModelAdmin, ImportExportModelAdmin):
    inlines = [StudentInline, TeacherInline]
    ordering = ('date_joined',)
    list_display = ('username', 'email', 'is_staff',
                    'is_active', 'date_joined')

    def save_model(self, request, obj, form, change):
        if form.cleaned_data["password"]:
            obj.set_password(form.cleaned_data["password"])
        super().save_model(request, obj, form, change)


admin.site.unregister(User)
admin.site.register(User, CustomUserAdmin)
