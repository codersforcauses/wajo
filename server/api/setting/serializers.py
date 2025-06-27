from .models import Setting
from rest_framework import serializers


class SettingSerializer(serializers.ModelSerializer):
    value = serializers.JSONField()

    class Meta:
        model = Setting
        fields = ['id', 'key', 'value']

    def create(self, validated_data):
        value = validated_data.pop('value')
        setting = Setting(**validated_data)
        setting.set_value(value)
        setting.save()
        return setting

    def update(self, instance: Setting, validated_data):
        value = validated_data.get('value', None)
        if value is not None:
            instance.set_value(value)
        instance.key = validated_data.get('key', instance.key)
        instance.save()
        return instance
