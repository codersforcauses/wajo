from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.exceptions import ValidationError
from rest_framework.permissions import IsAdminUser
from rest_framework.pagination import PageNumberPagination
from django.db import IntegrityError
from rest_framework.decorators import permission_classes

from .models import Team, Team_member
from .serializers import TeamSerializer, TeamMemberSerializer


class TeamPagination(PageNumberPagination):
    page_size = 5
    page_size_query_param = 'page_size'
    max_page_size = 100


@permission_classes([IsAdminUser])
class TeamViewSet(viewsets.ModelViewSet):
    queryset = Team.objects.all()
    serializer_class = TeamSerializer
    pagination_class = TeamPagination

    def create(self, request, *args, **kwargs):
        try:
            return super().create(request, *args, **kwargs)
        except IntegrityError as error:
            return Response(
                {
                    "error": str(error),
                    "message": "A team with this name may already exist.",
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

    def update(self, request, *args, **kwargs):
        try:
            return super().update(request, *args, **kwargs)
        except IntegrityError as error:
            return Response(
                {
                    "error": str(error),
                    "message": "A team with this name may already exist.",
                },
                status=status.HTTP_400_BAD_REQUEST,
            )


@permission_classes([IsAdminUser])
class TeamMemberViewSet(viewsets.ModelViewSet):
    queryset = Team_member.objects.all()
    serializer_class = TeamMemberSerializer

    def create(self, request, *args, **kwargs):
        try:
            return super().create(request, *args, **kwargs)
        except ValidationError as error:
            return Response(
                {
                    "error": error.detail,
                    "message": "Validation failed for team member data.",
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

    def update(self, request, *args, **kwargs):
        try:
            return super().update(request, *args, **kwargs)
        except ValidationError as error:
            return Response(
                {
                    "error": error.detail,
                    "message": "Validation failed for team member data.",
                },
                status=status.HTTP_400_BAD_REQUEST,
            )
