from rest_framework.test import APITestCase
from rest_framework import status
from django.contrib.auth.models import User
from django.test import TestCase
from .models import School, Student, Teacher
from rest_framework_simplejwt.tokens import RefreshToken


class SchoolModelTest(TestCase):

    def setUp(self):
        self.school = School.objects.create(name="Test School", code="TS123")

    def test_school_creation(self):
        self.assertEqual(self.school.name, "Test School")
        self.assertEqual(self.school.code, "TS123")


class StudentModelTest(TestCase):

    def setUp(self):
        self.user = User.objects.create_user(
            username='studentuser', password='password')
        self.school = School.objects.create(name="Test School", code="TS123")
        self.student = Student.objects.create(
            user=self.user,
            school=self.school,
            year_level=2023,


        )

    def test_student_creation(self):
        self.assertEqual(self.student.user.username, "studentuser")
        self.assertEqual(self.student.school.name, "Test School")


class TeacherModelTest(TestCase):

    def setUp(self):
        self.user = User.objects.create_user(
            username='teacheruser', password='password')
        self.school = School.objects.create(name="Test School", code="TS123")
        self.teacher = Teacher.objects.create(
            user=self.user,
            school=self.school,
            phone='1234567890'
        )

    def test_teacher_creation(self):
        self.assertEqual(self.teacher.user.username, "teacheruser")
        self.assertEqual(self.teacher.school.name, "Test School")


class SchoolAPITestCase(APITestCase):
    def setUp(self):
        self.user = User.objects.create_superuser(
            username="admin", password="Password123")
        self.school_data = {'name': 'New School'}

        # Generate JWT token
        refresh = RefreshToken.for_user(self.user)
        self.access_token = str(refresh.access_token)

    def test_get_school_list(self):
        self.client.credentials(
            HTTP_AUTHORIZATION=f'Bearer {self.access_token}')
        response = self.client.get('/api/users/schools/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_create_school(self):
        self.client.credentials(
            HTTP_AUTHORIZATION=f'Bearer {self.access_token}')
        response = self.client.post(
            '/api/users/schools/', self.school_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)


class StudentAPITestCase(APITestCase):

    def setUp(self):
        self.user = User.objects.create_superuser(
            username="admin", password="Password123")
        self.school = School.objects.create(name="Test School")
        self.user_data = {
            'username': 'studentuser2',
            'password': 'password2',


        }
        self.student_data = {

            "first_name": "Abc",
            "last_name": "De",
            'password': 'password2',

            'school_id': self.school.id,
            'year_level': '12',
            'email': 'student@example.com',
        }
        # Generate JWT token
        refresh = RefreshToken.for_user(self.user)
        self.access_token = str(refresh.access_token)

    def test_get_student_list(self):
        self.client.credentials(
            HTTP_AUTHORIZATION=f'Bearer {self.access_token}')
        response = self.client.get('/api/users/students/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_create_student(self):
        self.client.credentials(
            HTTP_AUTHORIZATION=f'Bearer {self.access_token}')
        response = self.client.post(
            '/api/users/students/', self.student_data, format='json')
        if response.status_code == 400:
            print(response.data)

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)


class TeacherAPITestCase(APITestCase):

    def setUp(self):
        self.user = User.objects.create_superuser(
            username="admin", password="Password123")
        self.school = School.objects.create(name="Test School")
        self.teacher_data = {
            "first_name": "Abc",
            "last_name": "De",
            'password': 'password2', 'email': 'newteacher@example.com',
            'school_id': self.school.id,
            'phone': '1234567890'
        }
        # Generate JWT token
        refresh = RefreshToken.for_user(self.user)
        self.access_token = str(refresh.access_token)

    def test_get_teacher_list(self):
        self.client.credentials(
            HTTP_AUTHORIZATION=f'Bearer {self.access_token}')
        response = self.client.get('/api/users/teachers/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_create_teacher(self):
        self.client.credentials(
            HTTP_AUTHORIZATION=f'Bearer {self.access_token}')
        response = self.client.post(
            '/api/users/teachers/', self.teacher_data, format='json')
        if response.status_code == 400:
            print(response.data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
