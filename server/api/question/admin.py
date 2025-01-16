from django.contrib import admin
from .models import Question, Category


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ('id', 'diff_level', 'name', 'is_comp')
    list_filter = ('id', 'diff_level', 'name', 'is_comp')


@admin.register(Question)
class QuestionAdmin(admin.ModelAdmin):
    list_display = ('name', 'question_text')
    list_filter = ('id', 'default_mark', 'parent', 'category_id')
    search_fields = ('id',)
