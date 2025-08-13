from django.db import models


# Create your models here.
class RecipeTable(models.Model):
    r_name=models.CharField(max_length=20)
    r_description=models.TextField(max_length=500)
    r_type=models.CharField(max_length=20)
    r_created_at=models.DateField()
    r_img=models.CharField(max_length=200)
    r_price=models.CharField(max_length=20,blank=True, null=True)

    def __str__(self):
        return self.r_name
    
class Orders(models.Model):
    name = models.CharField(max_length=100)
    recipe = models.ForeignKey(RecipeTable,on_delete=models.CASCADE, related_name='orders',null=True, blank=True)
    amount = models.CharField(max_length=100)
    order_id = models.CharField(max_length=100,blank=True, null=True)
    razorpay_payment_id = models.CharField(max_length=100,blank=True, null=True)
    paid = models.BooleanField(default=False)

    def __str__(self):
        return self.name
