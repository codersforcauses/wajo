from django.urls import reverse
from rest_framework.test import APITestCase, APIClient
from django.contrib.auth.models import User

from api.quiz.models import Quiz, QuizAttempt
from ..users.models import School, Student
from ..team.models import Team, TeamMember
from datetime import datetime
from dateutil import tz

awst = tz.gettz('Australia/Perth')


class LeaderboardAPITest(APITestCase):
    def setUp(self):
        self.client = APIClient()

        # Arrange
        city_high_school = School.objects.create(
            name="City High", code="TEST1", type="Public", is_country=False
        )
        outback_school = School.objects.create(
            name="Outback School", code="SAMPLE", type="Independent", is_country=True
        )

        user1 = User.objects.create_user(
            username="testuser1",
            password="password",
            first_name="Test",
            last_name="User1",
        )
        user2 = User.objects.create_user(
            username="sampleuser",
            password="password",
            first_name="Sample",
            last_name="User",
        )
        user3 = User.objects.create_user(
            username="inactiveuser",
            password="password",
            first_name="Inactive",
            last_name="User",
        )

        self.student1 = Student.objects.create(
            user=user1,
            school=city_high_school,
            year_level="10",
        )
        self.student2 = Student.objects.create(
            user=user2,
            school=outback_school,
            year_level="11",
        )
        self.student3 = Student.objects.create(
            user=user3,
            school=city_high_school,
            year_level="10",
        )

        quiz1 = Quiz.objects.create(name="Test Quiz 1", total_marks=100, open_time_date=datetime.now(tz=awst))
        quiz2 = Quiz.objects.create(name="Test Quiz 2", total_marks=100, open_time_date=datetime.now(tz=awst))

        QuizAttempt.objects.create(
            quiz=quiz1,
            student=self.student1,
            total_marks=100,
            current_page=1,
        )
        QuizAttempt.objects.create(
            quiz=quiz2,
            student=self.student2,
            total_marks=85,
            current_page=2,
        )
        QuizAttempt.objects.create(
            quiz=quiz1,
            student=self.student3,
            total_marks=40,
            current_page=3,
        )

        self.team1 = Team.objects.create(name="Team A", school=city_high_school)
        self.team2 = Team.objects.create(name="Team B", school=outback_school)

        TeamMember.objects.create(student=self.student1, team=self.team1)
        TeamMember.objects.create(student=self.student2, team=self.team2)
        TeamMember.objects.create(student=self.student3, team=self.team1)

    def test_individual_leaderboard_should_list_results(self):
        # Act
        url = reverse("leaderboard:individual-list")
        response = self.client.get(url)

        # Assert
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(len(data), 3)
        self.assertDictEqual(
            data[0],
            {
                "name": "Test User1",
                "year_level": 10,
                "school": "City High",
                "school_type": "Public",
                "is_country": False,
                "total_marks": 100,
            },
        )

    def test_individual_leaderboard_should_filter_by_school_type(self):
        # Act
        url = reverse("leaderboard:individual-list")
        response = self.client.get(url, {"school_type": "Public"})

        # Assert
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(len(data), 2)

    def test_individual_leaderboard_should_filter_by_year_level(self):
        # Act
        url = reverse("leaderboard:individual-list")
        response = self.client.get(url, {"year_level": 10})

        # Assert
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(len(data), 2)

    def test_team_leaderboard_should_list_results(self):
        # Act
        url = reverse("leaderboard:team-list")
        response = self.client.get(url)

        # Assert
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(len(data), 2)
        self.assertEqual(data[0]["id"], self.team1.id)
        self.assertEqual(data[0]["school"], "City High")
        self.assertEqual(data[0]["is_country"], False)
        self.assertEqual(len(data[0]["students"]), 2)
        self.assertEqual(data[0]["students"][0]["id"], self.student1.id)
        self.assertEqual(data[0]["students"][0]["name"], "testuser1")
        self.assertEqual(data[0]["students"][0]["year_level"], "10")
        self.assertEqual(data[0]["students"][1]["id"], self.student3.id)
        self.assertEqual(data[0]["students"][1]["name"], "inactiveuser")
        self.assertEqual(data[0]["students"][1]["year_level"], "10")

    def test_team_leaderboard_should_filter_by_type(self):
        # Act
        url = reverse("leaderboard:team-list")
        response = self.client.get(url, {"school_type": "Independent"})

        # Assert
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(len(data), 1)
        self.assertEqual(data[0]["school"], "Outback School")
