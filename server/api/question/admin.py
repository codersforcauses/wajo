from django.contrib import admin
from unfold.admin import ModelAdmin
from .models import Question, Category, Answer, Image


@admin.register(Image)
class ImageAdmin(ModelAdmin):
    list_display = ("id", "url")


@admin.register(Category)
class CategoryAdmin(ModelAdmin):
    list_display = ("id", "genre")
    list_filter = ("id", "genre")


@admin.register(Question)
class QuestionAdmin(ModelAdmin):
    list_display = ("name", "question_text")
    list_filter = ("id", "mark", "created_by", "modified_by")
    search_fields = ("id",)


@admin.register(Answer)
class AnswerAdmin(ModelAdmin):
    list_display = ("id", "question", "value")
