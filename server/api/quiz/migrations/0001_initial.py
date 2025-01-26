# Generated by Django 5.1.5 on 2025-01-25 06:23

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('question', '0001_initial'),
        ('users', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Quiz',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False)),
                ('name', models.CharField(max_length=255)),
                ('intro', models.TextField()),
                ('total_marks', models.DecimalField(decimal_places=2, max_digits=5)),
                ('is_comp', models.BooleanField(default=False)),
                ('visible', models.BooleanField(default=False)),
                ('open_time_date', models.DateTimeField(default=None)),
                ('time_limit', models.IntegerField(default=120)),
                ('time_window', models.IntegerField(default=10)),
                ('status', models.IntegerField(default=0)),
            ],
        ),
        migrations.CreateModel(
            name='QuizAttempt',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False)),
                ('current_page', models.IntegerField()),
                ('state', models.IntegerField()),
                ('time_start', models.DateTimeField(auto_now_add=True)),
                ('time_finish', models.DateTimeField(auto_now_add=True)),
                ('time_modified', models.DateTimeField(auto_now=True)),
                ('total_marks', models.IntegerField()),
                ('quiz', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='attempts', to='quiz.quiz')),
                ('student', models.ForeignKey(default=None, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='quiz_attempts', 
                                              to='users.student')),
            ],
        ),
        migrations.CreateModel(
            name='QuestionAttempt',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False)),
                ('answer_student', models.IntegerField(default=None)),
                ('is_correct', models.BooleanField(default=None)),
                ('question', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='attempts', to='question.question')),
                ('student', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='question_attempts', to='users.student')),
                ('quiz_attempt', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='question_attempts', 
                                                   to='quiz.quizattempt')),
            ],
        ),
        migrations.CreateModel(
            name='QuizSlot',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False)),
                ('slot_index', models.IntegerField(db_index=True)),
                ('block', models.IntegerField()),
                ('question', models.ForeignKey(default=None, on_delete=django.db.models.deletion.CASCADE, related_name='slots', 
                                               to='question.question')),
                ('quiz', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='quiz_slots', to='quiz.quiz')),
            ],
        ),
    ]
