# Generated by Django 5.1 on 2025-01-30 08:15

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("quiz", "0009_quizattempt_team"),
        ("team", "0001_initial"),
    ]

    operations = [
        migrations.AddField(
            model_name="quizattempt",
            name="dead_line",
            field=models.DateTimeField(blank=True, default=None, null=True),
        ),
        migrations.AlterField(
            model_name="quizattempt",
            name="team",
            field=models.ForeignKey(
                blank=True,
                default=None,
                null=True,
                on_delete=django.db.models.deletion.CASCADE,
                related_name="quiz_attempts",
                to="team.team",
            ),
        ),
        migrations.AlterField(
            model_name="quizattempt",
            name="time_finish",
            field=models.DateTimeField(blank=True, null=True),
        ),
    ]
