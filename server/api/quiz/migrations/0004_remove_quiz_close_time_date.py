# Generated by Django 5.1 on 2025-01-21 20:56

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ("quiz", "0003_quiz_time_window"),
    ]

    operations = [
        migrations.RemoveField(
            model_name="quiz",
            name="close_time_date",
        ),
    ]
