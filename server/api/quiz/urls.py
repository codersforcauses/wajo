from rest_framework.routers import DefaultRouter
from .views import QuizViewSet, QuizSlotViewSet, QuizAttemptViewSet, QuestionAttemptViewSet

router = DefaultRouter()
router.register(r'quizzes', QuizViewSet)
router.register(r'quiz-slots', QuizSlotViewSet)
router.register(r'quiz-attempts', QuizAttemptViewSet)
router.register(r'question-attempts', QuestionAttemptViewSet)

urlpatterns = router.urls
