# urls.py
from django.urls import path
from .views import NewTraverseView,NodeListCreateView, EdgeListCreateView , TraverseDetailView ,TraverseDataView ,TraverseParticularRecordView,NodeUpdateView,FlashCardUpdateView,FlashcardCreateView,FlashcardsGettingView,ParticularFlashcardView,DeleteNode,DeleteFlashcard,DeleteTraverseNode,FileUploadView,FileRectriveView

urlpatterns = [
    path('traverse/', NewTraverseView.as_view(), name='traverse_api'),
    path('nodes/', NodeListCreateView.as_view(), name='node-list-create'),
    path('edges/', EdgeListCreateView.as_view(), name='edge-list-create'),
    path('traverse/<int:id>/', TraverseDetailView.as_view(), name='traverse_detail'),
    path('traverseData/',TraverseDataView.as_view(), name='traverse_details'),
    path('traverseParticular/<int:id>/',TraverseParticularRecordView.as_view(),name='traverse_api'),
    path('nodes/<str:id>/',NodeUpdateView.as_view()),
    path('flashcard/<str:id>/',FlashCardUpdateView.as_view()),
    path('flashcards/<str:node_id>/', FlashcardCreateView.as_view(), name='create_flashcard'),
    path('totalflashcards/<str:node_id>/', FlashcardsGettingView.as_view(), name='flashcard_create'),
    path('particularFlashcard/<int:flashcard_id>/', ParticularFlashcardView.as_view(), name='flashcard-detail'),
    path('delete_node/<str:node_id>/', DeleteNode.as_view(), name='delete_node'),
    path('delete_flashcard/<int:id>/', DeleteFlashcard.as_view(), name='delete_node'),
    path('delete_traversenode/<int:id>/', DeleteTraverseNode.as_view(), name='delete_node'),
    path('uploadFile/<str:node_id>/', FileUploadView.as_view()),
    path('files/<str:id>/', FileRectriveView.as_view()),
]
