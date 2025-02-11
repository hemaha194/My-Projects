from django.contrib import admin
from django.urls import path
from .views import MailsGeneralOperations,ParticularMail

urlpatterns = [
    path('mail/',MailsGeneralOperations.as_view()),
    path('mail/<int:id>/',ParticularMail.as_view()),
]
