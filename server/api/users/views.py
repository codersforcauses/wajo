from django.db import IntegrityError
from rest_framework.decorators import permission_classes
from rest_framework.response import Response
from rest_framework import status, viewsets, filters
from rest_framework.permissions import (IsAuthenticated,
                                        IsAdminUser)
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
            # teacher can only create students for their school
            for student in data:
                student["school_id"] = self.request.user.teacher.school.id
            serializer = self.get_serializer(data=data, many=True)
            serializer.is_valid(raise_exception=True)
            self.perform_create(serializer)
            self.set_passwords(serializer.data, data)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        elif self.request.user.is_staff:
            # allow bulk creation of students by admin
            serializer = self.get_serializer(data=data, many=True)
            serializer.is_valid(raise_exception=True)
            self.perform_create(serializer)
            self.set_passwords(serializer.data, data)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            return Response(
                {"error": "You do not have permission to access this resource."},
                status=status.HTTP_403_FORBIDDEN)

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

    def set_passwords(self, serialized_data, original_data) -> None:
        """
        Sets the plan text passwords for the students when they are created.
        """
        for item, student_data in zip(serialized_data, original_data):
            item["password"] = student_data["password"]


@permission_classes([IsAuthenticated])
class TeacherViewSet(viewsets.ModelViewSet):
    queryset = Teacher.objects.all()
    serializer_class = TeacherSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = ['school']
    search_fields = ['user__username']

    def list(self, request, *args, **kwargs):
        if request.user.is_staff:
            return super().list(request, *args, **kwargs)
        else:
            return Response(
                {"error": "You do not have permission to access this resource."},
                status=status.HTTP_403_FORBIDDEN)

    def retrieve(self, request, *args, **kwargs):
        if request.user.is_staff:
            return super().retrieve(request, *args, **kwargs)
        elif hasattr(request.user, "teacher"):
            print(kwargs["pk"])
            if request.user.teacher.id == int(kwargs["pk"]):
                return super().retrieve(request, *args, **kwargs)
            else:
                return Response(
                    {"error": "You do not have permission to access this resource."}, status=status.HTTP_403_FORBIDDEN)
        else:
            return Response(
                {"error": "You do not have permission to access this resource."}, status=status.HTTP_403_FORBIDDEN)

    def create(self, request, *args, **kwargs):
        if request.user.is_staff:
            return super().create(request, *args, **kwargs)
        else:
            return Response(
                {"error": "You do not have permission to access this resource."}, status=status.HTTP_403_FORBIDDEN)

    def update(self, request, *args, **kwargs):
        if request.user.is_staff:
            return super().update(request, *args, **kwargs)
        elif hasattr(request.user, "teacher"):
            if request.user.teacher.id == int(kwargs["pk"]):
                return super().update(request, *args, **kwargs)
            else:
                return Response(
                    {"error": "You do not have permission to access this resource."}, status=status.HTTP_403_FORBIDDEN)
        else:
            return Response(
                {"error": "You do not have permission to access this resource."}, status=status.HTTP_403_FORBIDDEN)

    def destroy(self, request, *args, **kwargs):
        if request.user.is_staff:
            return super().destroy(request, *args, **kwargs)
        else:
            return Response(
                {"error": "You do not have permission to access this resource."}, status=status.HTTP_403_FORBIDDEN)


@permission_classes([IsAdminUser])
class SchoolViewSet(viewsets.ModelViewSet):
    """
    A viewset for managing schools.

    Attributes:
        queryset: QuerySet of all School instances.
        serializer_class: Serializer class for School instances.
        filter_backends: Filters applied to the viewset.
        search_fields: Fields that can be searched.
    """
    queryset = School.objects.all()
    serializer_class = SchoolSerializer
    filter_backends = [filters.SearchFilter]
    search_fields = ['name', 'abbreviation', 'type', 'is_country']

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data, many=True)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
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
