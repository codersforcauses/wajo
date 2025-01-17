from rest_framework.permissions import AllowAny
from rest_framework import viewsets
from django.shortcuts import get_list_or_404
from django_filters import FilterSet, ChoiceFilter
from .serializers import IndividualLeaderboardSerializer
from ..users.models import School, Student

class IndividualLeaderboardFilter(FilterSet):
    school__type = ChoiceFilter(field_name='school__type', choices=School.SchoolType.choices)

    class Meta:
        model = Student
        fields = ['attendent_year', 'year_level', 'school__type']


class IndividualLeaderboardViewSet(viewsets.ReadOnlyModelViewSet):
    """
    LeaderboardView API view to manage leaderboard data.

    This view handles retrieving leaderboard data. It returns sample leaderboard data in response to GET requests.

    Attributes:
        permission_classes (list): Defines the permission class, allowing any user access to the view.
        serializer_class (LeaderboardSerializer): Specifies the serializer used for serializing the leaderboard data.

    Methods:
        - get(request): Handles GET requests. Returns sample data for the leaderboard.
    """
    queryset = Student.objects.all()
    permission_classes = [AllowAny] # is this appropriate for this view?
    serializer_class = IndividualLeaderboardSerializer
    filterset_class = IndividualLeaderboardFilter
    filterset_fields = ['attendent_year', 'year_level', 'school__type']
