from django.db import models


# Create your models here.
class RecipeTable(models.Model):
    r_name=models.CharField(max_length=20)
    r_description=models.TextField(max_length=500)
    r_type=models.CharField(max_length=20)
    r_created_at=models.DateField()
    r_img=models.CharField(max_length=200)

    def __str__(self):
        return self.r_name
