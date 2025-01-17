from django.urls import path
from rest_framework.urlpatterns import format_suffix_patterns
from api.quiz import views

urlpatterns = [
    path('quizList/', views.QuizListView.as_view())
]

urlpatterns = format_suffix_patterns(urlpatterns)
