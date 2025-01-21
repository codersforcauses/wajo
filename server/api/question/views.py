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
    queryset = Question.objects.all()
    serializer_class = QuestionSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    search_fields = ['name']
    filterset_fields = ['mark']

    def create(self, request, *args, **kwargs):
        # validate integrity of name
        name = request.data.get('name')
        if Question.objects.filter(name=name).exists():
            return Response({'error': 'Question with this name already exists'}, status=status.HTTP_400_BAD_REQUEST)
        return super().create(request, *args, **kwargs)

    def perform_update(self, serializer):
        instance = serializer.save(modified_by=self.request.user)
        instance.time_modified = now()
        instance.save()

    @action(detail=False, methods=['get'])
    def search_by_answer(self, request):
        self.search_fields = ['answer']
        return self.list(request)

    # @action(detail=False, methods=['get'])
    # def get_random_question(self, request):
    #     question = Question.objects.order_by("?").first()
    #     serializer = self.get_serializer(question)
    #     return Response(serializer.data)


class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all().order_by("id")
    serializer_class = CategorySerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    search_fields = ['name']

    def create(self, request, *args, **kwargs):
        # validate integrity of genre
        genre = request.data.get('genre')
        if Category.objects.filter(genre=genre).exists():
            return Response({'error': 'Category with this genre already exists'}, status=status.HTTP_400_BAD_REQUEST)
        return super().create(request, *args, **kwargs)
