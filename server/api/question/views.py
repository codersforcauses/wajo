from rest_framework import viewsets, filters, status
from .serializers import QuestionSerializer, CategorySerializer
from .models import Question, Category
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.decorators import action, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAdminUser
from django.utils.timezone import now

@permission_classes([IsAdminUser])
class QuestionViewSet(viewsets.ModelViewSet):
    """
    A viewset for viewing and editing Question instances.

    Attributes:
        queryset (QuerySet): The queryset of Question instances.
        serializer_class (Serializer): The serializer class for Question instances.
        filter_backends (list): The filter backends for the viewset.
        search_fields (list): The fields to search in the viewset.
        filterset_fields (list): The fields to filter in the viewset.
    """
    queryset = Question.objects.all()
    serializer_class = QuestionSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    search_fields = ['name']
    filterset_fields = ['mark']

    def create(self, request, *args, **kwargs):
        """
        Create a new Question instance.

        Args:
            request (Request): The request object.

        Returns:
            Response: The response object.
        """
        # validate integrity of name
        name = request.data.get('name')
        if Question.objects.filter(name=name).exists():
            return Response({'error': 'Question with this name already exists'}, status=status.HTTP_400_BAD_REQUEST)
        return super().create(request, *args, **kwargs)

    def perform_update(self, serializer):
        """
        Update an existing Question instance.

        Args:
            serializer (Serializer): The serializer object.
        """
        instance = serializer.save(modified_by=self.request.user)
        instance.time_modified = now()
        instance.save()

    @action(detail=False, methods=['get'])
    def search_by_answer(self, request):
        """
        Search questions by answer.

        Args:
            request (Request): The request object.

        Returns:
            Response: The response object.
        """
        self.search_fields = ['answer']
        return self.list(request)

    # @action(detail=False, methods=['get'])
    # def get_random_question(self, request):
    #     """
    #     Get a random question.
    #
    #     Args:
    #         request (Request): The request object.
    #
    #     Returns:
    #         Response: The response object.
    #     """
    #     question = Question.objects.order_by("?").first()
    #     serializer = self.get_serializer(question)
    #     return Response(serializer.data)


class CategoryViewSet(viewsets.ModelViewSet):
    """
    A viewset for viewing and editing Category instances.

    Attributes:
        queryset (QuerySet): The queryset of Category instances.
        serializer_class (Serializer): The serializer class for Category instances.
        filter_backends (list): The filter backends for the viewset.
        search_fields (list): The fields to search in the viewset.
    """
    queryset = Category.objects.all().order_by("id")
    serializer_class = CategorySerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    search_fields = ['name']

    def create(self, request, *args, **kwargs):
        """
        Create a new Category instance.

        Args:
            request (Request): The request object.

        Returns:
            Response: The response object.
        """
        # validate integrity of genre
        genre = request.data.get('genre')
        if Category.objects.filter(genre=genre).exists():
            return Response({'error': 'Category with this genre already exists'}, status=status.HTTP_400_BAD_REQUEST)
        return super().create(request, *args, **kwargs)
