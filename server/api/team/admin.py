from django.contrib import admin

# Register your models here.
from .models import Team, TeamMember

@admin.register(Team)
class TeamAdmin(admin.ModelAdmin):
    pass

@admin.register(TeamMember)
class TeamMemberAdmin(admin.ModelAdmin):
    pass
