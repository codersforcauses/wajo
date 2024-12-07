from django.db.models.signals import post_save
from django.dispatch import receiver
from django.contrib.auth.models import User
from .models import ExtendedUser


@receiver(post_save, sender=User)
def create_extended_user(sender, instance, created, **kwargs):
    if created:
        ExtendedUser.objects.create(user=instance)


@receiver(post_save, sender=User)
def assign_default_role(sender, instance, created, **kwargs):
    if created and not instance.role:
        instance.set_role('Student')
