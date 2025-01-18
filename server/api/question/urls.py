
from django.urls import path
from .views import CategoryView, QuestionView, QuestionCategoryView


urlpatterns = [
    path("all/", QuestionView.as_view(), name="question"),
    path("<int:id>/", QuestionView.as_view(), name="question-id"),
    path("bycategory/<int:id>", QuestionCategoryView.as_view(), name="question-category"),

    path("categories/", CategoryView.as_view(), name="category"),
    path("categories/<int:id>", CategoryView.as_view(), name="category-id"),
]
