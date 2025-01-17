from django.test import TestCase
from .models import Team


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
