from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import Quiz
from .tasks import scheduler, start_quiz, end_quiz

from apscheduler.jobstores.base import JobLookupError

@receiver(post_save, sender=Quiz)
def update_quiz_tasks(sender, instance, created, **kwargs):
    try:
        # 尝试移除任务，如果任务不存在，捕获异常
        scheduler.remove_job(f"start-{instance.id}")
    except JobLookupError:
        print(f"No start job found for Quiz {instance.id}, skipping removal.")

    try:
        scheduler.remove_job(f"end-{instance.id}")
    except JobLookupError:
        print(f"No end job found for Quiz {instance.id}, skipping removal.")

    # 添加新任务
    if instance.status == 'upcoming':
        scheduler.add_job(
            start_quiz,
            'date',
            run_date=instance.open_time_date,
            args=[instance.id],
            id=f"start-{instance.id}",
            replace_existing=True
        )

    if instance.status in ['upcoming', 'ongoing']:
        scheduler.add_job(
            end_quiz,
            'date',
            run_date=instance.close_time_date,
            args=[instance.id],
            id=f"end-{instance.id}",
            replace_existing=True
        )