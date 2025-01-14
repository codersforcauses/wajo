from rest_framework import serializers
from .models import Question, Category, Answer


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = '__all__'


class AnswerSerializer(serializers.ModelSerializer):
    question = serializers.PrimaryKeyRelatedField(
        queryset=Question.objects.all()
    )

    class Meta:
        model = Answer
        fields = ['id', 'question', 'answer', 'feedback']


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
