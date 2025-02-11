# Generated by Django 5.1.5 on 2025-01-26 04:26

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("quiz", "0008_merge_20250125_1627"),
        ("team", "0002_remove_team_grades_teammember_team_students_and_more"),
    ]

    operations = [
        migrations.AddField(
            model_name="quizattempt",
            name="team",
            field=models.ForeignKey(
                default=None,
                null=True,
                on_delete=django.db.models.deletion.CASCADE,
                related_name="quiz_attempts",
                to="team.team",
            ),
        ),
    ]
