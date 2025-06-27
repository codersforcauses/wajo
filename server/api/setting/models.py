from django.db import models
import json

# Create your models here.


class Setting(models.Model):
    """
    A model to store key-value configuration settings.

    Attributes:
        key (str): A unique string identifier for the setting.
        value (str): A serialized string (typically JSON) that holds the value.
    """
    key = models.CharField(max_length=100, unique=True)
    value = models.TextField(default="{}")

    def get_value(self):
        """
        Deserialize the value field to a Python object (e.g., dict, list, int, etc.).

        Returns:
            object: The deserialized value (JSON object) or the original string if not JSON.
        """
        try:
            return json.loads(self.value)
        except json.JSONDecodeError:
            return self.value

    def set_value(self, val):
        """
        Serialize a Python object and store it as a string in the value field.

        Args:
            val (object): The Python object to serialize (e.g., dict, list, etc.).
        """
        self.value = json.dumps(val)

    def __str__(self):
        return f"{self.id} {self.key}"
