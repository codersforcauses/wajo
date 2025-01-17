from rest_framework import viewsets
from django_filters import FilterSet, ChoiceFilter, NumberFilter
from .serializers import IndividualLeaderboardSerializer, TeamLeaderboardSerializer
from ..users.models import School, Student
from ..team.models import Team

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
    serializer_class = IndividualLeaderboardSerializer
    filterset_class = IndividualLeaderboardFilter
    filterset_fields = ['attendent_year', 'year_level', 'school__type']


class TeamLeaderboardFilter(FilterSet):
    school__type = ChoiceFilter(field_name='school__type', choices=School.SchoolType.choices)
    students__attendent_year = NumberFilter(field_name='students__attendent_year')

    class Meta:
        model = Team
        fields = ['students__attendent_year', 'students__year_level', 'school__type']


class TeamLeaderboardViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Team.objects.all()
    serializer_class = TeamLeaderboardSerializer
    filterset_class = TeamLeaderboardFilter
    filterset_fields = ['students__attendent_year', 'students__year_level', 'school__type']
