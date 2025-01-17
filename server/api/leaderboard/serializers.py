from rest_framework import serializers

from api.team.models import Team
from api.users.serializers import SchoolSerializer
from ..users.models import Student, User
from ..quiz.models import QuizAttempt

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['email']

# class QuizAttemptsSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = QuizAttempt
#         fields = ['time_start', 'time_finish', 'sum_grades']

# class QuestionAttemptsSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = Question_attempts
#         fields = ['score']

class IndividualLeaderboardSerializer(serializers.ModelSerializer):
    """
    Serializer for the leaderboard data.

    This serializer is designed for handling student entries in the competition leaderboard. Each entry represents
    an individual student, including their personal information, scores, and participation status.
    """
    name = serializers.SerializerMethodField()
    year_level = serializers.CharField()
    school = serializers.StringRelatedField()
    school_type = serializers.CharField(source='school.type')
    is_country = serializers.BooleanField(source='school.is_country')
    # score = TODO

    def get_name(self, obj):
        return f"{obj.user.first_name} {obj.user.last_name}".strip()

    # def get_score(self, obj):
    #     pass

    class Meta:
        model = Student
        fields = [
            "name",
            "year_level",
            "school",
            "school_type",
            "is_country",
            # "score",
        ]

class StudentSerializer(serializers.ModelSerializer):
    name = serializers.StringRelatedField(source='user.username')

    class Meta:
        model = Student
        fields = ['name', 'year_level']

class TeamLeaderboardSerializer(serializers.ModelSerializer):
    """
    Serializer for the leaderboard data.

    This serializer is designed for handling team entries in the competition leaderboard. Each entry represents
    a team, including their members, scores, and participation status.
    """
    school = serializers.StringRelatedField()
    team_id = serializers.UUIDField(source='id')
    # overall_schore = TODO
    is_country = serializers.BooleanField(source='school.is_country')
    students = StudentSerializer(many=True)

    class Meta:
        model = Team
        fields = [
            "school",
            "team_id",
            # "overall_score",
            "is_country",
            "students",
        ]