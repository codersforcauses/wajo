from .models import Invoice
from rest_framework import serializers


class invoiceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Invoice
        fields = '__all__'
