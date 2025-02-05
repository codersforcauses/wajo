from django.db import models
from django.utils.timezone import now


class Category(models.Model):
    """
    Represents a category in the system.

    id: The primary key for the category.
    diff_level: The difficulty level of the category.
    genre: The genre of the category.
    info: Additional information about the category.
    is_comp: Indicates if the category is for competition.
    """
    id = models.AutoField(primary_key=True)

    genre = models.CharField(max_length=50, unique=True)
    info = models.TextField(default="")

    def __str__(self):
        return f'{self.id} {self.genre} {self.info}'


class Question(models.Model):
    """
    Represents a question in the system.
    id: The primary key for the question.
    name: The name of the question. Unique.
    question_text: The text of the question.
    note: Additional note about the question.
    answer: The correct answer to the question.
    answer_text: Detailed answer with explanation.
    category_id: The category of the question.
    created_by: The user who created the question.
    modified_by: The user who modified the question.
    layout: Placeholder for layout enum.
    image: The image associated with the question.
    mark: The mark for the question.
    time_created: The timestamp when the question was created.
gi    time_modified: The timestamp when the question was modified.
    """
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=255, unique=True)
    question_text = models.TextField(default="")
    note = models.TextField(default="")
    categories = models.ManyToManyField(Category, related_name='questions', blank=True)
    created_by = models.ForeignKey(
        'auth.User', on_delete=models.SET_NULL, null=True, blank=True, related_name='questions_created')
    modified_by = models.ForeignKey(
        'auth.User', on_delete=models.SET_NULL, null=True, blank=True, related_name='questions_modified')
    is_comp = models.BooleanField()
    diff_level = models.IntegerField()
    solution_text = models.TextField(default="")
    layout = models.TextField(default="")  # Placeholder for layout enum
    mark = models.IntegerField(default=0)
    time_created = models.DateTimeField(auto_now_add=True)
    time_modified = models.DateTimeField(auto_now=True)

    def save(self, *args, **kwargs):
        if not self.pk:
            self.time_created = now()
        self.time_modified = now()
        super().save(*args, **kwargs)

    def __str__(self):
        return f'{self.name} {self.question_text}'


class Answer(models.Model):
    id = models.AutoField(primary_key=True)
    question = models.ForeignKey(Question, on_delete=models.CASCADE, related_name="answers")
    value = models.IntegerField()

    def __str__(self):
        return f'{self.question} {self.value}'


class Image(models.Model):
    """
    Represents an image in the system.
    """
    id = models.AutoField(primary_key=True)
    url = models.ImageField(upload_to="images/", blank=True, null=True)
    question = models.ForeignKey(Question, on_delete=models.CASCADE, related_name="images")
