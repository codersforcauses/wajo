from rest_framework import serializers
from .models import Question, Category, Answer


class QuestionCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = '__all__'


class AnswerSerializer(serializers.ModelSerializer):
    question = serializers.PrimaryKeyRelatedField(
        queryset=Question.objects.all()  # Expect a valid Question ID
    )

    class Meta:
        model = Answer
        fields = ['id', 'question', 'answer', 'feedback']

    def create(self, validated_data):
        return Answer.objects.create(**validated_data)


class QuestionSerializer(serializers.ModelSerializer):
    category = serializers.PrimaryKeyRelatedField(
        queryset=Category.objects.all(),
        source="category_id"
    )

    class Meta:
        model = Question
        fields = [
            'id', 'name', 'question_text', 'description',
            'default_mark', 'difficulty', 'category'
        ]

    def create(self, validated_data):
        return Question.objects.create(**validated_data)
