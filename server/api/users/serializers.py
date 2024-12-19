from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Student, Teacher, School


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name']


class SchoolSerializer(serializers.ModelSerializer):
    class Meta:
        model = School
        fields = ['id', 'name', 'code']


class StudentSerializer(serializers.ModelSerializer):
    user = UserSerializer()
    school = SchoolSerializer()

    class Meta:
        model = Student
        fields = ['id', 'user', 'school',
                  'attendent_year', 'year_level', 'status']


class TeacherSerializer(serializers.ModelSerializer):
    user = UserSerializer()
    school = SchoolSerializer()

    class Meta:
        model = Teacher
        fields = ['id', 'user', 'school', 'phone']
