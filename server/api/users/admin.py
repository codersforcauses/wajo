from .models import School, Student, Teacher
from django.contrib import admin
from django.contrib.auth.models import User


class StudentInline(admin.StackedInline):
    model = Student
    extra = 0


class TeacherInline(admin.StackedInline):
    model = Teacher
    extra = 0


@admin.register(School)
class SchoolAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'code')
    search_fields = ('name', 'code', 'type', 'is_country')
    ordering = ('id',)


@admin.register(Student)
class StudentAdmin(admin.ModelAdmin):
    list_display = ('user', 'school',
                    'year_level', 'created_at')
    list_filter = ('school', 'year_level')
    search_fields = ('user__username', 'school__name', 'year_level')
    ordering = ('created_at',)
    readonly_fields = ('created_at',)


@admin.register(Teacher)
class TeacherAdmin(admin.ModelAdmin):
    list_display = ('user', 'school', 'phone')
    list_filter = ('school',)
    search_fields = ('user__username', 'school__name', 'phone')
    ordering = ('user',)


class CustomUserAdmin(admin.ModelAdmin):
    inlines = [StudentInline, TeacherInline]

    def save_model(self, request, obj, form, change):
        if form.cleaned_data["password"]:
            obj.set_password(form.cleaned_data["password"])
        super().save_model(request, obj, form, change)


admin.site.unregister(User)
admin.site.register(User, CustomUserAdmin)
