from django.db import IntegrityError
from rest_framework.decorators import permission_classes
from rest_framework.response import Response
from rest_framework import status, viewsets, filters
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from api.permissions import IsTeacher, IsAdmin
from django.contrib.auth.models import User
from .models import Student, Teacher, School
from .serializers import (
    StudentSerializer,
    SchoolSerializer,
    TeacherSerializer,
    UserSerializer,
)
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.views import APIView


@permission_classes([IsAdminUser])
class AdminUserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.filter(is_staff=True)
    serializer_class = UserSerializer
    ordering_fields = ["first_name", "last_name"]

    def create(self, request, *args, **kwargs):
        try:
            return super().create(request, *args, **kwargs)
        except IntegrityError as error:
            return Response(
                {
                    "error": str(error),
                    "message": "A user with this username already exists.",
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

    def update(self, request, *args, **kwargs):
        try:
            return super().update(request, *args, **kwargs)
        except IntegrityError as error:
            return Response(
                {
                    "error": str(error),
                    "message": "A user with this username already exists.",
                },
                status=status.HTTP_400_BAD_REQUEST,
            )


@permission_classes([IsAdminUser])
class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    ordering_fields = ["first_name", "last_name"]

    def get_queryset(self):
        return self.queryset

    def create(self, request, *args, **kwargs):
        return super().create(request, *args, **kwargs)

    def update(self, request, *args, **kwargs):
        return super().update(request, *args, **kwargs)


@permission_classes([IsAuthenticated])
class StudentViewSet(viewsets.ModelViewSet):
    queryset = Student.objects.all()
    serializer_class = StudentSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = ["school", "year_level"]
    search_fields = ["user__username"]
    ordering_fields = ["user__first_name", "user__last_name"]

    def get_queryset(self):
        if hasattr(self.request.user, "teacher"):
            teacher_school = self.request.user.teacher.school
            return self.queryset.filter(school=teacher_school)
        elif self.request.user.is_staff:
            return self.queryset.all()
        # If the user is a student, return only their own data
        elif hasattr(self.request.user, "student"):
            return self.queryset.filter(id=self.request.user.student.id)

        # For all other cases (there shouldn't be any, but just in case), return an empty queryset
        return self.queryset.none()

    def create(self, request, *args, **kwargs):
        data = request.data.copy()  # Create a mutable copy of request.data
        if hasattr(request.user, "teacher"):
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
                status=status.HTTP_403_FORBIDDEN,
            )

    def update(self, request, *args, **kwargs):
        data = request.data.copy()  # Create a mutable copy of request.data
        if hasattr(self.request.user, "teacher"):
            data["school"] = self.request.user.teacher.school.id
        try:
            partial = kwargs.pop("partial", False)
            instance = self.get_object()
            serializer = self.get_serializer(instance, data=data, partial=partial)
            serializer.is_valid(raise_exception=True)
            self.perform_update(serializer)
            return Response(serializer.data)
        except IntegrityError as error:
            return Response(
                {
                    "error": str(error),
                    "message": "A student with this username already exists.",
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

    def set_passwords(self, serialized_data, original_data) -> None:
        """
        Sets the plan text passwords for the students when they are created.
        """
        for item, student_data in zip(serialized_data, original_data):
            item["password"] = student_data["password"]

    def perform_create(self, serializer):
        # Save the student instance
        students = serializer.save()

        # Update the plaintext_password field for each student
        for student, data in zip(students, self.request.data):
            student.plaintext_password = data.get("password")
            student.save()


@permission_classes([IsAuthenticated])
class TeacherViewSet(viewsets.ModelViewSet):
    queryset = Teacher.objects.all()
    serializer_class = TeacherSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = ["school"]
    search_fields = ["user__username"]
    ordering_fields = ["user__first_name", "user__last_name"]

    def list(self, request, *args, **kwargs):
        if request.user.is_staff:
            return super().list(request, *args, **kwargs)
        else:
            return Response(
                {"error": "You do not have permission to access this resource."},
                status=status.HTTP_403_FORBIDDEN,
            )

    def retrieve(self, request, *args, **kwargs):
        if request.user.is_staff:
            return super().retrieve(request, *args, **kwargs)
        elif hasattr(request.user, "teacher"):
            if request.user.teacher.id == int(kwargs["pk"]):
                return super().retrieve(request, *args, **kwargs)
            else:
                return Response(
                    {"error": "You do not have permission to access this resource."},
                    status=status.HTTP_403_FORBIDDEN,
                )
        else:
            return Response(
                {"error": "You do not have permission to access this resource."},
                status=status.HTTP_403_FORBIDDEN,
            )

    def create(self, request, *args, **kwargs):
        if request.user.is_staff:
            serializer = self.get_serializer(data=request.data, many=True)
            serializer.is_valid(raise_exception=True)
            self.perform_create(serializer)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            return Response(
                {"error": "You do not have permission to access this resource."},
                status=status.HTTP_403_FORBIDDEN,
            )

    def update(self, request, *args, **kwargs):
        if request.user.is_staff:
            return super().update(request, *args, **kwargs)
        elif hasattr(request.user, "teacher"):
            if request.user.teacher.id == int(kwargs["pk"]):
                return super().update(request, *args, **kwargs)
            else:
                return Response(
                    {"error": "You do not have permission to access this resource."},
                    status=status.HTTP_403_FORBIDDEN,
                )
        else:
            return Response(
                {"error": "You do not have permission to access this resource."},
                status=status.HTTP_403_FORBIDDEN,
            )

    def destroy(self, request, *args, **kwargs):
        if request.user.is_staff:
            return super().destroy(request, *args, **kwargs)
        else:
            return Response(
                {"error": "You do not have permission to access this resource."},
                status=status.HTTP_403_FORBIDDEN,
            )


@permission_classes([IsTeacher | IsAdmin | IsAdminUser])
class SchoolViewSet(viewsets.ModelViewSet):
    """
    A viewset for managing schools.

    Attributes:
        queryset: QuerySet of all School instances.
        serializer_class: Serializer class for School instances.
        filter_backends: Filters applied to the viewset.
        search_fields: Fields that can be searched.
    """

    serializer_class = SchoolSerializer
    filter_backends = [filters.SearchFilter]
    search_fields = ["name", "address", "abbreviation", "type", "is_country"]
    ordering_fields = ["name", "address", "abbreviation", "type", "is_country"]

    def get_queryset(self):
        """Filter based on user role."""
        user = self.request.user
        queryset = School.objects.all()
        if hasattr(user, "teacher"):
            return queryset.filter(id=user.teacher.school_id)
        return queryset.order_by("id")

    def create(self, request, *args, **kwargs):
        user = self.request.user
        if hasattr(user, "teacher"):
            return Response(
                {"error": "Teacher cannot create school."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        serializer = self.get_serializer(data=request.data, many=True)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    def update(self, request, *args, **kwargs):
        try:
            return super().update(request, *args, **kwargs)
        except IntegrityError as error:
            return Response(
                {
                    "error": "A school with this name already exists.",
                    "message": str(error),
                },
                status=status.HTTP_400_BAD_REQUEST,
            )


@permission_classes([IsAuthenticated])
class UserProfileView(APIView):

    def get(self, request):
        user = request.user
        profile = {
            'user_id': user.id,
            'username': user.username,
            'role': 'teacher' if hasattr(user, 'teacher') else 'student' if hasattr(user, 'student') else 'admin',
            'email': user.email if hasattr(user, 'email') else None,
            'first_name': user.first_name,
            'last_name': user.last_name,
            'is_staff': None if hasattr(user, "teacher") or hasattr(user, "student") else user.is_staff,
            'is_superuser': None if hasattr(user, "teacher") or hasattr(user, "student") else user.is_superuser,
        }

        if hasattr(user, 'student'):
            student_profile_fields = {
                'student_id': user.student.id,
                'school': user.student.school.name,
                'school_name': user.student.school.name,
                'address': user.teacher.school.address,
                'year_level': user.student.year_level if hasattr(user, 'student') else None,
            }
            profile.update(student_profile_fields)
        elif hasattr(user, 'teacher'):
            teacher_profile_fields = {
                'school': user.teacher.school.name,
                'school_name': user.teacher.school.name,
                'school_id': user.teacher.school.id,
                'is_country': user.teacher.school.is_country,
                'school_type': user.teacher.school.type,
                'address': user.teacher.school.address,
                'phone': user.teacher.phone,
                'teacher_email': user.teacher.email,
            }
            profile.update(teacher_profile_fields)

        return Response(profile)
