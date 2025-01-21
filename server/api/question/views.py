from rest_framework import viewsets, filters, status
from .serializers import QuestionSerializer, CategorySerializer
from .models import Question, Category
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.decorators import action, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAdminUser  # ,all


@permission_classes([IsAdminUser])
class QuestionViewSet(viewsets.ModelViewSet):
    queryset = Question.objects.all()
    serializer_class = QuestionSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    search_fields = ['name']
    filterset_fields = ['mark']

    def create(self, request, *args, **kwargs):
        user = request.user
        data = request.data
        data['created_by'] = user.id
        data['modified_by'] = user.id

        try:
            serializer = self.get_serializer(data=data)
            serializer.is_valid(raise_exception=True)
            self.perform_create(serializer)
            print(serializer.data)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        except Exception as error:
            return Response(
                {"error": str(error)},
                status=status.HTTP_400_BAD_REQUEST
            )

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
