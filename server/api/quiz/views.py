from rest_framework import viewsets, mixins
from .models import Quiz, QuizSlot, QuizAttempt, QuestionAttempt
from rest_framework.viewsets import GenericViewSet
from rest_framework.decorators import action, permission_classes
from rest_framework.permissions import IsAdminUser, AllowAny, IsAuthenticated
from .serializers import (QuizSerializer,
                          QuizSlotSerializer, QuizAttemptSerializer, QuestionAttemptSerializer, AdminQuizSerializer, CompQuizSlotSerializer)
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
        The payload data is a list of dictionaries containing the following:
        The slot_index is the order of the question in the quiz.
        The block is the section of the quiz.
        In a competition quiz, the order of the questions is randomized within each block.

        payload data example:

        [
            {
                "question_id": 2,
                "slot_index": 1,
                "quiz_id": 12,
                "block": 1
            },
            {
                "question_id": 2,
                "slot_index": 1,
                "quiz_id": 12,
                "block": 2
            }
        ]
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
        try:
            quiz = Quiz.objects.get(pk=pk)
        except Quiz.DoesNotExist:
            return Response({'error': 'Quiz not exist'}, status=status.HTTP_404_NOT_FOUND)
        if quiz.visible and quiz.status == 0:
            self.serializer_class = QuizSlotSerializer
            instance = QuizSlot.objects.filter(quiz_id=pk)
            serializer = QuizSlotSerializer(instance, many=True)
            return Response(serializer.data)
        else:
            return Response({'error': 'Quiz not exist'}, status=status.HTTP_404_NOT_FOUND)


@permission_classes([IsAuthenticated])
class CompetistionQuizViewSet(viewsets.ReadOnlyModelViewSet):
    """
    A viewset for retrieving competition quizzes that are visible and have a status of 1.
    Need to be tested.

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
        try:
            quiz_instance = Quiz.objects.get(pk=pk)
        except Quiz.DoesNotExist:
            return Response({'error': 'Quiz not exist'}, status=status.HTTP_404_NOT_FOUND)
        user = request.user
        student_id = user.student.id
        existing_attempt = QuizAttempt.objects.filter(
            quiz_id=pk, student_id=student_id).first()
        # if attempt after the quiz has finished:
        is_available = self._is_available(quiz_instance, existing_attempt)
        if quiz_instance.status == 3 and existing_attempt is None:
            return Response({'error': 'Quiz has finished'}, status=status.HTTP_404_NOT_FOUND)
        # check the attemt is available or not
        elif is_available is True:
            return self._get_slots_response(pk, existing_attempt, user)
        else:
            return is_available

    def _is_available(self, quiz, attempt):
        """
        Check if the quiz is available for the user.

        Args:
            quiz_instance (Quiz): The quiz instance.
            attempt (QuizAttempt): The existing quiz attempt.

        Returns:
            bool or Response: True if available, otherwise a Response with an error message.
        """
        # check if the quiz has been withdrawn by the admin
        if quiz.visible:
            current_time = now()
            start_time = quiz.open_time_date
            end_time = start_time + \
                timedelta(minutes=quiz.time_limit) + \
                timedelta(minutes=quiz.time_window)

            # if never attempt before, no attempt instance yet
            if attempt is None:
                if start_time <= current_time <= end_time:
                    return True
                elif current_time < start_time:
                    return Response({'error': 'Quiz has not started yet'}, status=status.HTTP_403_FORBIDDEN)
                elif current_time > end_time:
                    return Response({'error': 'Quiz has ended'}, status=status.HTTP_403_FORBIDDEN)
            # if the user has already attempted the quiz
            else:
                if attempt.is_available:
                    return True
                else:
                    return Response({'error': 'Quiz has finished'}, status=status.HTTP_403_FORBIDDEN)
        # if the quiz has been withdrawn by the admin
        else:
            return Response({'error': 'Quiz not exist'}, status=status.HTTP_404_NOT_FOUND)

    def _get_slots_response(self, quiz_id, existing_attempt, user):
        """
        Get the response containing the slosts data.
        The slots are corresponding sorted questions of the quiz.

        Args:
            quiz_id (int): The primary key of the quiz.
            existing_attempt (QuizAttempt): The existing quiz attempt.
            user (User): The current user.

        Returns:
            Response: The response object containing the slots data.
        """

        if existing_attempt is None:
            quiz_attempt_serializer = QuizAttemptSerializer(data={
                'quiz': quiz_id,
                'student': user.student.id,
                'state': 2,
            })
            quiz_attempt_serializer.is_valid(raise_exception=True)
            attempt = quiz_attempt_serializer.save()
            attempt.is_available
            end_time = attempt.dead_line
        else:
            end_time = existing_attempt.dead_line
        # wrap the end_time into the response
        instances = QuizSlot.objects.filter(quiz_id=quiz_id)
        serializer = CompQuizSlotSerializer(instances, many=True)

        return Response({'data': serializer.data, 'end_time': end_time}, status=status.HTTP_200_OK)


class QuizSlotViewSet(viewsets.ModelViewSet):
    """
    A viewset for managing quiz slots.
    """
    queryset = QuizSlot.objects.all()
    serializer_class = QuizSlotSerializer


@permission_classes([IsAuthenticated])
class QuizAttemptViewSet(viewsets.ModelViewSet):
    """
    A viewset for managing quiz attempts.
    """
    queryset = QuizAttempt.objects.all()
    serializer_class = QuizAttemptSerializer

    def get_queryset(self):
        if hasattr(self.request.user, "student"):
            student_id = self.request.user.student.id
            return QuizAttempt.objects.filter(student_id=student_id)
        elif hasattr(self.request.user, "teacher"):
            return QuizAttempt.objects.filter(student__school=self.request.user.teacher.school.id)
        elif self.request.user.is_staff:
            return QuizAttempt.objects.all()
        else:
            return QuizAttempt.objects.none()

    # def list(self, request, *args, **kwargs):
    #     if request.user.is_staff:
    #         return super().list(request, *args, **kwargs)
    #     else:
    #         return Response({'error': 'You are not authorized to perform this action.'}, status=status.HTTP_403_FORBIDDEN)

    def create(self, request, *args, **kwargs):
        """
        Create a new quiz attempt. Ensure that a user can only have one active attempt per quiz.
        """
        quiz_id = request.data.get('quiz')
        student_id = request.data.get('student')
        existing_attempt = QuizAttempt.objects.filter(
            quiz_id=quiz_id, student_id=student_id).first()
        print(existing_attempt)

        if existing_attempt:
            serializer = self.get_serializer(existing_attempt)
            data = serializer.data
            if not data.is_available:
                return Response({'error': 'Quiz has finished3'}, status=status.HTTP_403_FORBIDDEN)

            # switch cases by state
            match existing_attempt.state:
                case QuizAttempt.State.IN_PROGRESS:
                    # return the existing attempt
                    return Response({'message': 'You already have an active attempt for this quiz.', 'data': data}, status=status.HTTP_200_OK)
                case QuizAttempt.State.SUBMITTED:  # submitted
                    # prevent the user from creating a new attempt
                    return Response({'message': 'You have already submitted this quiz.'}, status=status.HTTP_403_FORBIDDEN)
                case QuizAttempt.State.COMPLETED:  # completed
                    # prevent the user from creating a new attempt
                    return Response({'message': 'The competition has ended.'}, status=status.HTTP_403_FORBIDDEN)
        else:
            return super().create(request, *args, **kwargs)

    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        match instance.state:
            case 2:
                data = request.data.copy()
                if int(data.get('state')) == 3:
                    # set the time_finish to the current time
                    data['time_finish'] = now()

                serializer = self.get_serializer(instance, data=data)
                serializer.is_valid(raise_exception=True)
                instance = serializer.save()

                return Response(serializer.data, status=status.HTTP_200_OK)

            case 3:
                return Response({'error': 'You have already submitted this quiz.'}, status=status.HTTP_403_FORBIDDEN)
            case 4:
                return Response({'error': 'The competition has ended.'}, status=status.HTTP_403_FORBIDDEN)

        # if existing_attempt.state == 2:
        #     existing_attempt.state = 0
        #     existing_attempt.save()
        # existing_attempt.save()
        # return Response({'message': 'Answer updated successfully.'}, status=status.HTTP_200_OK)

        return super().create(request, *args, **kwargs)

    @action(detail=True, methods=['get'])
    def submit(self, request, pk=None):
        """
        Submit the quiz attempt, changing its state to 2 (submitted).
        """
        attempt = self.get_object()
        attempt.state = QuizAttempt.State.SUBMITTED
        attempt.time_finish = now()
        attempt.save()
        return Response({'status': 'Quiz attempt submitted successfully.'})


@permission_classes([IsAuthenticated])
class QuestionAttemptViewSet(mixins.CreateModelMixin,
                             mixins.ListModelMixin,
                             GenericViewSet):
    """
    A viewset for managing question attempts.
    """
    queryset = QuestionAttempt.objects.all()
    serializer_class = QuestionAttemptSerializer

    def get_queryset(self):
        if hasattr(self.request.user, "student"):
            return QuestionAttempt.objects.filter(student=self.request.user.student.id)
        elif self.request.user.is_staff:
            return QuestionAttempt.objects.all()
        else:
            return QuestionAttempt.objects.none()

    def create(self, request, *args, **kwargs):
        """
        Create a new question attempt. Ensure that a user can continue answering questions upon re-login.
        """

        quiz_attempt_id = request.data.get('quiz_attempt')
        comp_attempt = QuizAttempt.objects.get(
            pk=quiz_attempt_id, student_id=request.user.student.id)

        # check if the quiz is available for the user
        if not comp_attempt.is_available:
            return Response({'error': 'Quiz has finished'}, status=status.HTTP_403_FORBIDDEN)

        question_id = request.data.get('question')
        student_id = int(request.data.get('student'))
        # TODO: Uncomment this line when using JWT authentication
        # student_id = request.user.id
        current_user = request.user

        if int(student_id) != int(current_user.student.id) and not current_user.is_staff:
            return Response({'error': 'You are not authorized to perform this action.'}, status=status.HTTP_403_FORBIDDEN)

        existing_attempt = QuestionAttempt.objects.filter(
            quiz_attempt=quiz_attempt_id,
            question=question_id,
            student=student_id
        ).first()

        if existing_attempt:
            # modify the answer
            existing_attempt.answer_student = request.data.get(
                'answer_student')
            existing_attempt.save()
            new_answer = QuestionAttemptSerializer(
                existing_attempt).data['answer_student']
            return Response({'message': 'Answer updated successfully.',
                             'new_answer': new_answer}, status=status.HTTP_200_OK)

        return super().create(request, *args, **kwargs)

    def _is_comp_available(self, quiz_instance):
        # check if the quiz is available for the user
        if quiz_instance.visible:
            current_time = now()
            start_time = quiz_instance.open_time_date
            end_time = start_time + \
                timedelta(minutes=quiz_instance.time_limit) + \
                timedelta(minutes=quiz_instance.time_window)

            if start_time <= current_time <= end_time:
                return True
            elif current_time < start_time:
                return Response({'error': 'Quiz has not started yet'}, status=status.HTTP_403_FORBIDDEN)
            elif current_time > end_time:
                return Response({'error': 'Quiz has finished'}, status=status.HTTP_403_FORBIDDEN)
        else:
            return Response({'error': 'Quiz not exist'}, status=status.HTTP_404_NOT_FOUND)
