from django.contrib import admin
from unfold.admin import ModelAdmin
from import_export.admin import ImportExportModelAdmin
# Register your models here.
from .models import QuizAttempt, Quiz, QuizSlot, QuestionAttempt


@admin.register(Quiz)
class QuizAdmin(ModelAdmin, ImportExportModelAdmin):
    list_display = ("name", "intro")


@admin.register(QuizSlot)
class QuizSlotsAdmin(ModelAdmin, ImportExportModelAdmin):
    list_display = ("id", "quiz_id", "quiz_question_id", "slot_index", "question_id")


@admin.register(QuizAttempt)
class QuizAttemptAdmin(ModelAdmin, ImportExportModelAdmin):
    list_display = (
        "id",
        "quiz_id",
        "student",
        "team",
        "state",
        "time_start",
        "time_finish",
        "total_marks"
    )


@admin.register(QuestionAttempt)
class QuestionAttemptAdmin(ModelAdmin, ImportExportModelAdmin):
    list_display = (
        "id",
        "quiz_attempt_id",
        "question_id",
    )
