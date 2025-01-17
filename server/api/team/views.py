from rest_framework import viewsets, status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.pagination import PageNumberPagination
from django.shortcuts import get_object_or_404
from .models import Team, TeamMember
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
    queryset = TeamMember.objects.all()
    serializer_class = TeamMemberSerializer


@api_view(["GET"])
def team_list(request):
    queryset = Team.objects.all()
    paginator = TeamPagination()
    paginated_queryset = paginator.paginate_queryset(queryset, request)
    serializer = TeamSerializer(paginated_queryset, many=True)
    return paginator.get_paginated_response(serializer.data)


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
    team_member = get_object_or_404(TeamMember, pk=pk)

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
