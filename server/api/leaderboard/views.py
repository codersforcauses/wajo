from rest_framework.views import APIView
from rest_framework.permissions import AllowAny
from rest_framework import status
from rest_framework.response import Response

from .serializers import LeaderboardSerializer


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
    permission_classes = [AllowAny]
    serializer_class = LeaderboardSerializer

    def get(self, request):
        # sample data
        data = [
            {
                "name": "Alice",
                "school": "Green Valley High",
                "school_email": "alice@greenvalley.edu",
                "user_name": "alice123",
                "password": "password123",
                "individual_score": 95,
                "team_name": "Team A",
                "team_score": 290,
                "status": "Active",
            },
            {
                "name": "Charlie",
                "school": "Riverstone Institute",
                "school_email": "charlie@riverstone.edu",
                "user_name": "charlie789",
                "password": "charliepass",
                "individual_score": 88,
                "team_name": "Team A",
                "team_score": 290,
                "status": "Inactive",
            },
        ]
        return Response(data, status=status.HTTP_200_OK)
