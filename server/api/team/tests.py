from django.test import TestCase
from rest_framework import status
from rest_framework.test import APITestCase
from api.users.models import School, Student
from .models import Team, Team_member
from django.contrib.auth.models import User


class TeamModelTest(TestCase):
    def setUp(self):
        # Setup a sample Team object
        self.team = Team.objects.create(
            name="Test Team", description="Test Description", grades=90)

    def test_team_creation(self):
        self.assertEqual(self.team.name, "Test Team")
        self.assertEqual(self.team.grades, 90)

    def test_team_string_representation(self):
        self.assertEqual(str(self.team), f"Team {self.team.id} ({
                         self.team.name}): {self.team.grades}")


class TeamAPITestCase(APITestCase):

    def setUp(self):
        # Create a school
        self.school = School.objects.create(name="Test School", code="TS123")
        # Create a team
        self.team_data = {
            'name': 'Test Team',
            'school_id': self.school.id,
            'description': 'A test team',
            'grades': 90
        }

    def test_create_team(self):
        response = self.client.post(
            '/api/team/', self.team_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_get_team_list(self):
        response = self.client.get('/api/team/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_get_team_detail(self):
        team = Team.objects.create(**self.team_data)
        response = self.client.get(f'/api/team/{team.id}/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_update_team(self):
        team = Team.objects.create(**self.team_data)
        updated_data = {'name': 'Updated Team'}
        response = self.client.patch(
            f'/api/team/{team.id}/', updated_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_delete_team(self):
        team = Team.objects.create(**self.team_data)
        response = self.client.delete(f'/api/team/{team.id}/')
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)


class TeamMemberAPITestCase(APITestCase):

    def setUp(self):
        # Create a school and student
        self.school = School.objects.create(name="Test School", code="TS123")
        self.user = User.objects.create_user(
            username='studentuser', password='password')
        self.student = Student.objects.create(
            user=self.user, school=self.school, attendent_year=2023, year_level='12', status='active')
        # Create a team
        self.team = Team.objects.create(
            name="Test Team", school=self.school, description="A test team", grades=90)
        # Team member data
        self.team_member_data = {
            'student_id': self.student.id,
            'team': self.team.id
        }
        print(self.team_member_data)

    def test_create_team_member(self):
        response = self.client.post(
            '/api/team/member/', self.team_member_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_get_team_member_list(self):
        response = self.client.get('/api/team/member/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_get_team_member_detail(self):
        team_member = Team_member.objects.create(
            student=self.student, team=self.team)
        response = self.client.get(f'/api/team/member/{team_member.id}/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_update_team_member(self):
        team_member = Team_member.objects.create(
            student=self.student, team=self.team)
        updated_data = {'student_id': self.student.id}
        response = self.client.patch(
            f'/api/team/member/{team_member.id}/', updated_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_delete_team_member(self):
        team_member = Team_member.objects.create(
            student=self.student, team=self.team)
        response = self.client.delete(f'/api/team/member/{team_member.id}/')
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
