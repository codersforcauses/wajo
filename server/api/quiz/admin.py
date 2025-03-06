from django.contrib import admin

# Register your models here.
from .models import QuizAttempt, Quiz, QuizSlot


@admin.register(Quiz)
class QuizAdmin(admin.ModelAdmin):
    list_display = ("name", "intro")


@admin.register(QuizSlot)
class QuizSlotsAdmin(admin.ModelAdmin):
    list_display = ("id", "quiz_id")


@admin.register(QuizAttempt)
class QuizAttemptAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "quiz_id",
    )
