from django.apps import AppConfig


class QuizConfig(AppConfig):
    default_auto_field = "django.db.models.BigAutoField"
    name = "api.quiz"

    # def ready(self):
    #     from .tasks import schedule_tasks
    #     schedule_tasks()
    #     from . import signals