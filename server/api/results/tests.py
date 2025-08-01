from django.urls import reverse
from rest_framework.test import APITestCase, APIClient
from django.contrib.auth.models import User

from api.quiz.models import Quiz, QuizAttempt
from ..users.models import School, Student
from ..team.models import Team, TeamMember
from datetime import datetime
from dateutil import tz

awst = tz.gettz("Australia/Perth")


class ResultsAPITest(APITestCase):
    def setUp(self):
        self.client = APIClient()

        # Create schools
        self.school1 = School.objects.create(
            name="City High", code="TEST1", type="Public", is_country=False
        )
        self.school2 = School.objects.create(
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
        # Create students
        self.student1 = Student.objects.create(
            user=user1,
            school=self.school1,
            year_level="10",
        )
        self.student2 = Student.objects.create(
            user=user2,
            school=self.school2,
            year_level="11",
        )
        self.student3 = Student.objects.create(
            user=user3,
            school=self.school1,
            year_level="10",
        )

        User.objects.create_user(
            username="testAdmin",
            password="password",
            first_name="Test",
            last_name="Admin",
            is_staff=True,  # Add this line to ensure the user has admin permissions
        )

        self.client.login(username="testAdmin", password="password")

        # create teams
        self.team1 = Team.objects.create(name="Team A", school=self.school1)
        self.team2 = Team.objects.create(name="Team B", school=self.school2)
        # assign students to teams
        TeamMember.objects.create(student=self.student1, team=self.team1)
        TeamMember.objects.create(student=self.student2, team=self.team2)
        TeamMember.objects.create(student=self.student3, team=self.team1)

        print(f"Team A students: {self.team1.students.all()}")
        print(f"Team B students: {self.team2.students.all()}")

        self.quiz1 = Quiz.objects.create(  # Store as instance variable
            name="Test Quiz 1",
            intro="This is test1 quiz.",
            total_marks=100,
            open_time_date=datetime.now(tz=awst)
        )
        self.quiz2 = Quiz.objects.create(  # Store as instance variable
            name="Test Quiz 2",
            intro="This is test2 quiz.",
            total_marks=100,
            open_time_date=datetime.now(tz=awst)
        )

        # Create quiz attempts using the actual quiz instances
        self.quiz_attempt1 = QuizAttempt.objects.create(
            quiz=self.quiz1,
            student=self.student1,
            total_marks=100,
            current_page=1,
            team=self.team1,
        )

        self.quiz_attempt2 = QuizAttempt.objects.create(
            quiz=self.quiz2,
            student=self.student2,
            total_marks=85,
            current_page=2,
            team=self.team2,
        )
        self.quiz_attempt3 = QuizAttempt.objects.create(
            quiz=self.quiz1,
            student=self.student3,
            total_marks=40,
            current_page=3,
            team=self.team1,
        )

        print(f"all quiz attempts: {QuizAttempt.objects.all()}")
        print(f"quiz_attempt1: {self.quiz_attempt1}")
        print(f"quiz_attempt2: {self.quiz_attempt2}")
        print(f"quiz_attempt3: {self.quiz_attempt3}")

    def test_individual_leaderboard_should_list_results(self):
        # Act
        url = reverse("results:individual-list")
        response = self.client.get(url)

        # Assert
        self.assertEqual(response.status_code, 200)
        data = response.json()["results"]
        self.assertEqual(len(data), 3)
        self.assertDictEqual(
            data[0],
            {
                "name": "Sample User",
                "year_level": 11,
                "school": "Outback School",
                "school_type": "Independent",
                "is_country": True,
                "total_marks": 85,
            },
        )

    def test_individual_leaderboard_should_filter_by_school_type(self):
        # Act
        url = reverse("results:individual-list")
        response = self.client.get(url, {"school_type": "Public"})
        # Assert
        self.assertEqual(response.status_code, 200)
        data = response.json()["results"]
        self.assertEqual(len(data), 2)

    def test_individual_leaderboard_should_filter_by_year_level(self):
        # Act
        url = reverse("results:individual-list")
        response = self.client.get(url, {"year_level": 10})

        # Assert
        self.assertEqual(response.status_code, 200)
        data = response.json()["results"]
        self.assertEqual(len(data), 2)

    def test_team_leaderboard_should_list_results(self):
        # Act
        url = reverse("results:team-list")
        response = self.client.get(url, {"quiz_id": self.quiz1.id})
        # Debug output
        if response.status_code != 200:
            print(f"Status Code: {response.status_code}")
            print(f"Response Content: {response.content}")
            print(f"Quiz ID used: {self.quiz1.id}")
        print(f"List Results Response data: {response.json()}")
        # Assert
        self.assertEqual(response.status_code, 200)
        data = response.json()["results"]
        self.assertEqual(len(data), 1)
        self.assertEqual(data[0]["id"], self.team1.id)
        self.assertEqual(data[0]["school"], "City High")
        self.assertEqual(data[0]["is_country"], False)
        self.assertEqual(len(data[0]["students"]), 2)
        self.assertEqual(data[0]["students"][0]["id"], self.student1.id)
        self.assertEqual(data[0]["students"][0]["name"], "Test User1")
        self.assertEqual(data[0]["students"][0]["year_level"], "10")
        self.assertEqual(data[0]["students"][1]["id"], self.student3.id)
        self.assertEqual(data[0]["students"][1]["name"], "Inactive User")
        self.assertEqual(data[0]["students"][1]["year_level"], "10")

    def test_team_leaderboard_should_filter_by_type(self):
        # Act
        url = reverse("results:team-list")
        response = self.client.get(url, {"quiz_id": self.quiz2.id, "school_type": "Independent"})
        # Debug output
        if response.status_code != 200:
            print(f"Status Code: {response.status_code}")
            print(f"Response Content: {response.content}")
            print(f"Quiz ID used: {self.quiz2.id}")
        print(f"Filter by Type Response data: {response.json()}")
        # Assert
        self.assertEqual(response.status_code, 200)
        data = response.json()["results"]
        self.assertEqual(len(data), 1)
        self.assertEqual(data[0]["school"], "Outback School")
