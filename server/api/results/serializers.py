from rest_framework import serializers

from api.quiz.models import QuizAttempt, QuestionAttempt
from api.team.models import Team
from ..users.models import Student, User
import uuid


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["email"]


class IndividualResultsSerializer(serializers.ModelSerializer):
    """
    Serializer for the results data.

    This serializer is designed for handling student entries in the competition results. Each entry represents
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


class TeamResultsSerializer(serializers.ModelSerializer):
    """
    Serializer for the results data.

    This serializer is designed for handling team entries in the competition results. Each entry represents
    a team, including their members, scores, and participation status.
    """

    name = serializers.StringRelatedField()
    school = serializers.StringRelatedField()
    is_country = serializers.BooleanField(source="school.is_country")
    students = StudentSerializer(many=True)
    total_marks = serializers.IntegerField()
    max_year = serializers.IntegerField()

    class Meta:
        model = Team
        fields = ["name", "school", "id", "total_marks", "is_country", "students", "max_year"]

    def to_representation(self, instance):
        """Sort students by ID before returning the response."""
        response = super().to_representation(instance)
        response["students"] = sorted(response["students"], key=lambda x: x["id"])
        return response


class QuestionAttemptsSerializer(serializers.ModelSerializer):
    """
    Serializer for the question attempts data.

    This serializer is designed for handling question attempts in the competition results. Each entry represents
    a question attempt, including its details and the student's response.
    """

    quiz_name = serializers.CharField(source="quiz_attempt.quiz.name")
    student_name = serializers.SerializerMethodField()
    student_year_level = serializers.IntegerField(source="student.year_level")
    question_id = serializers.IntegerField(source="question.id")
    question_text = serializers.CharField(source="question.question_text")
    marks_awarded = serializers.SerializerMethodField()

    def get_student_name(self, obj):
        return f"{obj.student.user.first_name} {obj.student.user.last_name}".strip()

    def get_marks_awarded(self, obj):
        return obj.question.mark if obj.is_correct else 0

    class Meta:
        model = QuestionAttempt
        fields = [
            "quiz_name",
            "student_name",
            "student_year_level",
            "question_id",
            "question_text",
            "answer_student",
            "is_correct",
            "marks_awarded",
        ]

    def to_representation(self, instance):
        """Sort question attempts by ID before returning the response."""
        response = super().to_representation(instance)
        response["question_id"] = str(response["question_id"])
        return response

    def validate(self, attrs):
        """
        Validate the incoming data for the serializer.

        This method ensures that the question ID is a valid UUID and that the marks awarded are non-negative.
        """
        question_id = attrs.get("question_id")
        if not isinstance(question_id, str):
            raise serializers.ValidationError("Question ID must be a string.")
        try:
            uuid.UUID(question_id)
        except ValueError:
            raise serializers.ValidationError("Invalid Question ID format.")
        marks_awarded = attrs.get("marks_awarded")
        if marks_awarded < 0:
            raise serializers.ValidationError("Marks awarded cannot be negative.")
        return super().validate(attrs)
