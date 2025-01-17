from rest_framework.decorators import api_view, action, permission_classes
from rest_framework.response import Response
from rest_framework import status, serializers, viewsets, filters
from rest_framework.permissions import AllowAny, IsAuthenticated
from django.contrib.auth.models import User
from .models import Student, Teacher, School
from .serializers import StudentSerializer
# from django_filters.rest_framework import DjangoFilterBackend
# from .serializers import ExtendedUserSerializer


@permission_classes([IsAuthenticated])
class StudentViewSet(viewsets.ModelViewSet):
    queryset = Student.objects.all()
    serializer_class = StudentSerializer

    def get_queryset(self):
        if hasattr(self.request.user, "teacher"):
            return self.queryset.filter(school=self.request.user.teacher.school)
        elif self.request.user.is_staff:
            return self.queryset.all()
        else:
            return self.queryset.all()


def get_role(self):
    """
    Returns the role of the user.

    Returns:
        str: The role of the user.
    """
    if hasattr(self, "student"):
        return "student"
    elif hasattr(self, "teacher"):
        return "teacher"
    return "user"
