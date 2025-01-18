from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Student, Teacher, School


class UserSerializer(serializers.ModelSerializer):
    """
    Serializer for the Django User model.
    Converts user model instances into JSON and validates incoming data for users.
    """

    class Meta:
        model = User
        fields = ["id", "username", "email", "first_name", "last_name"]


class SchoolSerializer(serializers.ModelSerializer):
    """
    Serializer for the School model.
    Converts school model instances into JSON and validates incoming data for schools.
    """

    class Meta:
        model = School
        fields = ["id", "name", "code"]


class StudentSerializer(serializers.ModelSerializer):
    """
    Serializer for the Student model.
    Includes nested serializers for the related User and School models.
    Converts student model instances into JSON and validates incoming data for students.
    """

    user = UserSerializer()
    school = SchoolSerializer()

    class Meta:
        model = Student
        fields = ["id", "user", "school", "attendent_year", "year_level", "status"]


class TeacherSerializer(serializers.ModelSerializer):
    """
    Serializer for the Teacher model.
    Includes nested serializers for the related User and School models.
    Converts teacher model instances into JSON and validates incoming data for teachers.
    """

    user = UserSerializer()
    school = SchoolSerializer()

    class Meta:
        model = Teacher
        fields = ["id", "user", "school", "phone"]
