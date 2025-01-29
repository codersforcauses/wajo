from django.db import models
# from api.quiz.models import Quiz
from api.users.models import School, Student
import uuid

# Create your models here.


class Team(models.Model):
    """
    Represents a team in the system.

    Fields:
        name (CharField): The name of the team (max length: 100 characters).
        school (ForeignKey): The school the team is associated with.
                            References the School model. Can be null or blank.
        description (CharField): A short description of the team (max length: 100 characters).
        time_created (DateTimeField): The timestamp of when the team was created. Auto-generated.
        grades (IntegerField): The grade or score of the team, represented as an integer.
    Methods:
        __str__: Returns a string representation of the team, showing its ID, name, and grades.
    """
    # quiz = models.ForeignKey(Quiz, on_delete=models.SET_NULL,
    #                          null=True, blank=True, related_name="isAssessedBy")
    name = models.CharField(max_length=100)

    # not sure if this school can work becasue we have school related to student
    school = models.ForeignKey(
        School, on_delete=models.SET_NULL, null=True, blank=True, related_name="has"
    )
    description = models.CharField(max_length=100)
    time_created = models.DateTimeField(auto_now_add=True)
    students = models.ManyToManyField(Student, through="TeamMember")

    def __str__(self):
        return f"{self.name} ({self.id})"


class TeamMember(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
class Team_member(models.Model):
    """
    Represents a member of a team in the system.

    Fields:
        student (ForeignKey): The student associated with this team member.
                              References the Student model.
        team (ForeignKey): The team that the student is part of.
                           References the Team model.
        time_added (DateTimeField): The timestamp of when the student was added to the team.
    Methods:
        __str__: Returns a string representation of the team member, showing the team and student.
    Meta:
        constraints: Ensures that each student can only be part of a specific team once.
    """
    student = models.ForeignKey(Student, on_delete=models.CASCADE,
                                related_name="isA")
    team = models.ForeignKey("Team", on_delete=models.CASCADE,
                             related_name="has")
    time_added = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.team} - {self.student}"

    class Meta:
        """
        Meta options for the Team_member model.

        Attributes:
            constraints: Defines a unique constraint on the (student, team) combination.
                         Ensures that a student can only be added to a team once.
        """
        constraints = [
            models.UniqueConstraint(
                fields=["student", "team"], name="unique_student_team"
            )
                fields=["student", "team"], name="unique_student_team"
            )
        ]
