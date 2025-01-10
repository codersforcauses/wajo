from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import Question
from .serializers import QuestionSerializer, AnswerSerializer


@api_view(["GET"])
def question_list(request):
    questions = Question.objects.all()
    serializer = QuestionSerializer(questions, many=True)
    return Response(serializer.data)


@api_view(["POST"])
def create_question(request):
    serializer = QuestionSerializer(data=request.data)
    if serializer.is_valid():
        question = serializer.save()
        return Response(QuestionSerializer(question).data, status=200)
    else:
        return Response(serializer.errors, status=400)


@api_view(["POST"])
def create_answer(request):
    serializer = AnswerSerializer(data=request.data)
    if serializer.is_valid():
        answer = serializer.save()
        return Response(AnswerSerializer(answer).data, status=200)
    else:
        return Response(serializer.errors, status=400)
