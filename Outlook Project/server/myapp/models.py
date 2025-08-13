from django.db import models

# Create your models here.
class Mail(models.Model):
    to_address = models.EmailField()
    cc_address = models.EmailField(null=True,blank=True)
    subject = models.CharField(max_length=500)
    body = models.TextField()
