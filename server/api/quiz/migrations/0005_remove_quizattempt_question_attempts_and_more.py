# Generated by Django 5.1 on 2025-01-17 05:23

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('quiz', '0004_rename_grade_quiz_total_marks_and_more'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='quizattempt',
            name='question_attempts',
        ),
        migrations.RemoveField(
            model_name='quizattempt',
            name='sum_grades',
        ),
        migrations.AlterField(
            model_name='quizattempt',
            name='time_finish',
            field=models.DateTimeField(),
        ),
    ]
