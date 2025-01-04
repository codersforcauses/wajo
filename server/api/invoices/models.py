from django.db import models


class Invoice(models.Model):
    invoice_id = models.AutoField(primary_key=True)
    school_id = models.IntegerField()
    quiz_id = models.IntegerField()
    amount = models.FloatField(default=0)
    issued_date = models.DateField(auto_now_add=True)
    due_date = models.DateField("Due Date")
    status = models.CharField(max_length=50)
    number_of_teams = models.IntegerField()

    def __str__(self):
        return f"{self.invoice_id} {self.amount}"
