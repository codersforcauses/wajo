from django.contrib import admin
from .models import Question, Category, Answer


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ('id',  'genre')
    list_filter = ('id', 'genre')


@admin.register(Question)
class QuestionAdmin(admin.ModelAdmin):
    list_display = ('name', 'question_text')
    list_filter = ('id', 'mark', 'created_by', 'modified_by')
    search_fields = ('id',)


@admin.register(Answer)
class AnswerAdmin(admin.ModelAdmin):
    list_display = ("id", "question_id", "answer")
    list_filter = ("id", "question_id", "answer")
    search_fields = ("question_id",)
