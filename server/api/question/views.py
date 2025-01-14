from rest_framework.views import APIView
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from .serializers import QuestionSerializer, AnswerSerializer, CategorySerializer
from django.apps import apps


class GenericView(APIView):
    model_name = None  # defined in subclass, specifies model to use
    serializer_class = None  # defined in subclass, specifies the serializer for the model

    def get(self, request, **kwargs):
        model = apps.get_model(app_label="question", model_name=self.model_name)  # load model based on its name
        obj_id = kwargs.get("id")  # get "id" from url if present

        # if ID exists, get object matching that ID
        if obj_id:
            obj = get_object_or_404(model, id=obj_id)
            serializer = self.serializer_class(obj)
        # if no ID, return all objects
        else:
            queryset = model.objects.all()
            serializer = self.serializer_class(queryset, many=True)

        return Response(serializer.data)

    def post(self, request):
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            obj = serializer.save()
            return Response(self.serializer_class(obj).data, status=200)
        else:
            return Response(serializer.errors, status=400)

    def delete(self, request, **kwargs):
        model = apps.get_model(app_label="question", model_name=self.model_name)
        obj_id = kwargs.get('id')

        if obj_id:
            obj = get_object_or_404(model, id=obj_id)
            obj.delete()
            return Response({"Success": f"{self.model_name} with ID {obj_id} deleted."}, status=200)
        else:
            model.objects.all().delete()
            return Response({"Success": f"All {self.model_name} objects deleted."}, status=200)


class QuestionView(GenericView):
    model_name = "Question"
    serializer_class = QuestionSerializer


class CategoryView(GenericView):
    model_name = "Category"
    serializer_class = CategorySerializer


class AnswerView(GenericView):
    model_name = "Answer"
    serializer_class = AnswerSerializer
