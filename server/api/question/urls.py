
from django.urls import path
from .views import CategoryView, QuestionView


urlpatterns = [
    path("questions/", QuestionView.as_view(), name="question"),
    path("questions/<int:id>/", QuestionView.as_view(), name="question-id"),

    path("categories/", CategoryView.as_view(), name="category"),
    path("categories/<int:id>", CategoryView.as_view(), name="category-id"),
]
