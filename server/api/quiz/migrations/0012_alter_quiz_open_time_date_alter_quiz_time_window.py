# Generated by Django 5.1.5 on 2025-03-12 02:14

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('quiz', '0011_quiz_created_at_quiz_updated_at'),
    ]

    operations = [
        migrations.AlterField(
            model_name='quiz',
            name='open_time_date',
            field=models.DateTimeField(blank=True, null=True),
        ),
        migrations.AlterField(
            model_name='quiz',
            name='time_window',
            field=models.IntegerField(blank=True, null=True),
        ),
    ]
