from rest_framework import viewsets, status
from rest_framework.decorators import permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from .models import Setting
from .serializers import SettingSerializer


@permission_classes([AllowAny])
class SettingViewSet(viewsets.ModelViewSet):
    """
    Supports:
    - GET /api/setting/?key=<text> => returns or creates by key
    - PATCH /api/setting/{id}/     => updates the value by ID
    """

    queryset = Setting.objects.all()
    serializer_class = SettingSerializer

    def list(self, request):
        """Custom GET with ?key=... query param support."""
        key = request.query_params.get("key")
        if not key:
            return Response({"error": "Missing 'key' query parameter."}, status=status.HTTP_400_BAD_REQUEST)

        setting, _created = Setting.objects.get_or_create(key=key, defaults={"value": "{}"})
        serializer = self.get_serializer(setting)
        return Response(serializer.data, status=status.HTTP_200_OK)
