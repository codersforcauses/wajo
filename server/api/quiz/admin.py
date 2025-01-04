from django.contrib import admin

# Register your models here.
from .models import QuizAttempt
from .models import QuizAttemptUser


class QuizAttemptAdmin(admin.ModelAdmin):
    list_display = ("id", "quiz_id", "attempt")


class QuizAttemptUserAdmin(admin.ModelAdmin):
    list_display = ("id", "quiz_attempt", "student")


admin.site.register(QuizAttempt, QuizAttemptAdmin)
admin.site.register(QuizAttemptUser, QuizAttemptUserAdmin)
