from django.contrib.auth.models import User
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user: User):
        role = "admin" if user.is_staff else None

        if hasattr(user, "student"):
            role = "student"
        elif hasattr(user, "teacher"):
            role = "teacher"

        token = super().get_token(user)
        token['is_superuser'] = user.is_superuser
        token['role'] = role

        return token
