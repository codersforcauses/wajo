from django.contrib.auth.models import User
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user: User):
        role = "admin" if user.is_staff else None
        school_id = None
        sub_id = None

        if hasattr(user, "student"):
            role = "student"
            school_id = user.student.school.id
            sub_id = user.student.id
        elif hasattr(user, "teacher"):
            role = "teacher"
            school_id = user.teacher.school.id
            sub_id = user.teacher.id

        token = super().get_token(user)
        token['is_superuser'] = user.is_superuser
        token['role'] = role
        token['school_id'] = school_id
        token['sub_id'] = sub_id

        return token
