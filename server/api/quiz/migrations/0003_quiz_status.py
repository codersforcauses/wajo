# Generated by Django 5.1 on 2025-01-18 06:29

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("quiz", "0002_questionattempt"),
    ]

    operations = [
        migrations.AddField(
            model_name="quiz",
            name="status",
            field=models.CharField(
                choices=[
                    ("upcoming", "Upcoming"),
                    ("ongoing", "Ongoing"),
                    ("finished", "Finished"),
                ],
                default="upcoming",
                max_length=10,
            ),
        ),
    ]
