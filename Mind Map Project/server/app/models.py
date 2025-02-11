from django.db import models

# Create your models here.
class NewTraverse(models.Model):
    text = models.TextField()

class Node(models.Model):
    traverse = models.ForeignKey(NewTraverse, on_delete=models.CASCADE, related_name='nodes',default=None)
    id = models.CharField(max_length=255, primary_key=True)
    type = models.CharField(max_length=255,default=None)
    label = models.CharField(max_length=255,default=None)
    content = models.CharField(max_length=8000,default=None)
    position_x = models.FloatField()
    position_y = models.FloatField()

class Edge(models.Model):
    traverse = models.ForeignKey(NewTraverse, on_delete=models.CASCADE, related_name='edges',default=None)
    id = models.CharField(max_length=255, primary_key=True)
    source = models.CharField(max_length=255)
    target = models.CharField(max_length=255)

class Flashcard(models.Model):
    node = models.ForeignKey(Node, on_delete=models.CASCADE, related_name='flashcards')
    front = models.CharField(max_length=8000)
    back = models.CharField(max_length=8000)

class Files(models.Model):
    node = models.ForeignKey(Node, on_delete=models.CASCADE, related_name='files',default=None)
    file = models.FileField(upload_to='files/')
    