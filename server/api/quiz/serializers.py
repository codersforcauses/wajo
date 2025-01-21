from rest_framework import serializers
from api.question.models import Question, Category
from api.quiz.models import Quiz, QuizSlot, QuizAttempt, QuestionAttempt


class QuestionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Question
        fields = '__all__'


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = '__all__'


class QuizSlotSerializer(serializers.ModelSerializer):
    question = QuestionSerializer(read_only=True)
    question_id = serializers.PrimaryKeyRelatedField(
        queryset=Question.objects.all(), write_only=True, source='question', required=True, allow_null=True)
    slot_index = serializers.IntegerField(
        required=True, min_value=0, max_value=99)
    quiz_id = serializers.PrimaryKeyRelatedField(
        queryset=Quiz.objects.all(), write_only=True, source='quiz', required=True, allow_null=True)

    # slot_index is unique for each quiz
    def validate(self, data):
        quiz = data['quiz']
        slot_index = data['slot_index']
        if QuizSlot.objects.filter(quiz=quiz, slot_index=slot_index).exists():
            raise serializers.ValidationError(
                "Slot index already exists for this quiz")
        return data

    class Meta:
        model = QuizSlot
        fields = '__all__'
        read_only_fields = ['quiz']


class QuizSerializer(serializers.ModelSerializer):

    class Meta:
        model = Quiz
        fields = '__all__'


class QuizAttemptSerializer(serializers.ModelSerializer):
    class Meta:
        model = QuizAttempt
        fields = '__all__'


class QuestionAttemptSerializer(serializers.ModelSerializer):
    class Meta:
        model = QuestionAttempt
        fields = '__all__'
