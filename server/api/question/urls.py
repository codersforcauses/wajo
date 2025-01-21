# from django.urls import path
from rest_framework.routers import DefaultRouter
from .views import QuestionViewSet, CategoryViewSet

router = DefaultRouter()
router.register(r'question-bank', QuestionViewSet, basename='question-bank')
router.register(r'categories', CategoryViewSet, basename='categories')

urlpatterns = router.urls
