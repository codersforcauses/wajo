from .models import Quiz

def start_quiz(quiz_id):
    try:
        quiz = Quiz.objects.get(id=quiz_id)
        if quiz.status == 'upcoming' and quiz.is_opening():
            Quiz.objects.filter(id=quiz_id).update(status='ongoing')
            print(f"Quiz {quiz.name} has started.")
    except Quiz.DoesNotExist:
        print(f"Quiz with ID {quiz_id} does not exist.")

def end_quiz(quiz_id):
    try:
        quiz = Quiz.objects.get(id=quiz_id)
        if quiz.status == 'ongoing' and quiz.is_closing():
            Quiz.objects.filter(id=quiz_id).update(status='finished')
            print(f"Quiz {quiz.name} has ended.")
    except Quiz.DoesNotExist:
        print(f"Quiz with ID {quiz_id} does not exist.")


from apscheduler.schedulers.background import BackgroundScheduler
from django.apps import apps

scheduler = BackgroundScheduler()

def schedule_tasks():
    try:
        Quiz = apps.get_model('quiz', 'Quiz')  
        quizzes = Quiz.objects.all()

        for quiz in quizzes:
            # Schedule the quiz to start
            if quiz.status == 'upcoming':
                scheduler.add_job(
                    start_quiz,
                    'date',
                    run_date=quiz.open_time_date,
                    args=[quiz.id],
                    id=f"start-{quiz.id}",
                    replace_existing=True
                )
            # Schedule the quiz to end
            if quiz.status in ['upcoming', 'ongoing']:
                scheduler.add_job(
                    end_quiz,
                    'date',
                    run_date=quiz.close_time_date,
                    args=[quiz.id],
                    id=f"end-{quiz.id}",
                    replace_existing=True
                )

        scheduler.start()
    except Exception as e:
        print(f"Error scheduling tasks: {e}")
