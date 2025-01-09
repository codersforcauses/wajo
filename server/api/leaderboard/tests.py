from django.urls import reverse
from rest_framework.test import APITestCase, APIClient
from django.contrib.auth.models import User
from ..users.models import School, Student

class LeaderboardAPITest(APITestCase):
    def setUp(self):
        self.client = APIClient()
        self.school1 = School.objects.create(name="Test High", code="TEST1")
        self.school2 = School.objects.create(name="Sample School", code="SAMPLE")

        user1 = User.objects.create_user(username="testuser1", password="password",
                                         first_name="Test", last_name="User1")
        user2 = User.objects.create_user(username="sampleuser", password="password",
                                         first_name="Sample", last_name="User")
        user3 = User.objects.create_user(username="inactiveuser", password="password",
                                         first_name="Inactive", last_name="User")

        self.student1 = Student.objects.create(user=user1, school=self.school1,
                                               attendent_year=2023, year_level="10", status="active")
        self.student2 = Student.objects.create(user=user2, school=self.school2,
                                               attendent_year=2023, year_level="11", status="active")
        self.student3 = Student.objects.create(user=user3, school=self.school1,
                                               attendent_year=2023, year_level="12", status="inactive")

    def test_leaderboard_get(self):
        print("All students in DB:", list(Student.objects.values("id", "status", "year_level")))
        url = reverse("leaderboard:leaderboard")
        response = self.client.get(url)
        print("Response JSON:", url, response.json())
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(len(data), 3)