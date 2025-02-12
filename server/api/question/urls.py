# from django.urls import path
from rest_framework.routers import DefaultRouter
from .views import QuestionViewSet, CategoryViewSet, ImageViewSet

router = DefaultRouter()
router.register(r'question-bank', QuestionViewSet, basename='question-bank')
router.register(r'categories', CategoryViewSet, basename='categories')
router.register(r'images', ImageViewSet, basename='image')
# router.register(r'answers', AnswerViewSet, basename='answers')

urlpatterns = router.urls
