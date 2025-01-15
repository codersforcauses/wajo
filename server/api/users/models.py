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

    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=100)
    code = models.CharField(max_length=10)

    def __str__(self):
        return f"{self.name}"


class Student(models.Model):
    """
    Represents a student in the system.

    Fields:
        user (OneToOneField): A one-to-one relationship with the User model.
        first_name (CharField): The first name of the student, up to 50 characters.
        last_name (CharField): The last name of the student, up to 50 characters.
        school (ForeignKey): A many-to-one relationship with the School model.
        year_level (CharField): The level or grade of the student, up to 50 characters.
        created_at (DateTimeField): The timestamp when the student record was created.
    """

    user = models.OneToOneField(User, on_delete=models.CASCADE)
    first_name = models.CharField(max_length=50)
    last_name = models.CharField(max_length=50)
    school = models.ForeignKey(
        School, on_delete=models.CASCADE, related_name="students")
    year_level = models.CharField(max_length=50)
    created_at = models.DateTimeField(auto_now_add=True)

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

    user = models.OneToOneField(User, on_delete=models.CASCADE)
    school = models.ForeignKey(
        School, on_delete=models.CASCADE, related_name="teachers")
    phone = models.CharField(max_length=15, blank=True)
    email = models.EmailField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username}"
