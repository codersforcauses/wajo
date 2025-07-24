from rest_framework.routers import DefaultRouter
from .views import (
    QuizViewSet,
    QuizSlotViewSet,
    QuizAttemptViewSet,
    QuestionAttemptViewSet,
    AdminQuizViewSet,
    CompetitionQuizViewSet,
)

router = DefaultRouter()
router.register(r"admin-quizzes", AdminQuizViewSet, basename="")  # all quizzes
router.register(r"all-quizzes", QuizViewSet)     # all visible quizzes
router.register(r"competition", CompetitionQuizViewSet, basename="competition")
router.register(r"quiz-slots", QuizSlotViewSet)
router.register(r"quiz-attempts", QuizAttemptViewSet)
router.register(r"question-attempts", QuestionAttemptViewSet)

urlpatterns = router.urls
