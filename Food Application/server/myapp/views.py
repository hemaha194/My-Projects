from django.shortcuts import render
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status
from datetime import datetime,timedelta
from .models import *
from .serializer import *

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

    
