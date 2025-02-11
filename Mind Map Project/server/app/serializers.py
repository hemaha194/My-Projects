from rest_framework import serializers
from .models import NewTraverse,Node,Edge,Flashcard,Files

class NewTraverseSerializer(serializers.ModelSerializer):
    class Meta:
        model = NewTraverse
        fields = '__all__'

class NodeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Node
        fields = '__all__'

class EdgeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Edge
        fields = '__all__'

class FlashcardSerializer(serializers.ModelSerializer):
    class Meta:
        model = Flashcard
        fields = ['id', 'front', 'back']

class FileSerializer(serializers.ModelSerializer):
    class Meta:
        model = Files
        fields = '__all__'