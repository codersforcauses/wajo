from rest_framework import viewsets, status
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
    search_fields = ['name']

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data, many=True)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
        # try:
        #     return super().create(request, *args, **kwargs)
        # except IntegrityError as error:
        #     return Response(
        #         {
        #             "error": str(error),
        #             "message": "A team with this name may already exist.",
        #         },
        #         status=status.HTTP_400_BAD_REQUEST,
        #     )

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
