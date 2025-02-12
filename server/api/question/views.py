from rest_framework import viewsets, filters, status
from .serializers import QuestionSerializer, CategorySerializer, AnswerSerializer, ImageSerializer
from .models import Question, Category, Answer, Image
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.decorators import permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAdminUser
from django.utils.timezone import now
from rest_framework.parsers import MultiPartParser, FormParser


@permission_classes([IsAdminUser])
class QuestionViewSet(viewsets.ModelViewSet):
    """
    A viewset for viewing and editing Question instances.Not supported for PATCH requests.

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
    filterset_fields = ['mark', 'answers__value']

    # override the create method
    def create(self, request, *args, **kwargs):
        # validate integrity of name
        name = request.data.get('name')
        if Question.objects.filter(name=name).exists():
            return Response({'error': 'Question with this name already exists'}, status=status.HTTP_400_BAD_REQUEST)
        response = self.handle_answers(request, True)
        return response

    # override the update method
    def update(self, request, *args, **kwargs):
        response = self.handle_answers(request, False)
        return response

    # override the partial_update method to disable PATCH requests
    def partial_update(self, request, *args, **kwargs):
        return Response({'error': 'PATCH method is not allowed'}, status=status.HTTP_405_METHOD_NOT_ALLOWED)

    def perform_update(self, serializer):
        instance = serializer.save(modified_by=self.request.user)
        instance.time_modified = now()
        instance.save()

    def handle_answers(self, request, is_create, *args, **kwargs):
        answers = request.data.get('answers')
        if is_create:
            if not answers or len(answers) == 0:
                return Response({'error': 'Answers field is required'}, status=status.HTTP_400_BAD_REQUEST)
        if isinstance(answers[0], dict):
            if is_create:
                return super().create(request, *args, **kwargs)
            else:
                return super().update(request, *args, **kwargs)
        else:
            answers_list = [{'value': int(answer)} for answer in answers]
            data = request.data.copy()
            data['answers'] = answers_list
            if is_create:
                serializer = self.get_serializer(data=data)
            else:
                instance = self.get_object()
                serializer = self.get_serializer(instance, data=data)
            serializer.is_valid(raise_exception=True)
            self.perform_update(serializer)
            return Response(serializer.data, status=status.HTTP_201_CREATED)

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
    search_fields = ['genre']

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data, many=True)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
        # # validate integrity of genre
        # genre = request.data.get('genre')
        # if Category.objects.filter(genre=genre).exists():
        #     return Response({'error': 'Category with this genre already exists'}, status=status.HTTP_400_BAD_REQUEST)
        # return super().create(request, *args, **kwargs)


class AnswerViewSet(viewsets.ModelViewSet):
    queryset = Answer.objects.all()
    serializer_class = AnswerSerializer


class ImageViewSet(viewsets.ModelViewSet):
    queryset = Image.objects.all()
    serializer_class = ImageSerializer
    parser_classes = [MultiPartParser, FormParser]

    def create(self, request, *args, **kwargs):
        question_id = request.data.get("question")

        # check if the quiz solts already exist, if so, detele them in database
        if Image.objects.filter(question=question_id).exists():
            Image.objects.filter(question=question_id).delete()

        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
