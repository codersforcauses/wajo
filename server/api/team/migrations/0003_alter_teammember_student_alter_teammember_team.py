# Generated by Django 5.1.5 on 2025-01-26 04:26

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("team", "0002_remove_team_grades_teammember_team_students_and_more"),
        ("users", "0002_school_is_country_school_type_student_attendent_year"),
    ]

    operations = [
        migrations.AlterField(
            model_name="teammember",
            name="student",
            field=models.ForeignKey(
                on_delete=django.db.models.deletion.CASCADE,
                related_name="isA",
                to="users.student",
            ),
        ),
        migrations.AlterField(
            model_name="teammember",
            name="team",
            field=models.ForeignKey(
                on_delete=django.db.models.deletion.CASCADE,
                related_name="has",
                to="team.team",
            ),
        ),
    ]
