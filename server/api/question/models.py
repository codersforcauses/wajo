from django.db import models
from django.contrib.postgres.fields import ArrayField
from django.utils.timezone import now
import os
import uuid
from django.conf import settings
import base64


class Image(models.Model):
    """
    Represents an image in the system.
    """
    id = models.AutoField(primary_key=True)
    scale = models.IntegerField()
    jax_text = models.TextField(default="")
    url = models.CharField(max_length=255)

    def __str__(self):
        return f'{self.id} {self.url}'

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
    diff_level = models.IntegerField()
    genre = models.CharField(max_length=50)
    info = models.TextField(default="")
    is_comp = models.BooleanField()

    def __str__(self):
        return f'{self.id} {self.name} {self.info}'


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
    answer = ArrayField(models.IntegerField(), default=list)  # answer to the question
    answer_text = models.TextField(default="")  # detailed answer with explanation
    category_id = models.ForeignKey(
        Category, on_delete=models.SET_NULL, null=True, blank=True, related_name='questions')
    created_by = models.ForeignKey(
        'auth.User', on_delete=models.SET_NULL, null=True, blank=True, related_name='questions_created')
    modified_by = models.ForeignKey(
        'auth.User', on_delete=models.SET_NULL, null=True, blank=True, related_name='questions_modified')
    layout = models.TextField(default="")  # Placeholder for layout enum
    image = models.ForeignKey(
        Image, on_delete=models.SET_NULL, null=True, blank=True, related_name='questions', default=None)
    mark = models.IntegerField(default=0)
    time_created = models.DateField(auto_now=True)
    time_modified = models.DateField(auto_now=True)

    def save(self, *args, **kwargs):
        self.time_modified = now()
        super().save(*args, **kwargs)

    def genre(self):
        return self.category_id.genre

    @classmethod
    def filter_by_answer(cls, answer):
        """
        Filter questions by the given answer.

        :param answer: The answer(an integer) to filter questions by.
        :return: QuerySet of questions with the given answer.
        """
        return cls.objects.filter(answer=answer)

    def __str__(self):
        return f'{self.name} {self.question_text}'
