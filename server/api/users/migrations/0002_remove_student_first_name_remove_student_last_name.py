# Generated by Django 5.1 on 2025-01-16 07:15

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ("users", "0001_initial"),
    ]

    operations = [
        migrations.RemoveField(
            model_name="student",
            name="first_name",
        ),
        migrations.RemoveField(
            model_name="student",
            name="last_name",
        ),
    ]
