from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Student, Teacher, School


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
    username = serializers.CharField(read_only=True)
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        exclude = ['is_active', 'groups', 'user_permissions']
        read_only_fields = ['last_login', 'date_joined']

    def create(self, validated_data):
        """
        Creates a new User instance.

        Args:
            validated_data (dict): The validated data for creating a User instance.
                - first_name (str): The first name of the user.
                - last_name (str): The last name of the user.
                - password (str): The password for the user.

        Returns:
            User: The created User instance.
        """
        fullname = validated_data['first_name'] + validated_data['last_name']
        validated_data['username'] = fullname
        return super().create(validated_data)


class SchoolSerializer(serializers.ModelSerializer):
    """
    SchoolSerializer is a ModelSerializer for the School model.
    It handles the serialization and deserialization of School instances.

    Fields:
        - name: CharField, required
        - type: ChoiceField, optional, mapped to TYPE_CHOICES
        - is_country: BooleanField
        - note: CharField, optional
    """

    name = serializers.CharField(required=True)
    type = serializers.ChoiceField(choices=School.TYPE_CHOICES, required=False, allow_blank=True)
    is_country = serializers.BooleanField(default=False)
    note = serializers.CharField(required=False, allow_blank=True)

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
    full_name = serializers.CharField(source='user.username', read_only=True)
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
        if user_data:
            user_serializer = UserSerializer(
                instance.user, data=user_data, partial=True)
            user_serializer.is_valid(raise_exception=True)
            user_serializer.save()

        # Update the Teacher instance and return it
        return super().update(instance, validated_data)

    class Meta:
        model = Teacher
        exclude = ['user']
