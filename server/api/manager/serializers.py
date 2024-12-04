from rest_framework import serializers
from django.contrib.auth import get_user_model


class LeaderboardSerializer(serializers.ModelSerializer):
    """
    Serializer for the leaderboard data.

    This serializer is designed for handling student entries in the competition leaderboard. Each entry represents
    an individual student, including their personal information, scores, and participation status.

    The leaderboard:
    - Tracks student details like name, school, email, scores, and status.
    - Enables managers to add, delete, and update entries.
    - Supports data export to a CSV format for record-keeping.

    Fields:
        - student_name (str): Name of the student.
        - school (str): Student's affiliated school.
        - school_email (str): School's contact email.
        - username (str): Unique student identifier.
        - password (str): Student's authentication password.
        - individual_score (int): Score in individual events.
        - team_name (str): Team the student belongs to.
        - team_score (int): Total score of the team.
        - status (str): Participation status (e.g., Active, Inactive).
    """
    class Meta:
        model = get_user_model()
        fields = "__all__"

    # TODO: Add functionality to manage leaderboard entries and export data
    # - Implement a function to add a new student entry to the leaderboard.
    # - Implement a function to delete an existing student entry from the leaderboard.
    # - Implement a function to save/modify entries in the leaderboard.
    # - Implement a function to export all entries to a CSV file for record-keeping.
