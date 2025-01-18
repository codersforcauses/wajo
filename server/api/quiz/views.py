from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Quiz, QuizAttempt, QuizAttemptUser
from .serializers import QuizSerializer, QuizAttemptSerializer, QuizAttemptUserSerializer
from django.http import Http404
from rest_framework import permissions


class QuizListView(APIView):
    """
    RETRIEVE ALL THE QUIZES OR CREATE A QUIZ
    """

    serializer_class = QuizSerializer

    def get(self, request, format=None):
        quizzes = Quiz.objects.all()
        serializer = QuizSerializer(quizzes, many=True)
        return Response(serializer.data)

    def post(self, request, format=None):
        serializer = QuizSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class QuizList(APIView):

    serialiser_class = QuizSerializer
    permission_classes = (permissions.AllowAny,)
    http_method_names = ['get', 'head', 'post']

    def get_object(self, pk):
        try:
            return Quiz.objects.get(pk=pk)
        except Quiz.DoesNotExist:
            raise Http404


class QuizAttemptList(APIView):
    """
    RETRIEVE ALL THE QUIZ ATTEMPTS
    """

    def get(self, request, format=None):
        quizAttempt = QuizAttempt.objects.all()
        serializer = QuizAttemptSerializer(quizAttempt, many=True)
        return Response(serializer.data)


class QuizAttemptDetail(APIView):
    """
    RETRIEVE UPDATE OR DELETE A QUIZ ATTEMPT
    """

    def get_object(self, pk):
        try:
            return QuizAttempt.objects.get(pk=pk)
        except QuizAttempt.DoesNotExist:
            raise Http404

    def get(self, request, pk, format=None):
        quizAttempt = self.get_object(pk)
        serializer = QuizAttemptSerializer(quizAttempt)
        return Response(serializer.data)

    def put(self, request, pk, format=None):
        quizAttempt = self.get_object(pk)
        serializer = QuizAttemptSerializer(quizAttempt, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk, format=None):
        quizAttempt = self.get_object(pk)
        quizAttempt.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class QuizAttemptUserList(APIView):
    """
    RETRIEVE ALL QUIZ ATTEMPT USERS
    """

    def get(self, request, format=None):
        quizAttemptUser = QuizAttemptUser.objects.all()
        serializer = QuizAttemptUserSerializer(quizAttemptUser, many=True)
        return Response(serializer.data)


class QuizAttemptUserDetail(APIView):
    """
    GET A QUIZ ATTEMPT USER
    """

    def get_object(self, pk):
        try:
            return QuizAttemptUser.objects.get(pk=pk)
        except QuizAttemptUser.DoesNotExist:
            raise Http404

    def get(self, request, pk, format=None):
        QuizAttemptUser = self.get_object(pk)
        serializer = QuizAttemptUserSerializer(QuizAttemptUser)
        return Response(serializer.data)
