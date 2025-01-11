
from django.urls import path
from .views import CategoryView, QuestionView, AnswerView
from api.question import views


app_name = "question"
urlpatterns = [
    ##path("get/", views.question_list, name="question-list"),
    ##path("create/", views.create_question, name="create-question"),
    ##path("answer/create/", views.create_answer, name="create-answer"),
    path("questions/", QuestionView.as_view(), name="question"),
    path("questions/<int:id>/", QuestionView.as_view(), name="question-id"),

    path("answers/", AnswerView.as_view(), name="answer"),
    path("answers/<int:id>/", AnswerView.as_view(), name="answer-id"),

    path("categories/", CategoryView.as_view(), name="category"),
    path("categories/<int:id>", CategoryView.as_view(), name="category-id"),
    
    ]
