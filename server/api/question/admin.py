from django.contrib import admin
from .models import Question, Category, Answer, Image


@admin.register(Image)
class ImageAdmin(admin.ModelAdmin):
    list_display = ("id", "url")


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ("id", "genre")
    list_filter = ("id", "genre")


@admin.register(Question)
class QuestionAdmin(admin.ModelAdmin):
    list_display = ("name", "question_text")
    list_filter = ("id", "mark", "created_by", "modified_by")
    search_fields = ("id",)


@admin.register(Answer)
class AnswerAdmin(admin.ModelAdmin):
    list_display = ("id", "question", "value")
