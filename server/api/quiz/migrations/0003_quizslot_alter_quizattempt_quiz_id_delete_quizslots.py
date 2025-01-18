# Generated by Django 5.1 on 2025-01-11 05:39

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("question", "0001_initial"),
        ("quiz", "0002_remove_quizattemptuser_student_and_more"),
    ]

    operations = [
        migrations.CreateModel(
            name="QuizSlot",
            fields=[
                ("id", models.AutoField(primary_key=True, serialize=False)),
                ("slot", models.IntegerField()),
                (
                    "status",
                    models.CharField(
                        choices=[
                            ("processing", "Processing"),
                            ("submitted", "Submitted"),
                        ]
                    ),
                ),
                ("display_number", models.CharField()),
                ("require_previous", models.BooleanField(default=False)),
                ("block", models.IntegerField()),
                (
                    "question_id",
                    models.ForeignKey(
                        default=None,
                        on_delete=django.db.models.deletion.CASCADE,
                        to="question.question",
                    ),
                ),
                (
                    "quiz_id",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE, to="quiz.quiz"
                    ),
                ),
            ],
        ),
        migrations.AlterField(
            model_name="quizattempt",
            name="quiz_id",
            field=models.ForeignKey(
                on_delete=django.db.models.deletion.CASCADE, to="quiz.quizslot"
            ),
        ),
        migrations.DeleteModel(
            name="QuizSlots",
        ),
    ]
