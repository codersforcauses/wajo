from django.db import models
from django.contrib.auth.models import User, Group


class ExtendedUser(models.Model):
    user = models.OneToOneField(
        User, on_delete=models.CASCADE, primary_key=True)

    # add key when tables are added
    # team_id = models.CharField(max_length=50, ke)
    # school_id = models.CharField(max_length=50, blank=True)
    # Automatically set when created
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.user.username} ({self.role})"

    @property
    def role(self):
        if self.user.groups.exists():
            return self.user.groups.first().name
        return None

    def set_role(self, role_name):
        self.user.groups.clear()
        group = Group.objects.get(name=role_name)
        self.user.groups.add(group)

    def is_admin(self):
        return self.user.groups.filter(name='Admin').exists()

    def is_teacher(self):
        return self.user.groups.filter(name='Teacher').exists()

    def is_student(self):
        return self.user.groups.filter(name='Student').exists()

    @property
    def last_login(self):
        return self.user.last_login
