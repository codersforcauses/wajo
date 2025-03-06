from django.db import models
from api.users.models import School

# Create your models here.


class Invoice(models.Model):
    id = models.AutoField(primary_key=True)
    date_created = models.DateField()
    address = models.CharField()
    school_name = models.ForeignKey(
        School, on_delete=models.CASCADE, name="school_name"
    )
    amount_of_students = models.IntegerField()
    cost = models.IntegerField()
    subject = models.CharField(max_length=100, default="Registration")

    def __str__(self):
        return f"{self.id} {self.school_name} {self.cost}"
