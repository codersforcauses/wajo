from rest_framework import serializers
from api.question.models import Question, Category
from api.question.serializers import AnswerSerializer, ImageSerializer
from api.quiz.models import Quiz, QuizSlot, QuizAttempt, QuestionAttempt


class QuestionSerializer(serializers.ModelSerializer):
    # answers is a foreign key field, so we need to use a nested serializer
    answers = AnswerSerializer(many=True)
    images = ImageSerializer(read_only=True, many=True)

    class Meta:
        model = Question
        fields = '__all__'


class CompQuestionSerializer(serializers.ModelSerializer):
    """
    Serializer for the Question model with no answer field.
    """
    images = ImageSerializer(read_only=True, many=True)

    class Meta:
        model = Question
        fields = ['id', 'name', 'question_text', 'layout', 'images', 'mark']


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


class CompQuizSlotSerializer(serializers.ModelSerializer):
    question = CompQuestionSerializer(read_only=True)

    class Meta:
        model = QuizSlot
        fields = '__all__'


class QuizSerializer(serializers.ModelSerializer):

    class Meta:
        model = Quiz
        fields = '__all__'


class UserQuizSerializer(serializers.ModelSerializer):
    """
    Serializer for the Quiz model with no is_comp, visible, and status fields.
    """
    class Meta:
        model = Quiz
        exclude = ['is_comp', 'visible', 'status']


class AdminQuizSerializer(serializers.ModelSerializer):
    class Meta:
        model = Quiz
        fields = '__all__'


class QuizAttemptSerializer(serializers.ModelSerializer):
    current_page = serializers.IntegerField(default=0, required=False)
    total_marks = serializers.IntegerField(default=0, required=False)

    class Meta:
        model = QuizAttempt
        fields = '__all__'


class QuestionAttemptSerializer(serializers.ModelSerializer):
    answer_student = serializers.IntegerField(
        default=None, allow_null=True, min_value=0, max_value=999)

    class Meta:
        model = QuestionAttempt
        fields = '__all__'
