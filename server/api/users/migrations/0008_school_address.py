# Generated by Django 5.1.6 on 2025-07-06 15:11

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("users", "0007_student_plaintext_password"),
    ]

    operations = [
        migrations.AddField(
            model_name="school",
            name="address",
            field=models.TextField(default=""),
        ),
    ]
