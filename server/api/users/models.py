from django.db import models
from django.contrib.auth.models import User, Group


class ExtendedUser(models.Model):
    user = models.OneToOneField(
        User, on_delete=models.CASCADE, primary_key=True)

    # Additional fields specific to students
    team_id = models.CharField(max_length=50, blank=True)
    school_id = models.CharField(max_length=50, blank=True)

    def __str__(self):
        return f"{self.user.username} ({self.role})"

    @property
    def role(self):
        """Return the user's role (based on groups)."""
        if self.user.groups.exists():
            return self.user.groups.first().name
        return None

    def set_role(self, role_name):
        """Assign a specific role to the user."""
        self.user.groups.clear()
        group, created = Group.objects.get_or_create(name=role_name)
        self.user.groups.add(group)

    def is_admin(self):
        return self.role == 'Admin'

    def is_teacher(self):
        return self.role == 'Teacher'

    def is_student(self):
        return self.role == 'Student'

    @property
    def last_login(self):
        return self.user.last_login
