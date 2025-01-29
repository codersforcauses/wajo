from .models import Team, TeamMember
from rest_framework import serializers
from api.users.serializers import SchoolSerializer, StudentSerializer
from api.users.models import School, Student


class TeamMemberSerializer(serializers.ModelSerializer):
    """
    Serializer for the Team_member model.

    Fields:
        - student (StudentSerializer): A nested serializer to display the associated student details (read-only).
        - student_id (PrimaryKeyRelatedField): Accepts a student ID during write operations, links it to the `student` field.
        - All other fields from the Team_member model are included via `fields = '__all__'`.

    Meta:
        - model: Team_member
        - fields: Includes all fields from the Team_member model.
    """
    student = StudentSerializer(read_only=True)
    student_id = serializers.PrimaryKeyRelatedField(
        queryset=Student.objects.all(), write_only=True, source='student')

    class Meta:
        model = TeamMember
        fields = "__all__"
        read_only_fields = ("id", "time_added")


class TeamSerializer(serializers.ModelSerializer):
    """
    Serializer for the Team model.

    Fields:
        - members (TeamMemberSerializer): A nested serializer to display all members of the team (read-only).
        - school (SchoolSerializer): A nested serializer to display the associated school details (read-only).
        - school_id (PrimaryKeyRelatedField): Accepts a school ID during write operations, links it to the `school` field.
        - All other fields from the Team model are included via `fields = '__all__'`.

    Meta:
        - model: Team
        - fields: Includes all fields from the Team model.
    """
    members = TeamMemberSerializer(source='has', many=True, read_only=True)
    school = SchoolSerializer(read_only=True)
    school_id = serializers.PrimaryKeyRelatedField(
        queryset=School.objects.all(), write_only=True, source='school')

    class Meta:
        model = Team
        fields = "__all__"
        read_only_fields = ("id", "time_created")
