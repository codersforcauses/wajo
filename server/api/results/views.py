from django_filters.rest_framework import DjangoFilterBackend
from django.db.models import BigIntegerField
from rest_framework import viewsets, filters, status
from django_filters import FilterSet, ChoiceFilter, ModelChoiceFilter
from django.db.models import Sum, Max
from django.db.models.functions import Cast
from ..quiz.models import Quiz, QuizAttempt, QuestionAttempt
from .serializers import IndividualResultsSerializer, TeamResultsSerializer, QuestionAttemptsSerializer
from ..users.models import School, Student
from ..team.models import Team
from rest_framework.response import Response


class IndividualResultsFilter(FilterSet):
    quiz_name = ModelChoiceFilter(
        field_name="quiz__name",
        queryset=Quiz.objects.all(),
        label="Quiz Name",
        to_field_name="name",
    )
    quiz_id = ModelChoiceFilter(
        queryset=Quiz.objects.all().values_list("id", flat=True),
        label="Quiz ID",
    )
    year_level = ModelChoiceFilter(
        field_name="student__year_level",
        queryset=Student.objects.distinct("year_level").values_list(
            "year_level", flat=True
        ),
        label="Year Level",
        to_field_name="year_level",
    )
    school_type = ChoiceFilter(
        field_name="student__school__type", choices=School.SchoolType.choices
    )

    class Meta:
        model = QuizAttempt
        fields = ["quiz_name", "quiz_id", "year_level", "school_type"]


class IndividualResultsViewSet(viewsets.ReadOnlyModelViewSet):
    """
    ResultsView API view to manage Results data.

    This view handles retrieving Results data. It returns sample Results data in response to GET requests.

    Attributes:
        permission_classes (list): Defines the permission class, allowing any user access to the view.
        serializer_class (ResultsSerializer): Specifies the serializer used for serializing the Results data.

    Methods:
        - get(request): Handles GET requests. Returns sample data for the Results.
    """

    queryset = QuizAttempt.objects.select_related("quiz", "student__school")
    serializer_class = IndividualResultsSerializer
    filterset_class = IndividualResultsFilter
    filter_backends = [
        DjangoFilterBackend,
        filters.OrderingFilter,
        filters.SearchFilter,
    ]
    search_fields = ["student__user__first_name", "student__user__last_name"]
    ordering_fields = [
        "student__year_level",
        "total_marks",
        "student__school__type",
        "student__school__name",
        "student__user__first_name",
    ]
    ordering = ["-student__year_level"]

    def get_queryset(self):
        queryset = super().get_queryset()
        quiz_id = self.request.query_params.get("quiz_id")
        if quiz_id:
            queryset = queryset.filter(quiz_id=quiz_id)
        return queryset


class TeamResultsFilter(FilterSet):
    quiz_name = ModelChoiceFilter(
        field_name="quiz_attempt__quiz__name",
        queryset=Quiz.objects.all(),
        label="Quiz Name",
        to_field_name="name",
    )
    quiz_id = ModelChoiceFilter(
        queryset=Quiz.objects.all().values_list("id", flat=True),
        label="Quiz ID",
    )
    year_level = ModelChoiceFilter(
        field_name="students__year_level",
        queryset=Student.objects.distinct("year_level").values_list(
            "year_level", flat=True
        ),
        label="Year Level",
        to_field_name="year_level",
    )
    school_type = ChoiceFilter(
        field_name="students__school__type",
        choices=School.SchoolType.choices,
        label="School Type",
    )

    class Meta:
        model = Team
        fields = ["quiz_name", "quiz_id", "year_level", "school_type"]


class TeamResultsViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Team.objects.annotate(
        total_marks=Sum("quiz_attempts__total_marks"),
        max_year=Max(Cast("students__year_level", output_field=BigIntegerField())),
    )
    serializer_class = TeamResultsSerializer
    filterset_class = TeamResultsFilter
    filter_backends = [
        DjangoFilterBackend,
        filters.OrderingFilter,
        filters.SearchFilter,
    ]
    search_fields = ["school__name", "id"]
    ordering_fields = ["total_marks", "max_year", "id", "school__name"]
    ordering = ["-total_marks"]


class InsightsViewSet(viewsets.ReadOnlyModelViewSet):
    # need to define get_queryset, but we don't use
    def get_queryset(self):
        return Student.objects.none()

    def list(self, request, *args, **kwargs):
        quiz_id = self.request.query_params.get("quiz_id")
        all_students = Student.objects.filter(quiz_attempts__quiz_id=quiz_id).distinct() if quiz_id else Student.objects.all()
        scored_students = all_students.filter(quiz_attempts__total_marks__gt=0)
        all_teams = Team.objects.filter(quiz_attempts__quiz_id=quiz_id).distinct() if quiz_id else Team.objects.all()
        scored_team = all_teams.filter(
            students__quiz_attempts__total_marks__gt=0
        ).distinct()

        def get_counts(queryset, category, type):

            if type == "student":
                year_filter = "year_level"
            elif type == "team":
                year_filter = "students__year_level"

            return {
                "category": category,
                "total": queryset.count(),
                "public_count": queryset.filter(school__type="Public").count(),
                "catholic_count": queryset.filter(school__type="Catholic").count(),
                "independent_count": queryset.filter(
                    school__type="Independent"
                ).count(),
                "allies_count": queryset.filter(school__type="Allies").count(),
                "country": queryset.filter(school__is_country=True).count(),
                "year_7": queryset.filter(**{year_filter: "7"}).count(),
                "year_8": queryset.filter(**{year_filter: "8"}).count(),
                "year_9": queryset.filter(**{year_filter: "9"}).count(),
            }

        data = [
            get_counts(all_students, "All Students", "student"),
            get_counts(scored_students, "Students with scores", "student"),
            get_counts(all_teams, "All Teams", "team"),
            get_counts(scored_team, "Teams with scores", "team"),
        ]

        return Response(data, status=status.HTTP_200_OK)


class QuestionAttemptsViewSet(viewsets.ReadOnlyModelViewSet):
    """
    View to retrieve all question attempts for all quiz attempts.
    """

    queryset = QuestionAttempt.objects.all()
    serializer_class = QuestionAttemptsSerializer

    def get_queryset(self):
        queryset = super().get_queryset()
        quiz_id = self.request.query_params.get("quiz_id")
        if quiz_id:
            queryset = queryset.filter(quiz_attempt__quiz_id=quiz_id)
        return queryset
