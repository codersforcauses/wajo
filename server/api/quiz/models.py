from django.db import models
from api.users.models import Student
from api.question.models import Question


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
       time_limit (Integer): Denotes the time allotted for each quiz.
    """

    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=255)
    intro = models.TextField()
    total_marks = models.DecimalField(max_digits=5, decimal_places=2)
    is_comp = models.BooleanField(default=False)
    visible = models.BooleanField(default=False)
    open_time_date = models.DateTimeField(default=None)
    time_limit = models.IntegerField(default=120)
    time_window = models.IntegerField(default=10)

    # 0 for normal practice, 1 for upcoming, 2 for ongoing, 3 for finished
    status = models.IntegerField(default=0)

    def __str__(self):
        return f"{self.name}"


class QuizSlot(models.Model):
    """Represents a slot in the Quiz. A slot records the order of questions in a quiz.

    Fields:
       id: The primary key for the quiz slots.
       quiz (ForeignKey): relates to the Quiz model.
       question (ForeignKey): relates to the Question model.
       slot (IntegerField): relates to the slot number. A slot records the order of questions in a quiz.
       block (IntegerField): Each quiz is sectioned off into blocks, this number indicates the block number.
    """

    id = models.AutoField(primary_key=True)
    quiz = models.ForeignKey(
        Quiz, on_delete=models.CASCADE, related_name="quiz_slots")
    question = models.ForeignKey(
        Question, on_delete=models.CASCADE, default=None, related_name="slots")
    # an index of the question in the quiz
    slot_index = models.IntegerField(db_index=True)
    block = models.IntegerField()

    def __str__(self):
        return f"{self.id} {self.quiz} {self.question} {self.slot_index}"


class QuizAttempt(models.Model):
    """Represents a quiz attempt in the system

    Fields:
        id: The primary id for the quiz
        quiz (ForeginKey):The id of each particular quiz
        current_page (Integer): This is the current page in the quiz
        state (CharField): state of the attempts. 1 is for unattempted, 2 is for in progress and 3 is for submitted, 4 for completed.
        time_start (DateTimeField): Start time of the attempt
        time_finish (DateTimeField): Finish time of the attempt
        time_modified (DateTimeField):  Last modified time of the quiz
        total_marks (IntegerField): Total marks for a particular quiz attempt

    """

    class State(models.IntegerChoices):
        UNATTEMPTED = 1
        IN_PROGRESS = 2
        SUBMITTED = 3
        COMPLETED = 4

    id = models.AutoField(primary_key=True)
    quiz = models.ForeignKey(
        Quiz, on_delete=models.CASCADE, related_name="attempts")
    student = models.ForeignKey(
        Student, on_delete=models.CASCADE, related_name="quiz_attempts", default=None, null=True
    )
    current_page = models.IntegerField()
    state = models.IntegerField(choices=State.choices, default=State.UNATTEMPTED)
    time_start = models.DateTimeField(auto_now_add=True)
    time_finish = models.DateTimeField(null=True)
    time_modified = models.DateTimeField(auto_now=True)
    total_marks = models.IntegerField()

    def __str__(self):
        return f"{self.id} {self.quiz} "

    def check_all_answer(self):
        for question_attempt in self.question_attempts.all():
            question_attempt.check_answer()
            question_attempt.save()


class QuestionAttempt(models.Model):
    id = models.AutoField(primary_key=True)
    student = models.ForeignKey(
        Student, on_delete=models.CASCADE, related_name="question_attempts")
    question = models.ForeignKey(
        Question, on_delete=models.CASCADE, related_name="attempts")
    quiz_attempt = models.ForeignKey(
        QuizAttempt, on_delete=models.CASCADE, related_name="question_attempts")
    answer_student = models.IntegerField(default=None)
    is_correct = models.BooleanField(default=None)

    def __str__(self):
        return f"{self.id} {self.question_id} {self.quiz_attempt_id}"

    def check_answer(self):
        if self.answer_student == self.question.answer:
            self.is_correct = True
        else:
            self.is_correct = False
