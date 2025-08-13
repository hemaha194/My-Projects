from django.urls import path
from .views import *

urlpatterns = [
    path('/api',BasicFunctions.as_view()),
    path('/api/<int:id>',OperationsPerform.as_view()),
    path('/api/thisWeek',filterThisWeekData.as_view()),
    path('/api/lastWeek',filterLastWeekData.as_view()),
    path('/order',createOrder.as_view()),
    path('/order/<int:id>',createOrder.as_view()),
    path('/payment-success',PaymentSuccess.as_view()),
]
