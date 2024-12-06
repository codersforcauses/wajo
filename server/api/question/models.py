from django.db import models


class Question(models.Model):
    question_id = models.AutoField(primary_key=True)
    question = models.CharField(max_length=200)
    mark = models.FloatField()
    image = models.CharField(max_length=200, blank=True)

    def __str__(self):
        return f'{self.question_id} {self.question} {self.mark}'


class Answer(models.Model):
    answer_id = models.AutoField(primary_key=True)
    question = models.ForeignKey(Question, on_delete=models.CASCADE, blank=True)
    answer = models.FloatField()

    def __str__(self):
        return f'{self.answer_id} {self.question} {self.answer}'
