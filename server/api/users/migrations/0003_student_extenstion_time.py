# Generated by Django 5.1.5 on 2025-01-28 07:19

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("users", "0002_school_is_country_school_type_student_attendent_year"),
    ]

    operations = [
        migrations.AddField(
            model_name="student",
            name="extenstion_time",
            field=models.IntegerField(default=0),
        ),
    ]
