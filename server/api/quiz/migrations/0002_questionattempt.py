# Generated by Django 5.1 on 2025-01-18 05:00

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("question", "0002_delete_questionattempt"),
        ("quiz", "0001_initial"),
    ]

    operations = [
        migrations.CreateModel(
            name="QuestionAttempt",
            fields=[
                ("id", models.AutoField(primary_key=True, serialize=False)),
                ("answer_student", models.CharField(max_length=100)),
                ("is_correct", models.BooleanField(default=None)),
                (
                    "question",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="attempts",
                        to="question.question",
                    ),
                ),
                (
                    "quiz_attempt",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="question_attempts",
                        to="quiz.quizattempt",
                    ),
                ),
            ],
        ),
    ]
