from rest_framework import viewsets
from .models import Quiz, QuizSlot, QuizAttempt, QuestionAttempt
from rest_framework.decorators import action, permission_classes
from rest_framework.permissions import IsAdminUser, AllowAny
from .serializers import QuizSerializer, QuizSlotSerializer, QuizAttemptSerializer, QuestionAttemptSerializer, AdminQuizSerializer
from rest_framework.response import Response
from rest_framework import status, serializers


@permission_classes([IsAdminUser])
class AdminQuizViewSet(viewsets.ModelViewSet):
    queryset = Quiz.objects.all()
    serializer_class = AdminQuizSerializer
    status = serializers.IntegerField(default=0, required=False)

    @action(detail=True, methods=['get', 'post'])
    def slots(self, request, pk=None):
        if request.method == 'GET':
            self.serializer_class = QuizSlotSerializer
            instance = QuizSlot.objects.filter(quiz_id=pk)
            serializer = QuizSlotSerializer(instance, many=True)
            return Response(serializer.data)
        if request.method == 'POST':
            serializer = QuizSlotSerializer(data=request.data, many=True)
            serializer.is_valid(raise_exception=True)
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)


@permission_classes([AllowAny])
class QuizViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Quiz.objects.filter(status=0, visible=True)
    serializer_class = QuizSerializer


class QuizSlotViewSet(viewsets.ModelViewSet):
    queryset = QuizSlot.objects.all()
    serializer_class = QuizSlotSerializer


class QuizAttemptViewSet(viewsets.ModelViewSet):
    queryset = QuizAttempt.objects.all()
    serializer_class = QuizAttemptSerializer


class QuestionAttemptViewSet(viewsets.ModelViewSet):
    queryset = QuestionAttempt.objects.all()
    serializer_class = QuestionAttemptSerializer
