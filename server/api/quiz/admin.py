from django.contrib import admin
from unfold.admin import ModelAdmin
# Register your models here.
from .models import QuizAttempt, Quiz, QuizSlot, QuestionAttempt


@admin.register(Quiz)
class QuizAdmin(ModelAdmin):
    list_display = ("name", "intro")


@admin.register(QuizSlot)
class QuizSlotsAdmin(ModelAdmin):
    list_display = ("id", "quiz_id")


@admin.register(QuizAttempt)
class QuizAttemptAdmin(ModelAdmin):
    list_display = (
        "id",
        "quiz_id",
    )


@admin.register(QuestionAttempt)
class QuestionAttemptAdmin(ModelAdmin):
    list_display = (
        "id",
        "quiz_attempt_id",
        "question_id",
    )
