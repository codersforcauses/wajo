from rest_framework import viewsets
from .models import Quiz, QuizSlot, QuizAttempt, QuestionAttempt
from rest_framework.decorators import action, permission_classes
from rest_framework.permissions import IsAdminUser, AllowAny
from .serializers import QuizSerializer, QuizSlotSerializer, QuizAttemptSerializer, QuestionAttemptSerializer, AdminQuizSerializer
from rest_framework.response import Response
from rest_framework import status, serializers
from datetime import timedelta
from django.utils.timezone import now


@permission_classes([IsAdminUser])
class AdminQuizViewSet(viewsets.ModelViewSet):
    """
    A viewset for managing quizzes by admin users.

    Methods:
        slots: Retrieve or create slots for a specific quiz.
    """
    queryset = Quiz.objects.all()
    serializer_class = AdminQuizSerializer
    status = serializers.IntegerField(default=0, required=False)

    @action(detail=True, methods=['get', 'post'])
    def slots(self, request, pk=None):
        """
        Retrieve or create slots for a specific quiz.

        Args:
            request (Request): The request object.
            pk (int): The primary key of the quiz.

        Returns:
            Response: The response object containing the slots data.
        """
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
    """
    A viewset for retrieving quizzes that are visible and have a status of 0.

    Methods:
        slots: Retrieve slots for a specific quiz.
    """
    queryset = Quiz.objects.filter(status=0, visible=True)
    serializer_class = QuizSerializer

    @action(detail=True, methods=['get'])
    def slots(self, request, pk=None):
        """
        Retrieve slots for a specific quiz.

        Args:
            request (Request): The request object.
            pk (int): The primary key of the quiz.

        Returns:
            Response: The response object containing the slots data.
        """
        if request.method == 'GET':
            quiz_instance = Quiz.objects.get(pk=pk)
            if quiz_instance.visible and quiz_instance.status == 0:
                self.serializer_class = QuizSlotSerializer
                instance = QuizSlot.objects.filter(quiz_id=pk)
                serializer = QuizSlotSerializer(instance, many=True)
                return Response(serializer.data)
            else:
                return Response({'error': 'Quiz not exist'}, status=status.HTTP_404_NOT_FOUND)


class CompetistionQuizViewSet(viewsets.ReadOnlyModelViewSet):
    """
    A viewset for retrieving competition quizzes that are visible and have a status of 1.

    Methods:
        slots: Retrieve slots for a specific competition quiz.
    """
    queryset = Quiz.objects.filter(status=1, visible=True)
    serializer_class = QuizSerializer

    @action(detail=True, methods=['get'])
    def slots(self, request, pk=None):
        """
        Retrieve slots for a specific competition quiz.

        Args:
            request (Request): The request object.
            pk (int): The primary key of the quiz.

        Returns:
            Response: The response object containing the slots data.
        """
        if request.method == 'GET':
            quiz_instance = Quiz.objects.get(pk=pk)
            current_time = now()
            start_time = quiz_instance.open_time_date
            end_time = start_time + timedelta(minutes=quiz_instance.time_limit)
            print(quiz_instance.visible, quiz_instance.status)

            if quiz_instance.visible and (quiz_instance.status == 1 or quiz_instance.status == 3):

                # check if the quiz is opening
                is_opening = start_time <= current_time <= end_time

                if is_opening:
                    self.serializer_class = QuizSlotSerializer
                    instance = QuizSlot.objects.filter(quiz_id=pk)
                    serializer = QuizSlotSerializer(instance, many=True)
                    return Response(serializer.data)
                elif quiz_instance.status == 3:
                    return Response({'error': 'Quiz has finished'}, status=status.HTTP_404_NOT_FOUND)
                else:
                    return Response({'error': 'Quiz is not accessible at this time'}, status=status.HTTP_403_FORBIDDEN)
            else:
                return Response({'error': 'Quiz not exist'}, status=status.HTTP_404_NOT_FOUND)


class QuizSlotViewSet(viewsets.ModelViewSet):
    """
    A viewset for managing quiz slots.
    """
    queryset = QuizSlot.objects.all()
    serializer_class = QuizSlotSerializer


class QuizAttemptViewSet(viewsets.ModelViewSet):
    """
    A viewset for managing quiz attempts.
    """
    queryset = QuizAttempt.objects.all()
    serializer_class = QuizAttemptSerializer

    def create(self, request, *args, **kwargs):
        """
        Create a new quiz attempt. Ensure that a user can only have one active attempt per quiz.
        """
        quiz_id = request.data.get('quiz')
        student_id = request.data.get('student')
        existing_attempt = QuizAttempt.objects.filter(
            quiz_id=quiz_id, student_id=student_id, state=1).first()

        if existing_attempt:
            return Response({'error': 'You already have an active attempt for this quiz.'}, status=status.HTTP_400_BAD_REQUEST)

        return super().create(request, *args, **kwargs)

    @action(detail=True, methods=['patch'])
    def submit(self, request, pk=None):
        """
        Submit the quiz attempt, changing its state to 2 (submitted).
        """
        attempt = self.get_object()
        attempt.state = 2
        attempt.time_finish = now()
        attempt.save()
        return Response({'status': 'Quiz attempt submitted successfully.'})


class QuestionAttemptViewSet(viewsets.ModelViewSet):
    """
    A viewset for managing question attempts.
    """
    queryset = QuestionAttempt.objects.all()
    serializer_class = QuestionAttemptSerializer

    def create(self, request, *args, **kwargs):
        """
        Create a new question attempt. Ensure that a user can continue answering questions upon re-login.
        """
        quiz_attempt_id = request.data.get('quiz_attempt')
        question_id = request.data.get('question')
        student_id = request.data.get('student')
        # TODO: Uncomment this line when using JWT authentication
        # student_id = request.user.id
        existing_attempt = QuestionAttempt.objects.filter(
            quiz_attempt_id=quiz_attempt_id,
            question_id=question_id,
            student_id=student_id
        ).first()

        if existing_attempt:
            return Response(
                {'error': 'You already have an attempt for this question in the current quiz attempt.'},
                status=status.HTTP_400_BAD_REQUEST)

        return super().create(request, *args, **kwargs)

    @action(detail=True, methods=['patch'])
    def answer(self, request, pk=None):
        """
        Record the answer for a question attempt.
        """
        # TODO: Uncomment this line when using JWT authentication
        # student_id = request.user.id
        question_attempt = self.get_object()
        question_attempt.answer_student = request.data.get('answer_student')
        question_attempt.check_answer()
        question_attempt.save()
        return Response({'status': 'Answer recorded successfully.'})
