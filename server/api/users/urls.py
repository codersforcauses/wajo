from .views import StudentViewSet, TeacherViewSet, SchoolViewSet, AdminUserViewSet, UserProfileView
from rest_framework.routers import DefaultRouter
from django.urls import path, include

router = DefaultRouter()
router.register(r"students", StudentViewSet, basename="students")
router.register(r"teachers", TeacherViewSet, basename="teachers")
router.register(r"schools", SchoolViewSet, basename="schools")
router.register(r"staffs", AdminUserViewSet, basename="staffs")
# router.register(r"profiles", UserProfileView, basename="profiles")

# router.register(r'users', UserViewSet, basename='users') # no need to be used

urlpatterns = [
    path("", include(router.urls)),
    path('profile/', UserProfileView.as_view(), name='user-profile'),  # Add the UserProfileView directly
]
