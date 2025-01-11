from rest_framework.decorators import api_view
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from rest_framework.exceptions import NotFound
from django.shortcuts import get_object_or_404
from .models import Question, Category, Answer
from .serializers import QuestionSerializer, AnswerSerializer, CategorySerializer


class QuestionView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, **kwargs):
        id = kwargs.get('id')  # Check if id is in the URL
        if id:  # If id is present, call get_by_id function
            return self.get_by_id(request, id)
        else:  # If no id, call get_all for all questions
            return self.get_all(request)

    def get_all(self, request):
        questions = Question.objects.all()
        serializer = QuestionSerializer(questions, many=True)
        return Response(serializer.data)

    def get_by_id(self, request, id):
        question = get_object_or_404(Question, id=id)
        serializer = QuestionSerializer(question)
        return Response(serializer.data)

    def post(self, request):
        serializer = QuestionSerializer(data=request.data)
        if serializer.is_valid():
            question = serializer.save()
            return Response(QuestionSerializer(question).data, status=200)
        else:
            return Response(serializer.errors, status=400)

class AnswerView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, **kwargs):
        id = kwargs.get('id')  # Check if id is in the URL
        if id:  # If id is present, call get_by_id function
            return self.get_by_id(request, id)
        else:  # If no id, call get_all for all questions
            return self.get_all(request)

    def get_all(self, request):
        answers = Answer.objects.all()
        serializer = AnswerSerializer(answers, many=True)
        return Response(serializer.data)

    def get_by_id(self, request, id):
        answer = get_object_or_404(Answer, id=id)
        serializer = AnswerSerializer(answer)
        return Response(serializer.data)

    def post(self, request):
        serializer = AnswerSerializer(data=request.data)
        if serializer.is_valid():
            answer = serializer.save()
            return Response(AnswerSerializer(answer).data, status=200)
        else:
            return Response(serializer.errors, status=400)


class CategoryView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, **kwargs):
        id = kwargs.get('id')  # Check if id is in the URL
        if id:  # If id is present, call get_by_id function
            return self.get_by_id(request, id)
        else:  # If no id, call get_all for all questions
            return self.get_all(request)

    def get_all(self, request):
        categories = Category.objects.all()
        serializer = CategorySerializer(categories, many=True)
        return Response(serializer.data)

    def get_by_id(self, request, id):
        category = get_object_or_404(Category, id=id)
        serializer = CategorySerializer(category)
        return Response(serializer.data)

    def post(self, request):
        serializer = CategorySerializer(data=request.data)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=200)
        else:
            return Response(serializer.errors, status=400)

