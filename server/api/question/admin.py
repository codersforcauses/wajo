from django.contrib import admin
from .models import Question, Category, Answer


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ("id", "diff_level", "name", "is_comp")
    list_filter = ("id", "diff_level", "name", "is_comp")


@admin.register(Question)
class QuestionAdmin(admin.ModelAdmin):
    list_display = ("name", "question_text")
    list_filter = ("id", "default_mark", "parent", "category_id")
    search_fields = ("id",)


@admin.register(Answer)
class AnswerAdmin(admin.ModelAdmin):
    list_display = ("id", "question_id", "answer")
    list_filter = ("id", "question_id", "answer")
    search_fields = ("question_id",)
