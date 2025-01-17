from .models import Team, TeamMember
from rest_framework import serializers


class TeamMemberSerializer(serializers.ModelSerializer):
    class Meta:
        model = TeamMember
        fields = '__all__'
        read_only_fields = ("id", "time_added")


class TeamSerializer(serializers.ModelSerializer):
    members = TeamMemberSerializer(source='has', many=True, read_only=True)

    class Meta:
        model = Team
        fields = '__all__'
        read_only_fields = ("id", "time_created")
