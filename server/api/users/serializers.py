from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Student, Teacher, School
from rest_framework.exceptions import PermissionDenied


class UserSerializer(serializers.ModelSerializer):
    first_name = serializers.CharField(required=True)
    last_name = serializers.CharField(required=True)
    username = serializers.CharField(read_only=True)
    password = serializers.CharField(write_only=True, required=True)

    class Meta:
        model = User
        fields = ['id', 'first_name', 'last_name', 'password', 'username']

    def create(self, data):
        fullname = data['first_name'] + data['last_name']
        user = User.objects.create_user(
            first_name=data['first_name'],
            last_name=data['last_name'],
            username=fullname,
            password=data['password'],
        )
        return user


class SchoolSerializer(serializers.ModelSerializer):
    """
    Serializer for the School model.
    Converts school model instances into JSON and validates incoming data for schools.
    """
    name = serializers.CharField(required=True)

    class Meta:
        model = School
        fields = ['id', 'name']


class StudentSerializer(serializers.ModelSerializer):
    """
    Serializer for the Student model.
    Includes nested serializers for the related User and School models.
    Converts student model instances into JSON and validates incoming data for students
    """
    first_name = serializers.CharField(required=True, source='user.first_name')
    last_name = serializers.CharField(required=True, source='user.last_name')
    password = serializers.CharField(
        required=True, source='user.password', write_only=True)
    year_level = serializers.CharField(required=True)
    school_name = serializers.CharField(required=False, source='school.name')

    def create(self, validated_data):
        request_user = self.context['request'].user
        user_data = validated_data.pop('user')

        if request_user.is_staff:  # if the user is a staff
            school_name = validated_data['school'].get('name')
            school = School.objects.get(name=school_name)
            validated_data['school'] = school

        else:  # if the user is a teacher
            user_school = request_user.teacher.school
            validated_data['school'] = user_school

        user_serializer = UserSerializer(data=user_data)
        user_serializer.is_valid(raise_exception=True)
        user = user_serializer.save()
        validated_data['user'] = user

        return super().create(validated_data)

    class Meta:
        model = Student
        fields = ['id', 'first_name', 'last_name',
                  'password', 'year_level', 'school_name']
        read_only_fields = ['id']


class TeacherSerializer(serializers.ModelSerializer):
    """
    Serializer for the Teacher model.
    Includes nested serializers for the related User and School models.
    Converts teacher model instances into JSON and validates incoming data for teachers.
    """
    first_name = serializers.CharField(required=True, source='user.first_name')
    last_name = serializers.CharField(required=True, source='user.last_name')
    password = serializers.CharField(
        required=True, source='user.password', write_only=True)

    school_name = serializers.CharField(required=True, source='school.name')
    email = serializers.EmailField(required=True)
    phone = serializers.CharField(required=False)

    def create(self, validated_data):
        user_data = validated_data.pop('user')
        school_name = validated_data.pop('school').get('name')
        school = School.objects.get(name=school_name)
        validated_data['school'] = school
        user_serializer = UserSerializer(data=user_data)
        user_serializer.is_valid(raise_exception=True)
        user = user_serializer.save()
        validated_data['user'] = user
        return super().create(validated_data)

    class Meta:
        model = Teacher
        fields = ['id', 'first_name', 'last_name',
                  'school_name', 'phone', 'email', 'password', 'created_at']
