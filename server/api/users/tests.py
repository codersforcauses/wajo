from rest_framework.test import APITestCase
from rest_framework import status
from django.contrib.auth.models import User
from django.test import TestCase
from .models import School, Student, Teacher


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
            attendent_year=2023,
            year_level="12",
            status='active'
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
        self.school = School.objects.create(name="Test School", code="TS123")
        self.school_data = {'name': 'New School', 'code': 'NS123'}

    def test_get_school_list(self):
        response = self.client.get('/api/user/school/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_create_school(self):
        response = self.client.post(
            '/api/user/school/', self.school_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)


class StudentAPITestCase(APITestCase):

    def setUp(self):
        self.user = User.objects.create_user(
            username='studentuser1', password='password1')
        self.school = School.objects.create(name="Test School", code="TS123")
        self.user_data = {
            'username': 'studentuser2',
            'password': 'password2',
            'email': 'student@example.com',
            "first_name": "Abc",
            "last_name": "De"
        }
        self.student_data = {
            'user': self.user_data,
            'school_id': self.school.id,
            'attendent_year': 2023,
            'year_level': '12',
            'status': 'active'
        }

    def test_get_student_list(self):
        response = self.client.get('/api/user/student/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_create_student(self):
        response = self.client.post(
            '/api/user/student/', self.student_data, format='json')
        if response.status_code == 400:
            print(response.data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)


class TeacherAPITestCase(APITestCase):

    def setUp(self):
        self.user = User.objects.create_user(
            username='teacheruser', password='password')
        self.school = School.objects.create(name="Test School", code="TS123")
        self.teacher_data = {
            'user': {'username': 'newteacher', 'password': 'newpassword', 'email': 'newteacher@example.com'},
            'school_id': self.school.id,
            'phone': '1234567890'
        }

    def test_get_teacher_list(self):
        response = self.client.get('/api/user/teacher/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_create_teacher(self):
        response = self.client.post(
            '/api/user/teacher/', self.teacher_data, format='json')
        if response.status_code == 400:
            print(response.data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
