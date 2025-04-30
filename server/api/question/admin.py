from django.contrib import admin
from unfold.admin import ModelAdmin
from .models import Question, Category, Answer, Image
from import_export.admin import ImportExportModelAdmin


@admin.register(Image)
class ImageAdmin(ModelAdmin, ImportExportModelAdmin):
    list_display = ("id", "url")


@admin.register(Category)
class CategoryAdmin(ModelAdmin, ImportExportModelAdmin):
    list_display = ("id", "genre")
    list_filter = ("id", "genre")


@admin.register(Question)
class QuestionAdmin(ModelAdmin, ImportExportModelAdmin):
    list_display = ("name", "question_text")
    list_filter = ("id", "mark", "created_by", "modified_by")
    search_fields = ("id",)


@admin.register(Answer)
class AnswerAdmin(ModelAdmin, ImportExportModelAdmin):
    list_display = ("id", "question", "value")
