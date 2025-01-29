from django.db import IntegrityError
from rest_framework.decorators import permission_classes
from rest_framework.response import Response
from rest_framework import status, viewsets, filters
from rest_framework.permissions import IsAuthenticated, IsAdminUser  # ,allowAny
from django.contrib.auth.models import User
from .models import Student, Teacher, School
from .serializers import StudentSerializer, SchoolSerializer, TeacherSerializer, UserSerializer
from django_filters.rest_framework import DjangoFilterBackend


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
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = ['school', 'year_level']
    search_fields = ['user__username']

    def get_queryset(self):
        if hasattr(self.request.user, "teacher"):
            teacher_school = self.request.user.teacher.school
            return self.queryset.filter(school=teacher_school)
        elif self.request.user.is_staff:
            return self.queryset.all()
        else:
            return self.queryset.all()

    def create(self, request, *args, **kwargs):
        data = request.data.copy()  # Create a mutable copy of request.data
        if hasattr(self.request.user, "teacher"):
            data["school"] = self.request.user.teacher.school.id
        try:
            serializer = self.get_serializer(data=data, many=True)
            serializer.is_valid(raise_exception=True)
            self.perform_create(serializer)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        except IntegrityError as error:
            return Response(
                {"error": str(
                    error), "message": "A student with this username already exists."},
                status=status.HTTP_400_BAD_REQUEST
            )

    def update(self, request, *args, **kwargs):
        data = request.data.copy()  # Create a mutable copy of request.data
        if hasattr(self.request.user, "teacher"):
            data["school"] = self.request.user.teacher.school.id
        try:
            partial = kwargs.pop('partial', False)
            instance = self.get_object()
            serializer = self.get_serializer(
                instance, data=data, partial=partial)
            serializer.is_valid(raise_exception=True)
            self.perform_update(serializer)
            return Response(serializer.data)
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
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = ['school']
    search_fields = ['user__username']

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
    filter_backends = [filters.SearchFilter]
    search_fields = ['name']

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
