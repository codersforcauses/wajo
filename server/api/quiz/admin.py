from django.contrib import admin

# Register your models here.
from .models import QuizAttempt, QuizAttemptUser, Quiz, QuizSlot


class QuizAdmin(admin.ModelAdmin):
    list_display = ("name",)


class QuizSlotsAdmin(admin.ModelAdmin):
    list_display = ("id", "quiz_id", "status")


class QuizAttemptAdmin(admin.ModelAdmin):
    list_display = ("id", "quiz_id", "attempt")


class QuizAttemptUserAdmin(admin.ModelAdmin):
    list_display = ("id", "quiz_attempt", "student_id")


admin.site.register(Quiz, QuizAdmin)
admin.site.register(QuizSlot, QuizSlotsAdmin)

admin.site.register(QuizAttempt, QuizAttemptAdmin)
admin.site.register(QuizAttemptUser, QuizAttemptUserAdmin)
