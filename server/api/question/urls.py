
from django.urls import path
from api.question import views


urlpatterns = [
    path("", views.question_list, name="question-list"),
]
