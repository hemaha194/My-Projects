from rest_framework import serializers
from .models import Mail

class SerializeMails(serializers.ModelSerializer):
    class Meta:
        model = Mail
        fields = '__all__'