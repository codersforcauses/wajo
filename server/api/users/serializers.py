from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Student, Teacher, School
import random
from django.utils.timezone import now


class UserSerializer(serializers.ModelSerializer):
    """
    UserSerializer is a ModelSerializer for the User model.
    It handles the serialization and deserialization of User instances.

    Fields:
        - first_name: CharField, required
        - last_name: CharField, required
        - username: CharField, read-only
        - password: CharField, write-only

    Meta:
        - model: User
        - exclude: ['is_active', 'date_joined']
        - read_only_fields: [ 'last_login', 'user_permissions']
    """
    first_name = serializers.CharField(required=True)
    last_name = serializers.CharField(required=True)
    username = serializers.CharField(required=True)
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        exclude = ['is_active', 'groups', 'user_permissions']
        read_only_fields = ['last_login', 'date_joined']

    def create(self, validated_data):
        password = validated_data.pop('password')
        user = User(**validated_data)
        user.set_password(password)
        user.save()
        return user

    def update(self, instance, validated_data):
        if 'password' in validated_data:
            password = validated_data.pop('password')
            instance.set_password(password)
            instance.save()
            validated_data['password'] = instance.password
        return super().update(instance, validated_data)


class SchoolSerializer(serializers.ModelSerializer):
    """
    SchoolSerializer is a ModelSerializer for the School model.
    It handles the serialization and deserialization of School instances.

    Fields:
        - name: CharField, required

    Meta:
        - model: School
        - exclude: ['id', 'code']
    """
    name = serializers.CharField(required=True)

    class Meta:
        model = School
        exclude = ['code']


class StudentSerializer(serializers.ModelSerializer):
    """
    StudentSerializer is a ModelSerializer for the Student model.
    It handles the serialization and deserialization of Student instances, including nested user data.

    Fields:
        - first_name: CharField, required, maps to user.first_name
        - last_name: CharField, required, maps to user.last_name
        - password: CharField, required, write-only, maps to user.password
        - year_level: IntegerField, required, min_value=0, max_value=12
        - school_id: PrimaryKeyRelatedField, write-only, maps to school
        - school: CharField, read-only, maps to school.name

    Methods:
        - create(validated_data): Creates a new Student instance along with the associated User instance.
        - update(instance, validated_data): Updates an existing Student instance along with the associated User instance.

    Meta:
        - model: Student
        - exclude: ['user']
    """
    first_name = serializers.CharField(required=True, source='user.first_name')
    last_name = serializers.CharField(required=True, source='user.last_name')
    student_id = serializers.CharField(source='user.username', read_only=True)
    password = serializers.CharField(
        required=True, source='user.password', write_only=True)
    year_level = serializers.IntegerField(
        required=True, min_value=0, max_value=12)
    school_id = serializers.PrimaryKeyRelatedField(
        queryset=School.objects.all(), write_only=True, source='school')
    school = SchoolSerializer(read_only=True)
    quiz_attempts = serializers.PrimaryKeyRelatedField(
        many=True, read_only=True)

    def create(self, validated_data) -> Student:
        """
        Creates a new Student instance along with the associated User instance.

        Args:
            validated_data (dict): The validated data for creating a Student instance.

        Returns:
            Student: The created Student instance.

        Raises:
            PermissionDenied: If the request user does not have permission to create a student.
        """
        # Extract and create the nested User instance
        user = validated_data.pop('user')
        random_str = self.random_digits(4)

        random_str = str(now().year) + \
            str(validated_data['school'].id) + random_str
        user['username'] = random_str
        user_serializer = UserSerializer(data=user)
        # if the username clashes with another student, generate a new one
        while User.objects.filter(username=random_str).exists():
            random_str = self.random_digits(4)
            random_str = str(now().year) + \
                str(validated_data['school'].id) + random_str
            user['username'] = random_str
            user_serializer = UserSerializer(data=user)
        user_serializer.is_valid(raise_exception=True)
        user = user_serializer.save()
        validated_data['user'] = user

        return super().create(validated_data)

    def update(self, instance, validated_data):
        """
        Updates an existing Student instance along with the associated User instance.

        Args:
            instance (Student): The existing Student instance to update.
            validated_data (dict): The validated data for updating the Student instance.

        Returns:
            Student: The updated Student instance.
        """
        # Extract and update the nested User instance
        user_data = validated_data.pop('user', None)
        if user_data:
            user_serializer = UserSerializer(
                instance.user, data=user_data, partial=True)
            user_serializer.is_valid(raise_exception=True)
            user_serializer.save()

        # Update the Student instance
        instance = super().update(instance, validated_data)
        return instance

    def random_digits(self, n):
        digits = [i for i in range(0, 10)]
        random_str = ""
        for i in range(n):
            random_str += str(random.choice(digits))
        return random_str

    class Meta:
        model = Student
        exclude = ['user']


class TeacherSerializer(serializers.ModelSerializer):
    """
    TeacherSerializer is a ModelSerializer for the Teacher model.
    It handles the serialization and deserialization of Teacher instances, including nested user data.

    Fields:
        - first_name: CharField, required, maps to user.first_name
        - last_name: CharField, required, maps to user.last_name
        - password: CharField, required, write-only, maps to user.password
        - school_id: PrimaryKeyRelatedField, write-only, maps to school
        - school: CharField, read-only, maps to school.name
        - email: EmailField, required
        - phone: CharField, optional

    Methods:
        - create(validated_data): Creates a new Teacher instance along with the associated User instance.
        - update(instance, validated_data): Updates an existing Teacher instance along with the associated User instance.

    Meta:
        - model: Teacher
        - exclude: ['user']
    """
    first_name = serializers.CharField(required=True, source='user.first_name')
    last_name = serializers.CharField(required=True, source='user.last_name')
    password = serializers.CharField(
        required=True, source='user.password', write_only=True)
    school_id = serializers.PrimaryKeyRelatedField(
        queryset=School.objects.all(), write_only=True, source='school')
    school = SchoolSerializer(read_only=True)
    email = serializers.EmailField(required=True)
    phone = serializers.CharField(required=False)

    def create(self, validated_data):
        """
        Creates a new Teacher instance along with the associated User instance.

        Args:
            validated_data (dict): The validated data for creating a Teacher instance.

        Returns:
            Teacher: The created Teacher instance.
        """
        # Extract and create the nested User instance
        user_data = validated_data.pop('user')
        # user_data['username'] = user_data['email']
        user_data['username'] = user_data['first_name'] + \
            user_data['last_name']
        user_serializer = UserSerializer(data=user_data)
        user_serializer.is_valid(raise_exception=True)
        user = user_serializer.save()
        validated_data['user'] = user

        return super().create(validated_data)

    def update(self, instance, validated_data):
        """
        Updates an existing Teacher instance along with the associated User instance.

        Args:
            instance (Teacher): The existing Teacher instance to update.
            validated_data (dict): The validated data for updating the Teacher instance.

        Returns:
            Teacher: The updated Teacher instance.
        """
        # Extract and update the nested User instance
        user_data = validated_data.pop('user', None)
        school = validated_data.get('school', None)
        if school and (school != instance.school):
            request = self.context.get('request')
            if not request.user.is_staff:
                # return a error if the school is changed
                raise serializers.ValidationError(
                    {"error": "You are not allowed to change the school.\n Please contact the administrator."})

        if user_data:

            # check if the first name and last name are provided
            first_name = user_data.get('first_name', None)
            last_name = user_data.get('last_name', None)
            if first_name and last_name is None:
                raise serializers.ValidationError(
                    {"error": "First name and last name are required."})
            if last_name and first_name is None:
                raise serializers.ValidationError(
                    {"error": "First name and last name are required."})
            if first_name and last_name:
                user_data['username'] = first_name + last_name

            user_serializer = UserSerializer(
                instance.user, data=user_data, partial=True)
            user_serializer.is_valid(raise_exception=True)
            user_serializer.save()
        # Update the Teacher instance and return it
        return super().update(instance, validated_data)

    class Meta:
        model = Teacher
        exclude = ['user']
