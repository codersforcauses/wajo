
from django.urls import path
from .views import CategoryView, QuestionView, AnswerView


app_name = "question"
urlpatterns = [
    path("questions/", QuestionView.as_view(), name="question"),
    path("questions/<int:id>/", QuestionView.as_view(), name="question-id"),

    path("answers/", AnswerView.as_view(), name="answer"),
    path("answers/<int:id>/", AnswerView.as_view(), name="answer-id"),

    path("categories/", CategoryView.as_view(), name="category"),
    path("categories/<int:id>", CategoryView.as_view(), name="category-id"),

    ]
