from django.forms import ValidationError
from rest_framework import serializers

from api.quiz.models import QuizAttempt, QuestionAttempt, QuizSlot
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


class StudentWithScoreSerializer(serializers.ModelSerializer):
    name = serializers.SerializerMethodField()
    student_score = serializers.IntegerField(read_only=True)

    class Meta:
        model = Student
        fields = ['id', 'name', 'year_level', 'student_score']

    def get_name(self, obj):
        return f"{obj.user.first_name} {obj.user.last_name}" if obj.user.first_name else obj.user.username


class TeamListSerializer(serializers.ModelSerializer):

    name = serializers.StringRelatedField()
    school = serializers.StringRelatedField()
    students = serializers.SerializerMethodField()
    total_marks = serializers.IntegerField()

    class Meta:
        model = Team
        fields = ["name", "school", "id", "total_marks", "students",]

    def get_students(self, obj):
        quiz_id = self.context.get('quiz_id')
        students_with_scores = []

        for student in obj.students.all():
            # Get the student's score for this quiz
            attempt = QuizAttempt.objects.filter(
                student=student,
                quiz_id=quiz_id
            ).first()

            student_score = attempt.total_marks if attempt else 0

            # Add the score to the student data
            student_data = {
                'id': student.id,
                'name': f"{student.user.first_name} {student.user.last_name}" if student.user.first_name else student.user.username,
                'year_level': student.year_level,
                'student_score': student_score
            }
            students_with_scores.append(student_data)

        return students_with_scores

    def to_representation(self, instance):
        """Sort students by ID before returning the response."""
        response = super().to_representation(instance)
        response["students"] = sorted(response["students"], key=lambda x: x["id"])
        return response


class QuestionAttemptSerializer(serializers.ModelSerializer):
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


class QuizAttemptSerializer(serializers.ModelSerializer):
    """
    Serializer for the quiz attempt data.

    This serializer is designed for handling quiz attempts in the competition results. Each entry represents
    a quiz attempt, including its details and the student's score.
    """

    username = serializers.SerializerMethodField()
    student_firstname = serializers.SerializerMethodField()
    student_lastname = serializers.SerializerMethodField()
    state = serializers.SerializerMethodField()
    started_on = serializers.DateTimeField(source="time_start", allow_null=True)
    completed = serializers.DateTimeField(source="time_finish", allow_null=True)
    time_taken = serializers.SerializerMethodField()
    student_responses = serializers.SerializerMethodField()
    student_year_level = serializers.IntegerField(source="student.year_level")
    total_marks = serializers.IntegerField()

    def get_username(self, obj):
        return obj.student.user.username

    def get_student_firstname(self, obj):
        return f"{obj.student.user.first_name}".strip()

    def get_student_lastname(self, obj):
        return f"{obj.student.user.last_name}".strip()

    def get_state(self, obj):
        # Map the state of the quiz attempt to a readable format

        def map_state(state):
            state_mapping = {
                1: "Unattempted",
                2: "In Progress",
                3: "Submitted",
                4: "Completed",
            }
            return state_mapping.get(state)
        return map_state(obj.state)

    def get_time_taken(self, obj):
        if obj.time_start and obj.time_finish:
            return obj.time_finish - obj.time_start
        return None

    def get_student_responses(self, obj):
        """
        Get student responses for a specific quiz.
        This function retrieves the responses of each student for a given quiz.
        """
        quiz_id = self.context.get('quiz_id')
        if not quiz_id:
            raise serializers.ValidationError({"quiz_id": "Quiz ID is required to fetch student responses."})
        # queryset = queryset.prefetch_related("question_attempts")
        # all_students = Student.objects.filter(quiz_attempts__quiz_id=quiz_id).distinct() if quiz_id else Student.objects.all()
        student = obj.student
        if not student:
            raise serializers.ValidationError({"student_id": "Student ID is required to fetch responses."})

        # results = []
        # for student in all_students:
        try:
            student_id = int(student.id)
        except ValueError:
            raise ValidationError({"student_id": "Invalid student_id. Must be an integer."})

        # Get the quiz attempts for the student
        quiz_attempts = QuizAttempt.objects.filter(student_id=student_id, quiz=quiz_id)
        # Get the first quiz attempt for the student
        quiz_attempt = quiz_attempts.first()

        # Prepare the student responses dictionary
        student_responses = {
            # "student_id": student_id,
            # "student_lastname": f"{student.user.last_name}" if student.user.last_name else student.user.username,
            # "student_firstname": f"{student.user.first_name}" if student.user.first_name else "",
            # "state": map_state(quiz_attempt.state) if quiz_attempt else "",
            # "started_on": quiz_attempt.time_start if quiz_attempt else None,
            # "completed": quiz_attempt.time_finish if quiz_attempt else None,
            # "time_taken": quiz_attempt.time_finish - quiz_attempt.time_start,
            # "year_level": student.year_level,
            # "total_marks": quiz_attempt.total_marks if quiz_attempt else 0,
            # "responses": {},
        }
        # Iterate through the quiz slots to get the student's responses
        for slot in QuizSlot.objects.filter(quiz_id=quiz_id).order_by("quiz_question_id"):
            question_id = slot.quiz_question_id
            # Get the student's response for the question
            response = QuestionAttempt.objects.filter(
                quiz_attempt=quiz_attempt,
                question=slot.question,
                student_id=student_id
            ).first()
            if response:
                student_responses[question_id] = response.answer_student
            else:
                student_responses[question_id] = None
        # results.append(student_responses)
        # return results
        return student_responses

    class Meta:
        model = QuizAttempt
        fields = [
            "id",
            "username",
            "student_firstname",
            "student_lastname",
            "state",
            "started_on",
            "completed",
            "time_taken",
            "student_responses",
            "student_year_level",
            "total_marks",
        ]
