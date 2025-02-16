from rest_framework import viewsets, filters, status
from rest_framework.response import Response
from rest_framework.permissions import IsAdminUser
from api.permissions import IsTeacher, IsAdmin
from django.db import IntegrityError
from rest_framework.decorators import action, permission_classes

from .models import Team, TeamMember, Student
from .serializers import TeamSerializer, TeamMemberSerializer


@permission_classes([IsTeacher | IsAdmin | IsAdminUser])
class TeamViewSet(viewsets.ModelViewSet):
    serializer_class = TeamSerializer
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ["name"]
    # Specify which fields can be ordered
    ordering_fields = ["id", "name", "description"]
    ordering = ["id"]

    def get_queryset(self):
        """Filter based on user role."""
        user = self.request.user
        queryset = Team.objects.all()
        if hasattr(user, "teacher"):
            return queryset.filter(school_id=user.teacher.school_id)
        return queryset.order_by("id")

    def create(self, request, *args, **kwargs):
        user = self.request.user
        if hasattr(user, "teacher") and not user.teacher.school_id == request.school_id:
            return Response({'error': 'Teacher cannot create team for different school.'}, status=status.HTTP_400_BAD_REQUEST)

        serializer = self.get_serializer(data=request.data, many=True)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    def update(self, request, *args, **kwargs):
        try:
            return super().update(request, *args, **kwargs)
        except IntegrityError as error:
            return Response(
                {
                    "error": str(error),
                    "message": "A team with this name may already exist.",
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

    @action(detail=True, methods=['get', 'post'])
    def members(self, request, pk=None):
        """
        Handle team member operations.
        GET: Retrieve team members
        POST: Create or update team members
        """
        user = request.user
        teacher_school_id = user.teacher.school_id if hasattr(user, "teacher") else None
        team = Team.objects.filter(id=pk).first()
        instance = TeamMember.objects.filter(team=pk)

        def validate_school_access():
            """Validate teacher's access to the school"""
            if teacher_school_id and teacher_school_id != team.school_id:
                return Response({"error": "Teacher can only access teams from their school."}, status=status.HTTP_400_BAD_REQUEST)

        def validate_team_member_record(student_id, team_id):
            """Validate student belongs to the same school as the team"""
            if not all([student_id, team_id]):
                return Response({"error": "Missing required fields: student_id or team."}, status=status.HTTP_400_BAD_REQUEST)
            student = Student.objects.filter(id=student_id).first()
            team_member = TeamMember.objects.filter(student_id=student_id).first()
            if teacher_school_id and student.school.id != teacher_school_id:
                return Response({"error": "Teacher can only manage students from their school."}, status=status.HTTP_400_BAD_REQUEST)
            if student.school.id != team.school.id:
                return Response({"error": "Student must belong to the same school as the team."}, status=status.HTTP_400_BAD_REQUEST)
            if team_member and team_member.team.id != int(pk):
                team_name = Team.objects.filter(id=team_member.team.id).first().name
                return Response({"error": f"Student:{student.user.get_username()} exists in team:{team_name}."}, status=status.HTTP_400_BAD_REQUEST)
            return None

        if request.method == 'GET':
            """Filter based on user role."""
            validate_result = validate_school_access()
            if validate_result:
                return validate_result
            self.serializer_class = TeamMemberSerializer
            serializer = TeamMemberSerializer(instance, many=True)
            return Response(serializer.data)
        if request.method == 'POST':
            """Check if student school and team school matched"""
            for entry in request.data:
                validate_result = validate_team_member_record(entry.get('student_id'), entry.get('team'))
                if validate_result:
                    return validate_result

            if instance.exists():
                instance.delete()
            """multiple create"""
            serializer = TeamMemberSerializer(data=request.data, many=True)
            serializer.is_valid(raise_exception=True)
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
