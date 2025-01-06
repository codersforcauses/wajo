from rest_framework import viewsets
from .models import Team, Team_member
from .serializers import TeamSerializer
from rest_framework.decorators import api_view
from rest_framework.response import Response


@api_view(["GET", "POST"])
def team_list(request):
    if request.method == "GET":
        queryset = Team.objects.all()
        serializer = TeamSerializer(queryset, many=True)
        return Response(serializer.data)
    elif request.method == "POST":
        serializer = TeamSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=201)
        return Response(serializer.errors, status=400)


@api_view(["GET", "PUT", "PATCH", "DELETE"])
def team_detail(request, pk):
    try:
        post = Team.objects.get(pk=pk)
    except Team.DoesNotExist:
        return Response(status=404)

    if request.method == "GET":
        serializer = TeamSerializer(post)
        return Response(serializer.data)
    elif request.method in ["PUT", "PATCH"]:
        serializer = TeamSerializer(post, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=400)
    elif request.method == "DELETE":
        post.delete()
        return Response(status=204)
