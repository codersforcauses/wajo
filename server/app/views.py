from rest_framework.views import APIView
from rest_framework.permissions import AllowAny
from rest_framework import status
from rest_framework.response import Response

from .serializers import LeaderboardSerializer


class LeaderboardView(APIView):
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
