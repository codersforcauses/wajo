from django.db import models

# Create your models here.


class Quiz(models.Models):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=255)
    intro = models.TextField()
    grade = models.DecimalField()
    is_comp = models.BooleanField(default=False)
    visible = models.BooleanField(default=False)
    open_time_date = models.DateTimeField()
    close_time_date = models.DateTimeField()
    timelimit = models.IntegerField(max=300)


class QuizSlots(models.Model):
    STATUS_CHOICES = (
        ('processing', 'Processing'),
        ('submitted', 'Submitted'),
    )

    id = models.AutoField(primary_key=True)
    quiz_id = models.ForeignKey(Quiz, on_delete=models.CASCADE)
    question_id = models.ForeignKey('''Question''', on_delete=models.CASCADE)
    slot = models.IntegerField()
    status = models.CharField(choices=STATUS_CHOICES)
    display_number = models.CharField()
    require_previous = models.BooleanField(default=False)
    block = models.IntegerField()


class QuizAttempt(models.Model):
    id = models.AutoField(primary_key=True)
    quiz_id = models.ForeignKey("QuizSlots", on_delete=models.CASCADE)
    attempt = models.IntegerField()
    question_attempts = models.IntegerField()
    current_page = models.IntegerField()
    state = models.CharField(max_length=10)
    time_start = models.DateTimeField(auto_now_add=True)
    time_finish = models.DateTimeField(auto_now_add=True)
    time_modified = models.DateTimeField(auto_now=True)
    time_modified_offline = models.DateTimeField(auto_now=True)
    sum_grades = models.DecimalField(max_digits=10, decimal_places=5)

    def __str__(self):
        return f"{self.id} {self.quiz_id} {self.attempt}"


class QuizAttemptUser(models.Model):
    id = models.AutoField(primary_key=True)
    quiz_attempt = models.ForeignKey("QuizAttempt", on_delete=models.CASCADE)
    student = models.ForeignKey("QuizAttempt", on_delete=models.CASCADE)
    grade = models.DecimalField(max_digits=10, decimal_places=5)
    time_modified = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.id} {self.quiz_attempt} {self.student}"
