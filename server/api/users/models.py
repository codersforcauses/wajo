from django.contrib.auth.models import User
from django.db import models


class School(models.Model):
    """
    Represents a school in the system.

    Fields:
        id: The primary key for the school.
        name (CharField): The name of the school, up to 100 characters.
        code (CharField): A unique code for the school, up to 10 characters.
        type (CharField): The type of the school (e.g., public, independent, etc.).
        is_country (BooleanField): Indicates if the school is a country (regional) school.
        abbreviation (CharField): The abbreviation of the school, up to 10 characters.
    """

    class SchoolType(models.TextChoices):
        PUBLIC = "Public"
        INDEPENDENT = "Independent"
        CATHOLIC = "Catholic"
        ALLIES = "Allies"

    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=100, unique=True)
    code = models.CharField(max_length=10)
    type = models.TextField(choices=SchoolType.choices, default=SchoolType.PUBLIC)
    is_country = models.BooleanField(default=False)
    abbreviation = models.CharField(max_length=10, default="", blank=True)
    address = models.TextField(default="")

    def student_count(self):
        return self.students.count()

    def __str__(self):
        return f"{self.name}"


class Student(models.Model):
    """
    Represents a student in the system.

    Fields:
        user (OneToOneField): A one-to-one relationship with the User model.
        school (ForeignKey): A many-to-one relationship with the School model.
        year_level (CharField): The level or grade of the student, up to 50 characters.
        created_at (DateTimeField): The timestamp when the student record was created.
    """

    user = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        related_name="student",
    )
    school = models.ForeignKey(
        School, on_delete=models.CASCADE, related_name="students", null=False
    )
    attendent_year = models.IntegerField(default=2025)
    year_level = models.CharField(max_length=50)
    created_at = models.DateTimeField(auto_now_add=True)
    extenstion_time = models.IntegerField(default=0)
    plaintext_password = models.CharField(max_length=100, default="", blank=True)

    def __str__(self):
        return f"{self.user.username}"


class Teacher(models.Model):
    """
    Represents a teacher in the system.

    Fields:
        user (OneToOneField): A one-to-one relationship with the User model.
        school (ForeignKey): A many-to-one relationship with the School model.
        phone (CharField): The teacher's phone number, up to 15 characters. Can be blank.
        email (EmailField): The teacher's email address. Can be blank.
        created_at (DateTimeField): The timestamp when the teacher record was created.
    """

    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="teacher")
    school = models.ForeignKey(
        School, on_delete=models.CASCADE, related_name="teachers", null=False
    )
    phone = models.CharField(max_length=15, blank=True)
    email = models.EmailField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username}"
