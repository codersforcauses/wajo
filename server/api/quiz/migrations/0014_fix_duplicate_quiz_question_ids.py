from django.db import migrations, models


def fix_duplicate_quiz_question_ids(apps, schema_editor):
    QuizSlot = apps.get_model('quiz', 'QuizSlot')

    # Get all quiz_ids
    quiz_ids = QuizSlot.objects.values_list('quiz_id', flat=True).distinct()
    for quiz_id in quiz_ids:
        # Get all slots for this quiz, ordered by id
        slots = QuizSlot.objects.filter(quiz_id=quiz_id).order_by('id')
        used_ids = set()
        for slot in slots:
            # If this quiz_question_id is already used, assign a new unique one
            if slot.quiz_question_id in used_ids or slot.quiz_question_id is None:
                # Find the next available quiz_question_id
                next_id = 1
                while next_id in used_ids:
                    next_id += 1
                slot.quiz_question_id = next_id
                slot.save(update_fields=["quiz_question_id"])
                used_ids.add(next_id)
            else:
                used_ids.add(slot.quiz_question_id)


class Migration(migrations.Migration):

    dependencies = [
        ("quiz", "0013_quizslot_quiz_question_id_and_more")
    ]

    operations = [
        migrations.RunPython(fix_duplicate_quiz_question_ids, reverse_code=migrations.RunPython.noop),
        migrations.AddConstraint(
            model_name='quizslot',
            constraint=models.UniqueConstraint(fields=('quiz', 'quiz_question_id'), name='unique_quiz_question_id_per_quiz'),
        ),
    ]
