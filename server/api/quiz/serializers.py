from rest_framework import serializers
from .models import Quiz


class QuizSerializer(serializers.ModelSerializer):
    class Meta:
        model = Quiz
        fields = [
            'id',
            'name',
            'intro',
            'total_marks',
            'is_comp',
            'visible',
            'open_time_date',
            'close_time_date',
            'timelimit'
        ]
