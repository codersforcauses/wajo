from django.contrib import admin
from unfold.admin import ModelAdmin

# Register your models here.
from .models import Team, TeamMember


@admin.register(Team)
class TeamAdmin(ModelAdmin):
    pass


@admin.register(TeamMember)
class TeamMemberAdmin(ModelAdmin):
    pass
