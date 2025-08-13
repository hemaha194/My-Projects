from django.shortcuts import render
from django.http import HttpResponse,JsonResponse
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import Mail
from .serializers import SerializeMails
from django.core.mail import send_mail
from django.conf import settings

# Create your views here.
# def hi(self):
#     return HttpResponse("Hello world")
# class GeneralMethods(APIView):
#     def get(self,request):
#         return HttpResponse("Hello world")
    
class MailsGeneralOperations(APIView):
    def post(self,request):
        serializer=SerializeMails(data=request.data)
        if serializer.is_valid():
            serializer.save()
            subject = serializer.data["subject"]
            message = serializer.data["body"]
            recipient_email = serializer.data["to_address"]
            print(serializer.data)
            send_mail(subject, message, settings.EMAIL_HOST_USER, [recipient_email])
            return Response(serializer.data)
        else:
            print("invaliddd")
            return Response("Invalid data")
    
    def get(self,request):
        obj = Mail.objects.all()
        serializer = SerializeMails(obj,many=True)
        return Response(serializer.data)

class ParticularMail(APIView):
    def get(self,request,id):
        obj=Mail.objects.get(id=id)
        Serializer = SerializeMails(obj)
        return Response(Serializer.data)
    def delete(self,request,id):
        obj=Mail.objects.get(id=id)
        obj.delete()
        return Response("Data deleted successfully!!")