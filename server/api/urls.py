"""
URL configuration for server project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""

from django.contrib import admin
from django.urls import include, path
from drf_spectacular.views import SpectacularAPIView, SpectacularRedocView, SpectacularSwaggerView
from rest_framework.routers import DefaultRouter
from api.leaderboard import urls as leaderboard_urls
from django.conf import settings
from django.conf.urls.static import static

router = DefaultRouter()
router.registry.extend(leaderboard_urls.router.registry)

api_urls = [
    path("healthcheck/", include("api.healthcheck.urls")),
    path("question/", include("api.question.urls")),
    path("auth/", include("api.auth.urls")),
    path("team/", include("api.team.urls")),
]

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/healthcheck/", include("api.healthcheck.urls")),
    path("api/questions/", include("api.question.urls")),
    path("api/quiz/", include("api.quiz.urls")),
    path("api/auth/", include("api.auth.urls")),
    path("api/team/", include("api.team.urls")),
    path("api/users/", include("api.users.urls")),
    path('api/schema/', SpectacularAPIView.as_view(), name='schema'),
    # Optional UI:
    path('api/schema/swagger-ui/', SpectacularSwaggerView.as_view(url_name='schema'), name='swagger-ui'),
    path('api/schema/redoc/', SpectacularRedocView.as_view(url_name='schema'), name='redoc'),

    path("api/", include(leaderboard_urls)),
    path(r"api/", include(router.urls)),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
