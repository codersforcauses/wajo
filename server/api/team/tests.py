from django.test import TestCase
from rest_framework import status
from rest_framework.test import APITestCase
from api.users.models import School
from .models import Team
from django.contrib.auth.models import User
from rest_framework_simplejwt.tokens import RefreshToken


class TeamModelTest(TestCase):
    def setUp(self):
        # Setup a sample Team object
        self.team = Team.objects.create(
            name="Test Team", description="Test Description"
        )

    def test_team_creation(self):
        self.assertEqual(self.team.name, "Test Team")

    def test_team_string_representation(self):
        self.assertEqual(str(self.team), f"{self.team.name} ({self.team.id})")


class TeamAPITestCase(APITestCase):

    def setUp(self):
        self.user = User.objects.create_superuser(
            username="admin", password="Password123"
        )
        # Create a school
        self.school = School.objects.create(name="Test School", code="TS123")
        self.school.save()
        # Create a team
        self.team_data = {
            "name": "Test Team",
            "school_id": self.school.id,
            "description": "A test team",
        }
        # Generate JWT token
        refresh = RefreshToken.for_user(self.user)
        self.access_token = str(refresh.access_token)

    def test_create_team(self):
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {self.access_token}")
        response = self.client.post("/api/team/teams/", [self.team_data], format="json")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_get_team_list(self):
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {self.access_token}")
        response = self.client.get("/api/team/teams/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_get_team_detail(self):
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {self.access_token}")
        team = Team.objects.create(**self.team_data)
        response = self.client.get(f"/api/team/teams/{team.id}/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_update_team(self):
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {self.access_token}")
        team = Team.objects.create(**self.team_data)
        updated_data = {"name": "Updated Team"}
        response = self.client.patch(
            f"/api/team/teams/{team.id}/", updated_data, format="json"
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_delete_team(self):
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {self.access_token}")
        team = Team.objects.create(**self.team_data)
        response = self.client.delete(f"/api/team/teams/{team.id}/")
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
