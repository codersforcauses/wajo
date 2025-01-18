from rest_framework import serializers
from .models import Quiz, QuizAttempt, QuizAttemptUser


class QuizSerializer(serializers.ModelSerializer):

    class Meta:
        model = Quiz
        fields = "__all__"


class QuizAttemptSerializer(serializers.ModelSerializer):

    class Meta:
        model = QuizAttempt
        fields = [
            'id',
            'quiz_id',
            'attempt',
            'question_attempts',
            'current_page',
            'state',
            'time_start',
            'time_finish',
            'time_modified',
            'time_modified_offline',
            'sum_grades'
        ]


class QuizAttemptUserSerializer(serializers.ModelSerializer):

    class Meta:
        model = QuizAttemptUser
        fields = [
            'id',
            'quiz_attempt',
            'student_id',
            'grade',
            'time_modified'
        ]
