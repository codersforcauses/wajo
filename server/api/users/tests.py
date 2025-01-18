from django.urls import reverse
from rest_framework.test import APITestCase, APIClient
from django.contrib.auth.models import User
from .models import School, Student
from .serializers import UserSerializer, SchoolSerializer, StudentSerializer

# dont push this, just testing out the tests


class UserAPITest(APITestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(
            username="joe",
            password="pass",
            first_name="Joe",
            last_name="Tester",
            email="joe@example.com",
        )

    def test_user_serialization(self):
        data = UserSerializer(self.user).data
        self.assertEqual(data["username"], "joe")
        self.assertEqual(data["email"], "joe@example.com")
        self.assertEqual(data["first_name"], "Joe")
        self.assertEqual(data["last_name"], "Tester")


class SchoolAPITest(APITestCase):
    def setUp(self):
        self.client = APIClient()
        self.school = School.objects.create(name="School A", code="SCH-A")

    def test_school_serialization(self):
        data = SchoolSerializer(self.school).data
        self.assertEqual(data["name"], "School A")
        self.assertEqual(data["code"], "SCH-A")


class StudentAPITest(APITestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(
            username="sally", password="pass123", first_name="Sally", last_name="Tester"
        )
        self.school = School.objects.create(name="School B", code="SCH-B")
        self.student = Student.objects.create(
            user=self.user,
            school=self.school,
            attendent_year=2023,
            year_level="12",
            status="active",
        )

    def test_student_serialization(self):
        data = StudentSerializer(self.student).data
        self.assertEqual(data["id"], self.student.id)
        self.assertEqual(data["user"]["username"], "sally")
        self.assertEqual(data["school"]["name"], "School B")
        self.assertEqual(data["attendent_year"], 2023)
        self.assertEqual(data["year_level"], "12")
        self.assertEqual(data["status"], "active")
