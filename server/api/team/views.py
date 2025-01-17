from rest_framework import viewsets, status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.pagination import PageNumberPagination
from django.shortcuts import get_object_or_404
from .models import Team, Team_member
from .serializers import TeamSerializer, TeamMemberSerializer


class TeamPagination(PageNumberPagination):
    page_size = 5
    page_size_query_param = 'page_size'
    max_page_size = 100


class TeamViewSet(viewsets.ModelViewSet):
    queryset = Team.objects.all()
    serializer_class = TeamSerializer
    pagination_class = TeamPagination


class TeamMemberViewSet(viewsets.ModelViewSet):
    queryset = Team_member.objects.all()
    serializer_class = TeamMemberSerializer


@api_view(["GET", "POST"])
def team_list(request):
    if request.method == "GET":
        # Handle GET request: list all teams with pagination
        queryset = Team.objects.all()
        paginator = TeamPagination()
        paginated_queryset = paginator.paginate_queryset(queryset, request)
        serializer = TeamSerializer(paginated_queryset, many=True)
        return paginator.get_paginated_response(serializer.data)

    elif request.method == "POST":
        # Handle POST request: create a new team
        serializer = TeamSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(["GET", "PUT", "PATCH", "DELETE"])
def team_detail(request, pk):
    team = get_object_or_404(Team, pk=pk)

    if request.method == "GET":
        serializer = TeamSerializer(team)
        return Response(serializer.data)
    elif request.method in ["PUT", "PATCH"]:
        serializer = TeamSerializer(
            team, data=request.data, partial=(request.method == "PATCH"))
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    elif request.method == "DELETE":
        team.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


@api_view(["GET", "PUT", "PATCH", "DELETE"])
def team_member_detail(request, pk):
    team_member = get_object_or_404(Team_member, pk=pk)

    if request.method == "GET":
        serializer = TeamMemberSerializer(team_member)
        return Response(serializer.data)
    elif request.method in ["PUT", "PATCH"]:
        serializer = TeamMemberSerializer(
            team_member, data=request.data, partial=(request.method == "PATCH"))
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    elif request.method == "DELETE":
        team_member.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


@api_view(["GET", "POST"])
def team_members_by_team(request, team_id):
    team = get_object_or_404(Team, id=team_id)

    if request.method == "GET":
        # Handle GET request: list all team members for a specific team
        team_members = Team_member.objects.filter(team=team)
        serializer = TeamMemberSerializer(team_members, many=True)
        return Response(serializer.data)

    elif request.method == "POST":
        # Handle POST request: add a new team member to the team
        serializer = TeamMemberSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(team=team)  # Automatically associate the team
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
