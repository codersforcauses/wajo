from django.db import IntegrityError
from rest_framework.decorators import api_view, action, permission_classes
from rest_framework.response import Response
from rest_framework import status, serializers, viewsets, filters
from rest_framework.permissions import AllowAny, IsAuthenticated, IsAdminUser
from django.contrib.auth.models import User
from .models import Student, Teacher, School
from .serializers import StudentSerializer, SchoolSerializer, TeacherSerializer, UserSerializer
# from django_filters.rest_framework import DjangoFilterBackend
# from .serializers import ExtendedUserSerializer


@permission_classes([IsAdminUser])
class AdminUserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.filter(is_staff=True)
    serializer_class = UserSerializer

    def create(self, request, *args, **kwargs):
        try:
            return super().create(request, *args, **kwargs)
        except IntegrityError as error:
            return Response(
                {"error": str(
                    error), "message": "A user with this username already exists."},
                status=status.HTTP_400_BAD_REQUEST
            )

    def update(self, request, *args, **kwargs):
        try:
            return super().update(request, *args, **kwargs)
        except IntegrityError as error:
            return Response(
                {"error": str(
                    error), "message": "A user with this username already exists."},
                status=status.HTTP_400_BAD_REQUEST
            )


@permission_classes([IsAuthenticated])
class StudentViewSet(viewsets.ModelViewSet):
    queryset = Student.objects.all()
    serializer_class = StudentSerializer

    def get_queryset(self):
        if hasattr(self.request.user, "teacher"):
            teacher_school = self.request.user.teacher.school
            return self.queryset.filter(school=teacher_school)
        elif self.request.user.is_staff:
            return self.queryset.all()
        else:
            return self.queryset.all()

    def create(self, request, *args, **kwargs):
        try:
            return super().create(request, *args, **kwargs)
        except IntegrityError as error:
            return Response(
                {"error": str(
                    error), "message": "A student with this username already exists."},
                status=status.HTTP_400_BAD_REQUEST
            )

    def update(self, request, *args, **kwargs):
        try:
            return super().update(request, *args, **kwargs)
        except IntegrityError as error:
            return Response(
                {"error": str(
                    error), "message": "A student with this username already exists."},
                status=status.HTTP_400_BAD_REQUEST
            )


@permission_classes([IsAdminUser])
class TeacherViewSet(viewsets.ModelViewSet):
    queryset = Teacher.objects.all()
    serializer_class = TeacherSerializer

    def create(self, request, *args, **kwargs):
        try:
            return super().create(request, *args, **kwargs)
        except IntegrityError as error:
            return Response(
                {"error": str(error)},
                status=status.HTTP_400_BAD_REQUEST
            )

    def update(self, request, *args, **kwargs):
        try:
            return super().update(request, *args, **kwargs)
        except IntegrityError as error:
            return Response(
                {"error": str(error)},
                status=status.HTTP_400_BAD_REQUEST
            )


@permission_classes([IsAdminUser])
class SchoolViewSet(viewsets.ModelViewSet):
    queryset = School.objects.all()
    serializer_class = SchoolSerializer

    def create(self, request, *args, **kwargs):
        try:
            return super().create(request, *args, **kwargs)
        except IntegrityError as error:
            return Response(
                {
                    "error": "A school with this name already exists.",
                    "message": str(error)
                },
                status=status.HTTP_400_BAD_REQUEST
            )

    def update(self, request, *args, **kwargs):
        try:
            return super().update(request, *args, **kwargs)
        except IntegrityError as error:
            return Response(
                {
                    "error": "A school with this name already exists.",
                    "message": str(error)
                },
                status=status.HTTP_400_BAD_REQUEST
            )


# def get_role(self):
#     """
#     Returns the role of the user.

#     Returns:
#         str: The role of the user.
#     """
#     if hasattr(self, "student"):
#         return "student"
#     elif hasattr(self, "teacher"):
#         return "teacher"
#     return "user"
