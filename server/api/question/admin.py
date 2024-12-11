from django.contrib import admin
from .models import Question, Category


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ('category_id', 'category_name', 'description')
    search_fields = ('category_name',)


@admin.register(Question)
class QuestionAdmin(admin.ModelAdmin):
    list_display = ('question_id', 'year', 'year_level', 'mark')
    list_filter = ('year', 'year_level', 'category_id')
    search_fields = ('question_id',)
