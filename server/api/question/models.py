from django.db import models


# Enum for year level of students
class YearLevel(models.IntegerChoices):
    YEAR_7 = 7, 'Year 7'
    YEAR_8 = 8, 'Year 8'
    YEAR_9 = 9, 'Year 9'


class Category(models.Model):
    category_id = models.AutoField(primary_key=True)
    category_name = models.CharField(max_length=50)
    description = models.CharField(max_length=200)

    def __str__(self):
        return f'{self.category_id} {self.category_name} {self.description}'


class Question(models.Model):
    question_id = models.AutoField(primary_key=True)
    category_id = models.ForeignKey(Category, on_delete=models.SET_NULL, null=True, blank=True)  # Replace with enum if categories predefined?
    year = models.IntegerField()  # year as 4 digit int
    year_level = models.IntegerField(choices=YearLevel.choices)  # year level as int choice from enum YearLevel
    question_content = models.CharField(max_length=200)
    image = models.CharField(max_length=200, blank=True)  # Singe img field, placeholder for Images class
    mark = models.IntegerField()
    solution = models.IntegerField()
    solution_explain = models.CharField(max_length=200, blank=True)

    def __str__(self):
        return f'{self.question_id} {self.question_content} {self.mark}'
