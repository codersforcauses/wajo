from django.db import models
from django.contrib.auth.models import User
from api.quiz.models import Quiz
from api.users.models import School
import uuid

# Create your models here.


class Team(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    quiz = models.ForeignKey(Quiz, on_delete=models.SET_NULL,
                             null=True, blank=True, related_name="isAssessedBy")
    name = models.CharField(max_length=100)
    school = models.ForeignKey(
        School, on_delete=models.SET_NULL, null=True, blank=True, related_name="has")
    description = models.CharField(max_length=100)
    time_created = models.DateTimeField(auto_now_add=True)
    grades = models.IntegerField()

    def __str__(self):
        # Format when printed: Team ID (Name): Grade
        return f"Team {self.id} ({self.name}): {self.grades}"


class Team_member(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    student = models.ForeignKey(User, on_delete=models.SET_NULL,
                                null=True, blank=True, related_name="isA")
    team = models.ForeignKey("Team", on_delete=models.SET_NULL,
                             null=True, blank=True, related_name="has")
    time_added = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        # Format when printed: Team ID has member student
        return f"Team {self.id} has member {self.student}"

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=["student", "team"], name="unique_student_team")
        ]
