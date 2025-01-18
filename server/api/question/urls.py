from django.urls import path
from api.question import views


app_name = "question"
urlpatterns = [
    path("get/", views.question_list, name="question-list"),
]
