"""
Django settings for server project.

Generated by 'django-admin startproject' using Django 5.0.6.

For more information on this file, see
https://docs.djangoproject.com/en/5.0/topics/settings/

For the full list of settings and their values, see
https://docs.djangoproject.com/en/5.0/ref/settings/
"""

from datetime import timedelta
import os
from pathlib import Path

from dotenv import load_dotenv

load_dotenv()


# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent

FRONTEND_URL = os.environ.get("FRONTEND_URL")

# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/5.0/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = os.environ.get("API_SECRET_KEY")

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = os.environ.get("APP_ENV") == "DEVELOPMENT"

ALLOWED_HOSTS = (
    os.environ.get("API_ALLOWED_HOSTS").split()
    if os.environ.get("API_ALLOWED_HOSTS")
    else []
)


# Application definition

INSTALLED_APPS = [
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",
    "django_extensions",
    "rest_framework",
    "corsheaders",
    "api.healthcheck",
    "api.manager",
    "rest_framework_simplejwt",
]

REST_FRAMEWORK = {
    "DEFAULT_AUTHENTICATION_CLASSES": (
        "rest_framework_simplejwt.authentication.JWTAuthentication",
        "rest_framework.authentication.SessionAuthentication",
        "rest_framework.authentication.BasicAuthentication",
    )
}

SIMPLE_JWT = {
    # Short-term access token lifetime
    "ACCESS_TOKEN_LIFETIME": timedelta(hours=10),
    # Long-term refresh token lifetime
    "REFRESH_TOKEN_LIFETIME": timedelta(days=7),
    # Rotate refresh tokens
    "ROTATE_REFRESH_TOKENS": True,
    # Blacklist old tokens after rotation
    "BLACKLIST_AFTER_ROTATION": True,
    # Signing algorithm
    "ALGORITHM": "HS256",
    # Secret key for signing tokens
    "SIGNING_KEY": SECRET_KEY,
    # Authentication header type
    "AUTH_HEADER_TYPES": ("Bearer",),
    # Authentication header name
    "AUTH_HEADER_NAME": "HTTP_AUTHORIZATION",
    # # User ID field
    # "USER_ID_FIELD": "user_id",
    # # User ID claim in the token
    # "USER_ID_CLAIM": "user_id",
}

MIDDLEWARE = [
    "django.middleware.security.SecurityMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
    "corsheaders.middleware.CorsMiddleware",
]

CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]

ROOT_URLCONF = "api.urls"

TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.debug",
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
            ],
        },
    },
]

WSGI_APPLICATION = "api.wsgi.application"


# Database
# https://docs.djangoproject.com/en/5.0/ref/settings/#databases

DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.postgresql",
        "NAME": os.environ.get("POSTGRES_NAME") or "postgres",
        "USER": os.environ.get("POSTGRES_USER") or "postgres",
        "PASSWORD": os.environ.get("POSTGRES_PASSWORD") or "password",
        "HOST": os.environ.get("POSTGRES_HOST") or "host.docker.internal",
        "PORT": os.environ.get("POSTGRES_PORT") or 5432,
    }
}


# Password validation
# https://docs.djangoproject.com/en/5.0/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    {
        "NAME": "django.contrib.auth.password_validation.UserAttributeSimilarityValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.MinimumLengthValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.CommonPasswordValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.NumericPasswordValidator",
    },
]


# Internationalization
# https://docs.djangoproject.com/en/5.0/topics/i18n/

LANGUAGE_CODE = "en-us"

TIME_ZONE = "UTC"

USE_I18N = True

USE_TZ = True


# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/4.2/howto/static-files/

PROJECT_ROOT = os.path.dirname(os.path.dirname(
    os.path.dirname(os.path.abspath(__file__))))  # <- '/' directory

STATIC_URL = "/static/"

# STATIC_ROOT is where the static files get copied to when "collectstatic" is run.
STATIC_ROOT = "static_files"

# This is where to _find_ static files when 'collectstatic' is run.
# These files are then copied to the STATIC_ROOT location.
STATICFILES_DIRS = ("static",)

# Default primary key field type
# https://docs.djangoproject.com/en/5.0/ref/settings/#default-auto-field

DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"
