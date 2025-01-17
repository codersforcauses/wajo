from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import SchoolViewSet, StudentViewSet, TeacherViewSet
from . import views

# Create a router and register our viewsets with it.
router = DefaultRouter()
router.register(r'school', SchoolViewSet)
router.register(r'student', StudentViewSet)
router.register(r'teacher', TeacherViewSet)

# The API URLs are now determined automatically by the router.
urlpatterns = [
    path('', include(router.urls)),
    path('<int:school_id>/', views.school_detail,
         name='school_detail'),
]
