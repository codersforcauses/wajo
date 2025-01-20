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
        fields = ['id', 'username', 'password',
                  'email', 'first_name', 'last_name']
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user


class SchoolSerializer(serializers.ModelSerializer):
    """
    Serializer for the School model.
    Converts school model instances into JSON and validates incoming data for schools.
    """

    class Meta:
        model = School
        fields = ['id', 'name', 'code']


class StudentSerializer(serializers.ModelSerializer):
    """
    Serializer for the Student model.
    Includes nested serializers for the related User and School models.
    Converts student model instances into JSON and validates incoming data for students.
    """
    user = UserSerializer()
    school = SchoolSerializer(read_only=True)
    school_id = serializers.PrimaryKeyRelatedField(
        queryset=School.objects.all(), write_only=True, source='school'
    )

    class Meta:
        model = Student
        fields = '__all__'

    def create(self, validated_data):
        user_data = validated_data.pop('user')
        user = User.objects.create_user(**user_data)
        student = Student.objects.create(user=user, **validated_data)
        return student


class TeacherSerializer(serializers.ModelSerializer):
    """
    Serializer for the Teacher model.
    Includes nested serializers for the related User and School models.
    Converts teacher model instances into JSON and validates incoming data for teachers.
    """
    user = UserSerializer()
    school = SchoolSerializer(read_only=True)
    school_id = serializers.PrimaryKeyRelatedField(
        queryset=School.objects.all(), write_only=True, source='school'
    )

    class Meta:
        model = Teacher
        fields = '__all__'

    def create(self, validated_data):
        user_data = validated_data.pop('user')
        user = User.objects.create_user(**user_data)
        teacher = Teacher.objects.create(user=user, **validated_data)
        return teacher
