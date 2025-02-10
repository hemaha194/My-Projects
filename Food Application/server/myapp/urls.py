from django.urls import path
from .views import *

urlpatterns = [
    path('/api',BasicFunctions.as_view()),
    path('/api/<int:id>',OperationsPerform.as_view()),
    path('/api/thisWeek',filterThisWeekData.as_view()),
    path('/api/lastWeek',filterLastWeekData.as_view()),
]
