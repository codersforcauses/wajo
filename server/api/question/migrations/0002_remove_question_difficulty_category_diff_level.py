# Generated by Django 5.1 on 2025-01-17 05:23

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('question', '0001_initial'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='question',
            name='difficulty',
        ),
        migrations.AddField(
            model_name='category',
            name='diff_level',
            field=models.IntegerField(default=0),
        ),
    ]
