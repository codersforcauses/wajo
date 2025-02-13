from .views import StudentViewSet, TeacherViewSet, SchoolViewSet, AdminUserViewSet
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register(r'students', StudentViewSet, basename='students')
router.register(r'teachers', TeacherViewSet, basename='teachers')
router.register(r'schools', SchoolViewSet, basename='schools')
router.register(r'staffs', AdminUserViewSet, basename='staffs')
# router.register(r'users', UserViewSet, basename='users') # no need to be used

urlpatterns = router.urls
