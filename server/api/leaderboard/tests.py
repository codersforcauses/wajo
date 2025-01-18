from django.urls import reverse
from rest_framework.test import APITestCase, APIClient
from django.contrib.auth.models import User
from ..users.models import School, Student
from ..team.models import Team, TeamMember


class LeaderboardAPITest(APITestCase):
    def setUp(self):
        self.client = APIClient()

        # Arrange
        school1 = School.objects.create(
            name="City High", code="TEST1", type="Public", is_country=False
        )
        school2 = School.objects.create(
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

        student1 = Student.objects.create(
            user=user1,
            school=school1,
            attendent_year=2023,
            year_level="10",
            status="active",
        )
        student2 = Student.objects.create(
            user=user2,
            school=school2,
            attendent_year=2023,
            year_level="11",
            status="active",
        )
        student3 = Student.objects.create(
            user=user3,
            school=school1,
            attendent_year=2022,
            year_level="12",
            status="inactive",
        )

        self.team1 = Team.objects.create(name="Team A", school=school1)
        self.team2 = Team.objects.create(name="Team B", school=school2)

        TeamMember.objects.create(student=student1, team=self.team1)
        TeamMember.objects.create(student=student2, team=self.team2)
        TeamMember.objects.create(student=student3, team=self.team1)

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
                "year_level": "10",
                "school": "City High",
                "school_type": "Public",
                "is_country": False,
            },
        )

    def test_individual_leaderboard_should_filter_by_school_type(self):
        # Act
        url = reverse("leaderboard:individual-list")
        response = self.client.get(url, {"school__type": "Public"})

        # Assert
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(len(data), 2)

    def test_individual_leaderboard_should_filter_by_year_level(self):
        # Act
        url = reverse("leaderboard:individual-list")
        response = self.client.get(url, {"year_level": "10"})

        # Assert
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(len(data), 1)

    def test_individual_leaderboard_should_filter_by_attendent_year(self):
        # Act
        url = reverse("leaderboard:individual-list")
        response = self.client.get(url, {"attendent_year": 2023})

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
        self.assertDictEqual(
            data[0],
            {
                "school": "City High",
                "team_id": str(self.team1.id),
                "is_country": False,
                "students": [
                    {"name": "testuser1", "year_level": "10"},
                    {"name": "inactiveuser", "year_level": "12"},
                ],
            },
        )

    def test_team_leaderboard_should_filter_by_type(self):
        # Act
        url = reverse("leaderboard:team-list")
        response = self.client.get(url, {"school__type": "Independent"})

        # Assert
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(len(data), 1)
        self.assertEqual(data[0]["school"], "Outback School")
