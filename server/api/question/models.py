from django.db import models
from django.contrib.postgres.fields import ArrayField
import os
import uuid
from django.conf import settings
import base64
from django.utils.timezone import now


class Image(models.Model):
    """
    Represents an image in the system.
    """
    id = models.AutoField(primary_key=True)
    scale = models.IntegerField()
    jax_text = models.TextField(default="")
    url = models.CharField(max_length=255)

    def __str__(self):
        return f"{self.id} {self.url}"

    def save_image_to_local(self, image_data, filename=None):
        """
        Save the image to a local file with a unique name.

        :param image_data: Base64 encoded image data
        :param filename: Optional filename. If not provided, a unique filename will be generated.
        """
        # Decode the base64 image data
        image_data = base64.b64decode(image_data)

        # Generate a unique filename if not provided
        if not filename:
            filename = f'{uuid.uuid4()}.png'

        # Define the path to save the image
        file_path = os.path.join(settings.MEDIA_ROOT, filename)

        # Save the image to the file
        with open(file_path, 'wb') as f:
            f.write(image_data)

        # Update the url field with the file path
        self.url = file_path
        self.save()


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
    time_modified: The timestamp when the question was modified.
    """
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=255, unique=True)
    question_text = models.TextField(default="")
    note = models.TextField(default="")
    # answer to the question
    answer = ArrayField(models.IntegerField(), default=list)
    # detailed answer with explanation
    answer_text = models.TextField(default="")
    categories = models.ManyToManyField(Category, related_name='questions', blank=True)
    created_by = models.ForeignKey(
        'auth.User', on_delete=models.SET_NULL, null=True, blank=True, related_name='questions_created')
    modified_by = models.ForeignKey(
        'auth.User', on_delete=models.SET_NULL, null=True, blank=True, related_name='questions_modified')
    is_comp = models.BooleanField()
    diff_level = models.IntegerField()
    layout = models.TextField(default="")  # Placeholder for layout enum
    image = models.ForeignKey(
        Image, on_delete=models.SET_NULL, null=True, blank=True, related_name='questions', default=None)
    mark = models.IntegerField(default=0)
    time_created = models.DateTimeField(auto_now_add=True)
    time_modified = models.DateTimeField(auto_now=True)

    def save(self, *args, **kwargs):
        if not self.pk:
            self.time_created = now()
        self.time_modified = now()
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.name} {self.question_text}"


class Answer(models.Model):
    id = models.AutoField(primary_key=True)
    question = models.ForeignKey(Question, on_delete=models.CASCADE)
    answer = models.CharField(max_length=100)
    feedback = models.TextField(default="")
    image = models.ForeignKey(Image, on_delete=models.SET_NULL, null=True, blank=True)

    def __str__(self):
        return f"{self.id} {self.question} {self.answer}"
