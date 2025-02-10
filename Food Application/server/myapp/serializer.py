from rest_framework import serializers
from .models import *

class serializeRecipe(serializers.ModelSerializer):
    class Meta:
        model=RecipeTable
        fields="__all__"

    