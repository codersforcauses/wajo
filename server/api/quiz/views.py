from rest_framework import viewsets
from .models import Quiz, QuizSlot, QuizAttempt, QuestionAttempt
from rest_framework.decorators import action
from .serializers import QuizSerializer, QuizSlotSerializer, QuizAttemptSerializer, QuestionAttemptSerializer
from rest_framework.response import Response
from rest_framework import status


class QuizViewSet(viewsets.ModelViewSet):
    queryset = Quiz.objects.all()
    serializer_class = QuizSerializer

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

            # instance = QuizSlot.objects.filter(quiz_id=pk)

            # get the slot index of the quiz
            # slot_indexes = [slot.slot_index for slot in instance]
            # slot_index = int(data.get('slot_index'))

            # check if the slot index already exists
            # if slot_index in slot_indexes:
            #     return Response({"error": "slot_index already exists"}, status=status.HTTP_400_BAD_REQUEST)


class QuizSlotViewSet(viewsets.ModelViewSet):
    queryset = QuizSlot.objects.all()
    serializer_class = QuizSlotSerializer


class QuizAttemptViewSet(viewsets.ModelViewSet):
    queryset = QuizAttempt.objects.all()
    serializer_class = QuizAttemptSerializer


class QuestionAttemptViewSet(viewsets.ModelViewSet):
    queryset = QuestionAttempt.objects.all()
    serializer_class = QuestionAttemptSerializer
