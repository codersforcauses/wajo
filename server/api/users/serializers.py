from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Student, Teacher, School
from rest_framework.exceptions import PermissionDenied


class UserSerializer(serializers.ModelSerializer):

    class Meta:
        model = User
        fields = ['first_name', 'last_name', 'email', 'password']
        read_only_fields = ['id']

    def create(self, data):
        number = data.pop('phone')
        city = data.pop('city')
        fullname = data['first_name'] + data['last_name']
        user = User.objects.create_user(
            first_name=data['first_name'],
            last_name=data['last_name'],
            username=fullname,
            email=data['email'],
            password=data['password'],
        )

        extended_user = Teacher.objects.create(user=user)
        extended_user.phone = number
        extended_user.branch = city
        extended_user.save()
        return user


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


class SchoolSerializer(serializers.ModelSerializer):
    """
    Serializer for the School model.
    Converts school model instances into JSON and validates incoming data for schools.
    """
    name = serializers.CharField(allow_null=True, required=False)
    code = serializers.CharField(allow_null=True, required=False)
    class Meta:
        model = School
        fields = ['id', 'name', 'code']
        read_only_fields = ['id']


class StudentSerializer(serializers.ModelSerializer):
    """
    Serializer for the Student model.
    Includes nested serializers for the related User and School models.
    Converts student model instances into JSON and validates incoming data for students.
    """
    user = UserSerializer()
    school = SchoolSerializer()

    def create(self, validated_data):
        request_user = self.context['request'].user
        if (not hasattr(request_user, 'teacher') and (not request_user.is_staff)):
            raise PermissionDenied('You are not allowed to create a student')
        user_data = validated_data.pop('user')
        username = user_data['first_name'] + user_data['last_name']
        user = User.objects.create_user(username=username, **user_data)
        if hasattr(request_user, 'teacher'):
            user_school = request_user.teacher.school
            # user_school = SchoolSerializer(user_school).data
            validated_data['school'] = user_school
        else:
            school_data = validated_data.pop('school')
            school, created = School.objects.get_or_create(**school_data)
            validated_data['school'] = school
        # school_ins = validated_data.pop('school')
        # school_ins = School.objects.create(**school_ins)
        user.save()
        student = Student.objects.create(user=user, **validated_data)
        return student

    class Meta:
        model = Student
        fields = ['id', 'user', 'school', 'year_level']
        read_only_fields = ['id']


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
        fields = ['id', 'user', 'school', 'phone']
