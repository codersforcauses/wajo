# Generated by Django 5.1.5 on 2025-01-29 07:11

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("users", "0003_student_extenstion_time"),
    ]

    operations = [
        migrations.AddField(
            model_name="school",
            name="abbreviation",
            field=models.CharField(blank=True, default="", max_length=10),
        ),
    ]
