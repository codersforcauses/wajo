from rest_framework import serializers

from api.quiz.models import QuizAttempt
from api.team.models import Team
from ..users.models import Student, User


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["email"]


class IndividualLeaderboardSerializer(serializers.ModelSerializer):
    """
    Serializer for the leaderboard data.

    This serializer is designed for handling student entries in the competition leaderboard. Each entry represents
    an individual student, including their personal information, scores, and participation status.
    """

    name = serializers.SerializerMethodField()
    year_level = serializers.IntegerField(source="student.year_level")
    school = serializers.StringRelatedField(source="student.school")
    school_type = serializers.CharField(source="student.school.type")
    is_country = serializers.BooleanField(source="student.school.is_country")

    def get_name(self, obj):
        return f"{obj.student.user.first_name} {obj.student.user.last_name}".strip()

    class Meta:
        model = QuizAttempt
        fields = [
            "name",
            "year_level",
            "school",
            "school_type",
            "is_country",
            "total_marks",
        ]


class StudentSerializer(serializers.ModelSerializer):
    name = serializers.SerializerMethodField()

    def get_name(self, obj):
        return f"{obj.user.first_name} {obj.user.last_name}".strip()

    class Meta:
        model = Student
        fields = ["id", "name", "year_level"]


class TeamLeaderboardSerializer(serializers.ModelSerializer):
    """
    Serializer for the leaderboard data.

    This serializer is designed for handling team entries in the competition leaderboard. Each entry represents
    a team, including their members, scores, and participation status.
    """

    school = serializers.StringRelatedField()
    is_country = serializers.BooleanField(source="school.is_country")
    students = StudentSerializer(many=True)
    total_marks = serializers.IntegerField()
    max_year = serializers.IntegerField()

    class Meta:
        model = Team
        fields = [
            "school",
            "id",
            "total_marks",
            "is_country",
            "students",
            "max_year"
        ]

    def to_representation(self, instance):
        """Sort students by ID before returning the response."""
        response = super().to_representation(instance)
        response["students"] = sorted(response["students"], key=lambda x: x["id"])
        return response
