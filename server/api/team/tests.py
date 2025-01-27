from django.test import TestCase
from rest_framework import status
from rest_framework.test import APITestCase
from api.users.models import School, Student
from .models import Team, TeamMember
from django.contrib.auth.models import User
from rest_framework_simplejwt.tokens import RefreshToken


class TeamModelTest(TestCase):
    def setUp(self):
        # Setup a sample Team object
        self.team = Team.objects.create(
            name="Test Team", description="Test Description")

    def test_team_creation(self):
        self.assertEqual(self.team.name, "Test Team")

    def test_team_string_representation(self):
        self.assertEqual(str(self.team), f"{self.team.name} ({self.team.id})")


class TeamAPITestCase(APITestCase):

    def setUp(self):
        self.user = User.objects.create_superuser(
            username="admin", password="Password123")
        # Create a school
        self.school = School.objects.create(name="Test School", code="TS123")
        # Create a team
        self.team_data = {
            'name': 'Test Team',
            'school_id': self.school.id,
            'description': 'A test team'
        }
        # Generate JWT token
        refresh = RefreshToken.for_user(self.user)
        self.access_token = str(refresh.access_token)

    def test_create_team(self):
        self.client.credentials(
            HTTP_AUTHORIZATION=f'Bearer {self.access_token}')
        response = self.client.post(
            '/api/team/teams/', self.team_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_get_team_list(self):
        self.client.credentials(
            HTTP_AUTHORIZATION=f'Bearer {self.access_token}')
        response = self.client.get('/api/team/teams/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_get_team_detail(self):
        self.client.credentials(
            HTTP_AUTHORIZATION=f'Bearer {self.access_token}')
        team = Team.objects.create(**self.team_data)
        response = self.client.get(f'/api/team/teams/{team.id}/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_update_team(self):
        self.client.credentials(
            HTTP_AUTHORIZATION=f'Bearer {self.access_token}')
        team = Team.objects.create(**self.team_data)
        updated_data = {'name': 'Updated Team'}
        response = self.client.patch(
            f'/api/team/teams/{team.id}/', updated_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_delete_team(self):
        self.client.credentials(
            HTTP_AUTHORIZATION=f'Bearer {self.access_token}')
        team = Team.objects.create(**self.team_data)
        response = self.client.delete(f'/api/team/teams/{team.id}/')
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)


class TeamMemberAPITestCase(APITestCase):

    def setUp(self):
        self.user = User.objects.create_superuser(
            username="admin", password="Password123")
        # Create a school and student
        self.school = School.objects.create(name="Test School", code="TS123")

        self.student = Student.objects.create(
            user=self.user, school=self.school, year_level='12')
        # Create a team
        self.team = Team.objects.create(
            name="Test Team", school=self.school, description="A test team")
        # Team member data
        self.team_member_data = {
            'student_id': self.student.id,
            'team': self.team.id
        }

        # Generate JWT token
        refresh = RefreshToken.for_user(self.user)
        self.access_token = str(refresh.access_token)

    def test_create_team_member(self):
        self.client.credentials(
            HTTP_AUTHORIZATION=f'Bearer {self.access_token}')
        response = self.client.post(
            '/api/team/team-members/', self.team_member_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_get_team_member_list(self):
        self.client.credentials(
            HTTP_AUTHORIZATION=f'Bearer {self.access_token}')
        response = self.client.get('/api/team/team-members/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_get_team_member_detail(self):
        self.client.credentials(
            HTTP_AUTHORIZATION=f'Bearer {self.access_token}')
        team_member = TeamMember.objects.create(
            student=self.student, team=self.team)
        response = self.client.get(f'/api/team/team-members/{team_member.id}/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_update_team_member(self):
        self.client.credentials(
            HTTP_AUTHORIZATION=f'Bearer {self.access_token}')
        team_member = TeamMember.objects.create(
            student=self.student, team=self.team)
        updated_data = {'student_id': self.student.id}
        response = self.client.patch(
            f'/api/team/team-members/{team_member.id}/', updated_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_delete_team_member(self):
        self.client.credentials(
            HTTP_AUTHORIZATION=f'Bearer {self.access_token}')
        team_member = TeamMember.objects.create(
            student=self.student, team=self.team)
        response = self.client.delete(
            f'/api/team/team-members/{team_member.id}/')
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
