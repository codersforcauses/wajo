from django.db import models
from api.users.models import Student
from api.question.models import Question

# Create your models here.


class Quiz(models.Model):
    """Represents a Quiz in the System

    Fields:
       id: The primary key for the quiz.
       name (CharField): The name of the quiz.
       intro (TextField): A text field introducing the quiz.
       total_marks (DecimalField): The total marks for each quiz.
       is_comp (BooleanField): Notes whether the quiz is for competition or practice.
       visible (BooleanField): Notes whether the quiz is visible.
       open_time_date (DateTimeField): Notes when the quiz opens.
       close_time_date (DateTimeField): Notes when the quiz closes.
       timelimit (Integer): Denotes the time allotted for each quiz.
    """

    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=255)
    intro = models.TextField()
    total_marks = models.DecimalField(max_digits=5, decimal_places=2)
    is_comp = models.BooleanField(default=False)
    visible = models.BooleanField(default=False)
    open_time_date = models.DateTimeField(default=None)
    close_time_date = models.DateTimeField(default=None)
    timelimit = models.IntegerField(default=120)

    def __str__(self):
        return f"{self.name}"


class QuizSlot(models.Model):
    """Represents a slot in the Quiz.

    Fields:
       id: The primary key for the quiz slots.
       quiz_id (ForeignKey): relates to the Quiz model.
       question_id (ForeignKey): relates to the Question model.
       slot (IntegerField): relates to the slot number.
       block (IntegerField): Each quiz is sectioned off into blocks, this number indicates the block number.
    """

    id = models.AutoField(primary_key=True)
    quiz_id = models.ForeignKey(Quiz, on_delete=models.CASCADE)
    question_id = models.ForeignKey(Question, on_delete=models.CASCADE, default=None)
    slot = models.IntegerField()  # an index of the question in the quiz
    block = models.IntegerField()

    def __str__(self):
        return f"{self.id} {self.quiz_id} {self.status}"


class QuizAttempt(models.Model):
    """Represents a quiz attempt in the system

    Fields:
        id: The primary id for the quiz
        quiz_id (ForeginKey):The id of each particular quiz
        current_page (Integer): This is the current page in the quiz
        state (CharField): state of the attempts. 1 is for unattempted, 2 is for in progress and 3 is for completed.
        time_start (DateTimeField): Start time of the attempt
        time_finish (DateTimeField): Finish time of the attempt
        time_modified (DateTimeField):  Last modified time of the quiz
        total_marks (IntegerField): Total marks for a particular quiz attempt

    """

    id = models.AutoField(primary_key=True)
    quiz_id = models.ForeignKey(Quiz, on_delete=models.CASCADE)
    student_id = models.ForeignKey(
        Student, on_delete=models.CASCADE, related_name="student_id", default=None
    )
    current_page = models.IntegerField()
    state = models.IntegerField()
    time_start = models.DateTimeField(auto_now_add=True)
    time_finish = models.DateTimeField(auto_now_add=True)
    time_modified = models.DateTimeField(auto_now=True)
    total_marks = models.IntegerField(max_digits=10, decimal_places=5)

    def __str__(self):
        return f"{self.id} {self.quiz_id} {self.attempt}"
