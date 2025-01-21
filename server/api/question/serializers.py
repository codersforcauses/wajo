from rest_framework import serializers
from .models import Question, Category
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
        answer (ListField): The correct answer to the question.
    """
    name = serializers.CharField(max_length=255, required=True)
    created_by = UserSerializer(read_only=True).fields['username']
    modified_by = UserSerializer(read_only=True).fields['username']
    category_ids = serializers.PrimaryKeyRelatedField(
        queryset=Category.objects.all(), write_only=True, required=False, allow_null=True, many=True, source='categories')
    categories = CategorySerializer(read_only=True, many=True)
    is_comp = serializers.BooleanField(required=False, default=False)
    answer = serializers.ListField(
        child=serializers.IntegerField(), default=[1])

    def create(self, validated_data):
        """
        Create a new Question instance.

        Args:
            validated_data (dict): The validated data for the question.

        Returns:
            Question: The created question instance.
        """
        request = self.context.get('request')
        validated_data['created_by'] = request.user
        validated_data['modified_by'] = request.user

        return super().create(validated_data)

    class Meta:
        model = Question
        fields = '__all__'
