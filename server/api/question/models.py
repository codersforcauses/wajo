from django.db import models
from django.utils.timezone import now


class Image(models.Model):
    id = models.AutoField(primary_key=True)
    scale = models.IntegerField()
    jax_text = models.TextField(default="")
    url = models.CharField(max_length=255)

    def __str__(self):
        return f'{self.id} {self.url}'


class Category(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=50)
    info = models.TextField(default="")
    parent = models.ForeignKey('self', on_delete=models.SET_NULL, null=True, blank=True)
    is_comp = models.BooleanField()

    def __str__(self):
        return f'{self.id} {self.name} {self.info}'


class Question(models.Model):
    id = models.AutoField(primary_key=True)
    parent = models.ForeignKey('self', on_delete=models.SET_NULL, null=True, blank=True)
    name = models.CharField(max_length=255)
    question_text = models.TextField(default="")
    description = models.TextField(default="")
    difficulty = models.CharField(max_length=10, null=True, blank=True, choices=[('EASY', 'Easy'), ('MEDIUM', 'Medium'), ('HARD', 'Hard')])
    category_id = models.ForeignKey(Category, on_delete=models.SET_NULL, null=True, blank=True)
    created_by = models.ForeignKey('auth.User', on_delete=models.SET_NULL, null=True, blank=True, related_name='questions_created')
    modified_by = models.ForeignKey('auth.User', on_delete=models.SET_NULL, null=True, blank=True, related_name='questions_modified')
    layout = models.TextField(default="")  # Placeholder for layout enum
    image = models.ForeignKey(Image, on_delete=models.SET_NULL, null=True, blank=True)
    default_mark = models.IntegerField(default=0)
    time_created = models.DateTimeField(default=now)
    time_modified = models.DateTimeField(null=True, blank=True)

    def save(self, *args, **kwargs):
        self.time_modified = now()
        super().save(*args, **kwargs)

    def __str__(self):
        return f'{self.name} {self.question_text}'


class Answer(models.Model):
    id = models.AutoField(primary_key=True)
    question = models.ForeignKey(Question, on_delete=models.CASCADE)
    answer = models.CharField(max_length=100)
    feedback = models.TextField(default="")
    image = models.ForeignKey(Image, on_delete=models.SET_NULL, null=True, blank=True)

    def __str__(self):
        return f'{self.id} {self.question} {self.answer}'
