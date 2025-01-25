from .models import Team, Team_member
from rest_framework import serializers
from api.users.serializers import SchoolSerializer, StudentSerializer
from api.users.models import School, Student


class TeamMemberSerializer(serializers.ModelSerializer):
    student = StudentSerializer(read_only=True)
    student_id = serializers.PrimaryKeyRelatedField(
        queryset=Student.objects.all(), write_only=True, source='student')

    class Meta:
        model = Team_member
        fields = "__all__"
        read_only_fields = ("id", "time_added")


class TeamSerializer(serializers.ModelSerializer):
    members = TeamMemberSerializer(source='has', many=True, read_only=True)
    school = SchoolSerializer(read_only=True)
    school_id = serializers.PrimaryKeyRelatedField(
        queryset=School.objects.all(), write_only=True, source='school')

    class Meta:
        model = Team
        fields = "__all__"
        read_only_fields = ("id", "time_created")
