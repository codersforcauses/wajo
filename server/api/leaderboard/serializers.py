from rest_framework import serializers
from ..users.models import Student, User
# from ..quizzes.models import Quiz_attempts, Question_attempts 

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['email']

# class QuizAttemptsSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = Quiz_attempts
#         fields = ['timestart', 'timefinish', 'sum_grades']

# class QuestionAttemptsSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = Question_attempts
#         fields = ['score']

class LeaderboardSerializer(serializers.ModelSerializer):
    """
    Serializer for the leaderboard data.

    This serializer is designed for handling student entries in the competition leaderboard. Each entry represents
    an individual student, including their personal information, scores, and participation status.

    The leaderboard:
    - Tracks student details like name, school, email, scores, and status.
    - Enables admin to add, delete, and update entries.
    - Supports data export to a CSV format for record-keeping.

    Fields:
        - student_name (str): Name of the student.
        - school (str): Student's affiliated school.
        - school_email (str): School's contact email.
        - username (str): Unique student identifier.
        - password (str): Student's authentication password.
        - individual_score (int): Score in individual events.
        - team_name (str): Team the student belongs to.
        - team_score (int): Total score of the team.
        - status (str): Participation status (e.g., Active, Inactive).
    """
class LeaderboardSerializer(serializers.ModelSerializer):
    name = serializers.SerializerMethodField()
    school_name = serializers.CharField(source='school.name')
    email = serializers.CharField(source='user.email')
    year_level = serializers.CharField()
    # timestart = serializers.SerializerMethodField()
    # timefinish = serializers.SerializerMethodField()
    # sum_grades = serializers.SerializerMethodField()
    # score = serializers.SerializerMethodField()

    def get_name(self, obj):
        return f"{obj.user.first_name} {obj.user.last_name}".strip()

    # def get_timestart(self, obj):
    #     quiz_attempt = Quiz_attempts.objects.filter(student=obj).first()
    #     return quiz_attempt.timestart if quiz_attempt else None

    # def get_timefinish(self, obj):
    #     quiz_attempt = Quiz_attempts.objects.filter(student=obj).first()
    #     return quiz_attempt.timefinish if quiz_attempt else None

    # def get_sum_grades(self, obj):
    #     quiz_attempt = Quiz_attempts.objects.filter(student=obj).first()
    #     return quiz_attempt.sum_grades if quiz_attempt else None

    # def get_score(self, obj):
    #     question_attempt = Question_attempts.objects.filter(student=obj).first()
    #     return question_attempt.score if question_attempt else None

    class Meta:
        model = Student
        fields = [
            "name",
            "school_name",
            "email",
            "year_level",
            # "timestart",
            # "timefinish",
            # "sum_grades",
            # "score",
        ]
    # TODO: find out if the below TODO is still relevant:
    # TODO: Add functionality to manage leaderboard entries and export data
    # - Implement a function to add a new student entry to the leaderboard.
    # - Implement a function to delete an existing student entry from the leaderboard.
    # - Implement a function to save/modify entries in the leaderboard.
    # - Implement a function to export all entries to a CSV file for record-keeping.
