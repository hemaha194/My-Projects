from django.shortcuts import render
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status
from datetime import datetime,timedelta
from .models import *
from .serializer import *
import razorpay

# Create your views here.
class BasicFunctions(APIView):
    def get(self,request):
        obj=RecipeTable.objects.all()
        serialize=serializeRecipe(obj,many=True)
        return Response(serialize.data,status=status.HTTP_200_OK)
    
    def post(self,request):
        serialize=serializeRecipe(data=request.data)
        if serialize.is_valid():
            serialize.save()
            return Response(serialize.data,status=status.HTTP_201_CREATED)
        return Response(serialize.data,status=status.HTTP_200_OK)
    
class OperationsPerform(APIView):
    def get(self,request,id):
        obj=RecipeTable.objects.get(id=id)
        serialize=serializeRecipe(obj)
        return Response(serialize.data,status=status.HTTP_200_OK)
    
    def put(self,request,id):
        obj=RecipeTable.objects.get(id=id)
        serialize=serializeRecipe(obj,data=request.data)
        if serialize.is_valid():
            serialize.save()
            return Response(serialize.data,status=status.HTTP_201_CREATED)
        return Response(serialize.data,status=status.HTTP_200_OK)
    
    def delete(self,request,id):
        obj=RecipeTable.objects.get(id=id)
        obj.delete()
        return Response("field deleted successfully")
    

class filterThisWeekData(APIView):
    def get(self,request):
        today=datetime.now().date()
        start_date=today-timedelta(days=today.weekday())
        end_date=start_date+timedelta(days=6)
        obj=RecipeTable.objects.filter(r_created_at__range=[start_date,end_date])
        serializer=serializeRecipe(obj,many=True)
        return Response(serializer.data)
class filterLastWeekData(APIView):
    def get(self,request):
        today=datetime.now().date()
        start_date=today-timedelta(today.weekday()+7)
        end_date=start_date+timedelta(days=6)
        obj=RecipeTable.objects.filter(r_created_at__range=[start_date,end_date])
        serializer=serializeRecipe(obj,many=True)
        return Response(serializer.data)

    
class createOrder(APIView):
    def get(self,requests,id):
        order = Orders.objects.get(recipe=id)
        orderSerializer = serializeOrder(order)
        print(orderSerializer.data,"dddddddddddddddddddd")
        return Response(orderSerializer.data, status=status.HTTP_200_OK
                        )
    def post(self,requests):
        # name = requests.user
        name = requests.data.get("name")
        amount = requests.data.get("amount")
        recipe_id = requests.data.get("recipe_id")
        recipe = RecipeTable.objects.get(id=recipe_id)
        print(name,recipe_id,recipe, amount,"aaaaaaaaa")

        client = razorpay.Client(auth=("rzp_test_JlXHTmBdXKzDx1", "tmtq0ebeSWjVuLqJpeRBZmvP"))
        response = client.order.create(
            {
                "amount": int(amount) * 100,  # Amount in paise
                "currency": "INR",
            }
        )
        
        print(response)
        order_id = response.get("id")
        order_status = response.get("status")
        if order_status == "created":
            order= Orders.objects.update_or_create(
                name=name,
                recipe = recipe,
                defaults={
                    "amount": amount,
                    "order_id": order_id,
                    "razorpay_payment_id": None,
                    "paid": False
                }
            )
        return Response(response, status=status.HTTP_201_CREATED)
    
class PaymentSuccess(APIView):
    def post(self, request):
        order_id = request.data.get("order_id")
        payment_id = request.data.get("razorpay_payment_id")
        
        try:
            order = Orders.objects.get(order_id=order_id)
            order.razorpay_payment_id = payment_id
            order.paid = True
            order.save()
            return Response({"message": "Payment successful"}, status=status.HTTP_200_OK)
        except Orders.DoesNotExist:
            return Response({"error": "Order not found"}, status=status.HTTP_404_NOT_FOUND)


