from rest_framework.views import APIView
from rest_framework.permissions import AllowAny
from rest_framework import status
from rest_framework.response import Response
from django.shortcuts import get_list_or_404
from .serializers import LeaderboardSerializer
from ..users.models import Student


class LeaderboardView(APIView):
    """
    LeaderboardView API view to manage leaderboard data.

    This view handles retrieving leaderboard data. It returns sample leaderboard data in response to GET requests.

    Attributes:
        permission_classes (list): Defines the permission class, allowing any user access to the view.
        serializer_class (LeaderboardSerializer): Specifies the serializer used for serializing the leaderboard data.

    Methods:
        - get(request): Handles GET requests. Returns sample data for the leaderboard.
    """
    permission_classes = [AllowAny] # is this appropriate for this view?
    serializer_class = LeaderboardSerializer

    def get(self, request):
        students = get_list_or_404(Student.objects.select_related('user', 'school'))
        print("DEBUG: Found students:", students)
        serializer = self.serializer_class(students, many=True)
        print("DEBUG: Serializer data:", serializer.data)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    ## TODO: add pagination and possibly filters for leaderboard??
