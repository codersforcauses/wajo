from rest_framework import viewsets
from django_filters import FilterSet, ChoiceFilter, ModelChoiceFilter
from django.db.models import Sum
from ..quiz.models import Quiz, QuizAttempt
from .serializers import IndividualLeaderboardSerializer, TeamLeaderboardSerializer
from ..users.models import School, Student
from ..team.models import Team


class IndividualLeaderboardFilter(FilterSet):
    quiz_name = ModelChoiceFilter(
        field_name="quiz__name",
        queryset=Quiz.objects.all(),
        label="Quiz Name",
        to_field_name="name"
    )
    quiz_id = ModelChoiceFilter(
        queryset=Quiz.objects.all().values_list('id', flat=True),
        label="Quiz ID",
    )
    year_level = ModelChoiceFilter(
        field_name='student__year_level',
        queryset=Student.objects.distinct("year_level").values_list('year_level', flat=True),
        label="Year Level",
        to_field_name="year_level"
    )
    school_type = ChoiceFilter(
        field_name="student__school__type", choices=School.SchoolType.choices
    )

    class Meta:
        model = QuizAttempt
        fields = ["quiz_name", "quiz_id", "year_level", "school_type"]


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

    queryset = QuizAttempt.objects.all()
    serializer_class = IndividualLeaderboardSerializer
    filterset_class = IndividualLeaderboardFilter


class TeamLeaderboardFilter(FilterSet):
    quiz_name = ModelChoiceFilter(
        field_name="quiz_attempt__quiz__name",
        queryset=Quiz.objects.all(),
        label="Quiz Name",
        to_field_name="name"
    )
    quiz_id = ModelChoiceFilter(
        queryset=Quiz.objects.all().values_list('id', flat=True),
        label="Quiz ID",
    )
    year_level = ModelChoiceFilter(
        field_name="students__year_level",
        queryset=Student.objects.distinct("year_level").values_list('year_level', flat=True),
        label="Year Level",
        to_field_name="year_level"
    )
    school_type = ChoiceFilter(
        field_name="students__school__type",
        choices=School.SchoolType.choices,
        label="School Type",
    )

    class Meta:
        model = Team
        fields = ["quiz_name", "quiz_id", "year_level", "school_type"]


class TeamLeaderboardViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Team.objects.annotate(total_marks=Sum('quiz_attempts__total_marks')).order_by('id')
    serializer_class = TeamLeaderboardSerializer
    filterset_class = TeamLeaderboardFilter
