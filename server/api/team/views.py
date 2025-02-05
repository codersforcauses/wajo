from rest_framework import viewsets, filters, status
from rest_framework.response import Response
from rest_framework.exceptions import ValidationError
from rest_framework.permissions import IsAdminUser
from django.db import IntegrityError
from rest_framework.decorators import permission_classes

from .models import Team, TeamMember
from .serializers import TeamSerializer, TeamMemberSerializer


@permission_classes([IsAdminUser])
class TeamViewSet(viewsets.ModelViewSet):
    queryset = Team.objects.all().order_by("id")
    serializer_class = TeamSerializer
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ["name"]
    # Specify which fields can be ordered
    ordering_fields = ["id", "name", "description"]
    ordering = ["id"]

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
    queryset = TeamMember.objects.all()
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
