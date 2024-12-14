from django.contrib.auth.models import User
from django.db import models


class School(models.Model):
    school_id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=100, blank=True)
    code = models.CharField(max_length=10)

    def __str__(self):
        return f"School {self.name}"


class Student(models.Model):
    STATUS_CHOICES = (
        ('active', 'Active'),
        ('inactive', 'Inactive'),
    )
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    school_id = models.ForeignKey(
        School, on_delete=models.CASCADE, related_name="students")
    attendent_year = models.IntegerField()
    year_level = models.CharField(max_length=50)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    status = models.CharField(
        max_length=10, choices=STATUS_CHOICES, default='active')

    def __str__(self):
        return f"Student: {self.user.username} - {self.school.name}"


class Teacher(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    school_id = models.ForeignKey(
        School, on_delete=models.CASCADE, related_name="teachers")
    phone = models.CharField(max_length=15, blank=True)

    def __str__(self):
        return f"Teacher: {self.user.username} - {self.school.code}"
