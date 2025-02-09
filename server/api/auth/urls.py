"""
URL routing for authentication-related API endpoints.

This module defines the URL patterns for handling JWT (JSON Web Token) authentication.
It includes endpoints for obtaining, refreshing, and verifying JWT tokens using the
`rest_framework_simplejwt` package.

@module server.api.auth.urls
"""

from django.urls import path, include, re_path
from rest_framework_simplejwt.views import (
    # TokenObtainPairView,
    TokenRefreshView,
    TokenVerifyView,
)
from .views import CustomTokenObtainPairView

urlpatterns = [
    path("token/", CustomTokenObtainPairView.as_view(), name="jwt_token"),
    path("refresh/", TokenRefreshView.as_view(), name="jwt_refresh"),
    path("verify/", TokenVerifyView.as_view(), name="jwt_verify"),
    re_path(r"^api-auth/", include("rest_framework.urls", namespace="rest_framework")),
]
