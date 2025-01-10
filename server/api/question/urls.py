
from django.urls import path
from api.question import views


app_name = "question"
urlpatterns = [
    path("get/", views.question_list, name="question-list"),
    path("create/", views.create_question, name="create-question"),
    path("answer/create/", views.create_answer, name="create-answer"),
]
