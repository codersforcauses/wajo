from rest_framework.views import APIView
from rest_framework.response import Response
from .models import Quiz
from .serializers import QuizSerializer


class QuizListView(APIView):
    def get(self, request):
        quizzes = Quiz.objects.all()
        serializer = QuizSerializer(quizzes, many=True)
        return Response(serializer.data)
