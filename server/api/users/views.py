from rest_framework import viewsets, status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from .models import School, Student, Teacher
from .serializers import SchoolSerializer, StudentSerializer, TeacherSerializer
from rest_framework.pagination import PageNumberPagination


class Pagination(PageNumberPagination):
    page_size = 5
    page_size_query_param = 'page_size'
    max_page_size = 100


class SchoolViewSet(viewsets.ModelViewSet):
    queryset = School.objects.all()
    serializer_class = SchoolSerializer
    pagination_class = Pagination


class StudentViewSet(viewsets.ModelViewSet):
    queryset = Student.objects.all()
    serializer_class = StudentSerializer
    pagination_class = Pagination


class TeacherViewSet(viewsets.ModelViewSet):
    queryset = Teacher.objects.all()
    serializer_class = TeacherSerializer
    pagination_class = Pagination


@api_view(["GET", "POST"])
def school_list(request):
    if request.method == "GET":
        # Handle GET request: list all schools with pagination
        queryset = School.objects.all()
        paginator = Pagination()
        paginated_queryset = paginator.paginate_queryset(queryset, request)
        serializer = SchoolSerializer(paginated_queryset, many=True)
        return paginator.get_paginated_response(serializer.data)

    elif request.method == "POST":
        # Handle POST request: create a new school
        serializer = SchoolSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(["GET", "PUT", "PATCH", "DELETE"])
def school_detail(request, pk):
    school = get_object_or_404(School, pk=pk)

    if request.method == "GET":
        serializer = SchoolSerializer(school)
        return Response(serializer.data)
    elif request.method in ["PUT", "PATCH"]:
        serializer = SchoolSerializer(
            school, data=request.data, partial=(request.method == "PATCH"))
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    elif request.method == "DELETE":
        school.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


@api_view(["GET", "POST"])
def student_list(request):
    if request.method == "GET":
        # Handle GET request: list all students with pagination
        queryset = Student.objects.all()
        paginator = Pagination()
        paginated_queryset = paginator.paginate_queryset(queryset, request)
        serializer = StudentSerializer(paginated_queryset, many=True)
        return paginator.get_paginated_response(serializer.data)

    elif request.method == "POST":
        # Handle POST request: create a new student
        serializer = StudentSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(["GET", "PUT", "PATCH", "DELETE"])
def student_detail(request, pk):
    student = get_object_or_404(Student, pk=pk)

    if request.method == "GET":
        serializer = StudentSerializer(student)
        return Response(serializer.data)
    elif request.method in ["PUT", "PATCH"]:
        serializer = StudentSerializer(
            student, data=request.data, partial=(request.method == "PATCH"))
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    elif request.method == "DELETE":
        student.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


@api_view(["GET", "POST"])
def teacher_list(request):
    if request.method == "GET":
        # Handle GET request: list all teachers with pagination
        queryset = Teacher.objects.all()
        paginator = Pagination()
        paginated_queryset = paginator.paginate_queryset(queryset, request)
        serializer = TeacherSerializer(paginated_queryset, many=True)
        return paginator.get_paginated_response(serializer.data)

    elif request.method == "POST":
        # Handle POST request: create a new teacher
        serializer = TeacherSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(["GET", "PUT", "PATCH", "DELETE"])
def teacher_detail(request, pk):
    teacher = get_object_or_404(Teacher, pk=pk)

    if request.method == "GET":
        serializer = TeacherSerializer(teacher)
        return Response(serializer.data)
    elif request.method in ["PUT", "PATCH"]:
        serializer = TeacherSerializer(
            teacher, data=request.data, partial=(request.method == "PATCH"))
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    elif request.method == "DELETE":
        teacher.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
