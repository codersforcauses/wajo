from rest_framework.permissions import BasePermission
from .users.models import Student, Teacher


'''
Example of using this file in the views.py file:
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from api.permissions import IsStudent, IsTeacher, IsAdmin
from api.serializers import SchoolSerializer
from users.models import School


class SchoolViewSet(viewsets.ModelViewSet):
    queryset = School.objects.all()
    serializer_class = SchoolSerializer
    permission_classes = [IsAuthenticated | IsStudent | IsTeacher | IsAdmin]


'''


def get_user_role(user):
    """
    Determine the role of a user based on their related model.
    
    Args:
        user: The User object to check.

    Returns:
        str: 'student', 'teacher', or 'unknown' based on the user's role.
    """
    if not user.is_authenticated:
        return 'unknown'
    
    try:
        # Check if the user is a Student
        if user.student:
            return 'student'
    except Student.DoesNotExist:
        pass

    try:
        # Check if the user is a Teacher
        if user.teacher:
            return 'teacher'
    except Teacher.DoesNotExist:
        pass

    # Check if the user is an Admin
    if user.is_staff:
        return 'admin'

    return 'unknown'


class IsStudent(BasePermission):
    """
    Permission class to allow access only to students.
    """
    def has_permission(self, request, view):
        return get_user_role(request.user) == 'student'


class IsTeacher(BasePermission):
    """
    Permission class to allow access only to teachers.
    """
    def has_permission(self, request, view):
        return get_user_role(request.user) == 'teacher'


class IsAdmin(BasePermission):
    """
    Permission class to allow access only to superusers or staff.
    """
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.is_staff
