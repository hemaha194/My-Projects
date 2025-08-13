from .models import NewTraverse,Node,Edge,Flashcard,Files
from .serializers import NewTraverseSerializer,NodeSerializer,EdgeSerializer,FlashcardSerializer,FileSerializer
from rest_framework.views import APIView
from rest_framework import generics
from rest_framework.status import HTTP_200_OK, HTTP_201_CREATED, HTTP_400_BAD_REQUEST
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from django.http.response import (HttpResponse, HttpResponseBadRequest,
                                  HttpResponseNotFound,
                                  HttpResponseServerError)
from rest_framework.parsers import MultiPartParser, FormParser
import os
import shutil

class NewTraverseView(APIView):
    def post(self, request, *args, **kwargs):
        serializer = NewTraverseSerializer(data=request.data)
        print("serializer",serializer)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, HTTP_201_CREATED)

        return Response(serializer.errors, status=HTTP_400_BAD_REQUEST)

class TraverseDataView(APIView):
    def get(self, request):
        traverse_data = NewTraverse.objects.all()
        serializer = NewTraverseSerializer(traverse_data, many=True)
        return Response(serializer.data,)  

class TraverseParticularRecordView(APIView):
    def get(self,request,id):
        obj=NewTraverse.objects.get(id=id)
        serializer=NewTraverseSerializer(obj)
        return Response(serializer.data) 

class NodeListCreateView(generics.ListCreateAPIView):
    queryset = Node.objects.all()
    serializer_class = NodeSerializer

class EdgeListCreateView(generics.ListCreateAPIView):
    queryset = Edge.objects.all()
    serializer_class = EdgeSerializer

class TraverseDetailView(APIView):
    def get(self, request, id):
        # Get the NewTraverse instance
        traverse_instance = get_object_or_404(NewTraverse, id=id)

        # Prefetch related nodes and edges
        traverse_instance_with_related = NewTraverse.objects.prefetch_related('nodes', 'edges').get(id=traverse_instance.id)
        # Access related nodes and edges
        nodes = list(traverse_instance_with_related.nodes.values())
        edges = list(traverse_instance_with_related.edges.values())
        # Construct the response
        response_data = {
            'traverse': {
                'id': traverse_instance.id,
                'text': traverse_instance.text,
                # Include any other fields from NewTraverse model that you need
            },
            'nodes': nodes,
            'edges': edges,
        }
        return Response(response_data)
    
class NodeUpdateView(APIView):
    def put(self, request, id):
        node = get_object_or_404(Node, id=id)

        # Extract relevant data from the request
        label = request.data.get('label', node.label)
        
        # Update the node model
        node.label = label
        node.save()

        return Response({'message': 'Node updated successfully'}, status=HTTP_200_OK)
    
    
class FlashCardUpdateView(APIView):
    def put(self, request, id):
        node = get_object_or_404(Node, id=id)

        # Extract relevant data from the request
        content = request.data.get('content', node.content)
        
        # Update the node model
        node.content = content
        node.save()

        return Response({'message': 'Node updated successfully'}, status=HTTP_200_OK)
    
class FlashcardCreateView(APIView):
    def post(self, request, node_id):
        node = get_object_or_404(Node, id=node_id)
        serializer = FlashcardSerializer(data=request.data)

        if serializer.is_valid():
            serializer.save(node=node)
            return Response(serializer.data, status=HTTP_201_CREATED)

        return Response(serializer.errors, status=HTTP_400_BAD_REQUEST)
    
    
class FlashcardsGettingView(APIView):
    def get(self, request, node_id):
        node = get_object_or_404(Node, id=node_id)
        flashcards = Flashcard.objects.filter(node=node)
        serializer = FlashcardSerializer(flashcards, many=True)
        return Response(serializer.data)
    

class ParticularFlashcardView(APIView):
    def get(self, request, flashcard_id):
        flashcard = get_object_or_404(Flashcard, id=flashcard_id)
        serializer = FlashcardSerializer(flashcard)
        return Response(serializer.data)
    
    def put(self, request, flashcard_id):
        node = get_object_or_404(Flashcard, id=flashcard_id)

        # Extract relevant data from the request
        front = request.data.get('front', node.front)
        back = request.data.get('back', node.back)
        
        # Update the node model
        node.front = front
        node.back = back
        node.save()

        return Response({'message': 'Node updated successfully'}, status=HTTP_200_OK)
    
class DeleteNode(APIView):
    def delete(self, request, node_id):
        try:
            # Fetch the node
            node = Node.objects.get(id=node_id)
           
            incoming_edges = Edge.objects.filter(traverse=node.traverse, target=node_id)
            
            # Delete both node and edge
            node.delete()
            # outgoing_edges.delete()
            incoming_edges.delete()
            
            return Response({'message': 'Node deleted successfully'})
        except Exception as e:
            return Response(status=HTTP_400_BAD_REQUEST, data={'error': str(e)})
        
class DeleteFlashcard(APIView):
    def delete(self, request, id):
        try:
            # Fetch the node
            node = Flashcard.objects.get(id=id)
           
            # Delete both node and edge
            node.delete()
            
            return Response({'message': 'Node deleted successfully'})
        except Exception as e:
            return Response(status=HTTP_400_BAD_REQUEST, data={'error': str(e)})
        
class DeleteTraverseNode(APIView):
    def delete(self, request, id):
        try:
            # Fetch the node
            node = NewTraverse.objects.get(id=id)
           
            # Delete both node and edge
            node.delete()
            
            return Response({'message': 'Node deleted successfully'})
        except Exception as e:
            return Response(status=HTTP_400_BAD_REQUEST, data={'error': str(e)})
        
class FileUploadView(APIView):
    parser_classes = (MultiPartParser, FormParser)

    def post(self, request,node_id, *args, **kwargs):
        node = get_object_or_404(Node, id=node_id)
        serializer = FileSerializer(data=request.data)

        if serializer.is_valid():
            serializer.save(node=node)

           # Use the correct file path using serializer.data["file"].path
            bg_data_path = serializer.data["file"]
            bg_data_name = os.path.basename(bg_data_path)

            folder_path= '/home/hema/Documents/Applines/Mind-Maps/server/files'
            public_path = '/home/hema/Documents/Applines/Mind-Maps/client/public'
            new_path = os.path.join(folder_path, bg_data_name)

            destination_path=os.path.join(public_path, bg_data_name)

            shutil.move(new_path, destination_path)


            return Response(serializer.data, HTTP_201_CREATED)

        return Response(serializer.errors, status=HTTP_400_BAD_REQUEST)
    
    
class FileRectriveView(APIView):
    def get(self, request, id):
        try:
            node = get_object_or_404(Node, id=id)
            obj = Files.objects.filter(node=node)
            serializer = FileSerializer(obj,many=True)
            return Response(serializer.data, status=HTTP_200_OK)
        except Files.DoesNotExist:
            return Response({"detail": "Video not found"}, status=HTTP_400_BAD_REQUEST)
        
