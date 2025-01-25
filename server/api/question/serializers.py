from rest_framework import serializers
from .models import Question, Category, Answer
from api.users.serializers import UserSerializer


class CategorySerializer(serializers.ModelSerializer):
    """
    Serializer for the Category model.

    Attributes:
        genre (CharField): The genre of the category.
        info (CharField): Additional information about the category.
    """
    genre = serializers.CharField(max_length=50, required=True)
    info = serializers.CharField(required=False)

    class Meta:
        model = Category
        fields = '__all__'


class AnswerSerializer(serializers.ModelSerializer):

    class Meta:
        model = Answer
        fields = ['value']


class QuestionSerializer(serializers.ModelSerializer):
    """
    Serializer for the Question model.

    Attributes:
        name (CharField): The name of the question.
        created_by (UserSerializer): The user who created the question.
        modified_by (UserSerializer): The user who modified the question.
        category_ids (PrimaryKeyRelatedField): The categories associated with the question.
        categories (CategorySerializer): The categories associated with the question.
        is_comp (BooleanField): Indicates if the question is for competition.
    """
    name = serializers.CharField(max_length=255, required=True)
    created_by = UserSerializer(read_only=True).fields['username']
    modified_by = UserSerializer(read_only=True).fields['username']
    category_ids = serializers.PrimaryKeyRelatedField(
        queryset=Category.objects.all(), write_only=True, required=False, allow_null=True, many=True, source='categories')
    categories = CategorySerializer(read_only=True, many=True)
    is_comp = serializers.BooleanField(required=False, default=False)
    answers = AnswerSerializer(required=False, many=True)
    
    def create(self, validated_data):
        """
        Override the default create method to set the created_by and modified_by fields
        and handle nested answer data.
        """
        request = self.context.get('request')
        validated_data['created_by'] = request.user
        validated_data['modified_by'] = request.user

        answers_data = validated_data.pop('answers', [])

        question = super().create(validated_data)

        for answer_data in answers_data:
            Answer.objects.create(question=question, **answer_data)

        return question

    def update(self, instance, validated_data):
        """
        Override the default update method to set the modified_by field
        and handle nested answer data.
        """
        request = self.context.get('request')
        validated_data['modified_by'] = request.user

        answers_data = validated_data.pop('answers', [])

        instance = super().update(instance, validated_data)

        instance.answers.all().delete()
        for answer_data in answers_data:
            Answer.objects.create(question=instance, **answer_data)
        return instance

    class Meta:
        model = Question
        fields = '__all__'
