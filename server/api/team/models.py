from django.db import models

# from api.quiz.models import Quiz
from api.users.models import School, Student


# Create your models here.


class Team(models.Model):
    name = models.CharField(max_length=100)
    school = models.ForeignKey(
        School, on_delete=models.SET_NULL, null=True, blank=True, related_name="has"
    )
    description = models.CharField(max_length=100)
    time_created = models.DateTimeField(auto_now_add=True)
    # `students` field is used in `/results/serializers.py`
    students = models.ManyToManyField(Student, through="TeamMember")

    def __str__(self):
        return f"{self.name} ({self.id})"


class TeamMember(models.Model):
    student = models.ForeignKey(Student, on_delete=models.CASCADE, related_name="isA")
    team = models.ForeignKey("Team", on_delete=models.CASCADE, related_name="has")
    time_added = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.team} - {self.student}"

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=["student", "team"], name="unique_student_team"
            )
        ]
