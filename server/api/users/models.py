from django.contrib.auth.models import User
from django.db import models


class School(models.Model):
    """
    Represents a school in the system.

    Fields:
        id: The primary key for the school.
        name (CharField): The name of the school, up to 100 characters.
        code (CharField): A unique code for the school, up to 10 characters.

    """

    class SchoolType(models.TextChoices):
        PUBLIC = "Public"
        INDEPENDENT = "Independent"
        CATHOLIC = "Catholic"

    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=100)
    code = models.CharField(max_length=10)
    type = models.TextField(choices=SchoolType.choices)
    is_country = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.name}"


class Student(models.Model):
    """
    Represents a student in the system.

    Fields:
        user (OneToOneField): A one-to-one relationship with the User model.
        school (ForeignKey): A many-to-one relationship with the School model.
        attendent_year (IntegerField): The year the student attended.
        year (CharField): The level or grade of the student, up to 50 characters.
        created_at (DateTimeField): The timestamp when the student record was created.
        updated_at (DateTimeField): The timestamp when the student record was last updated.
        status (CharField): The current status of the student (active/inactive).
    """

    STATUS_CHOICES = (
        ("active", "Active"),
        ("inactive", "Inactive"),
    )
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    school = models.ForeignKey(
        School, on_delete=models.CASCADE, related_name="students"
    )
    attendent_year = models.IntegerField()
    year_level = models.CharField(max_length=50)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default="active")

    def __str__(self):
        return f"{self.user.username}"


class Teacher(models.Model):
    """
    Represents a teacher in the system.

    Fields:
        user (OneToOneField): A one-to-one relationship with the User model.
        school (ForeignKey): A many-to-one relationship with the School model.
        phone (CharField): The teacher's phone number, up to 15 characters. Can be blank.
    """

    user = models.OneToOneField(User, on_delete=models.CASCADE)
    school = models.ForeignKey(
        School, on_delete=models.CASCADE, related_name="teachers"
    )
    phone = models.CharField(max_length=15, blank=True)

    def __str__(self):
        return f"{self.user.username}"
