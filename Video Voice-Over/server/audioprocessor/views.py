# your_app/views.py
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser
from .models import Video,BgMusic,combinedMusic,CombinedMedia,ExampleTable
from .serializers import VideoSerializer,BgMusicSerializer,combinedMusicSerializer,CombinedMediaSerializer,ExampleTableSerializer
import os
import subprocess
from rest_framework.permissions import AllowAny
from rest_framework.status import HTTP_200_OK, HTTP_201_CREATED, HTTP_400_BAD_REQUEST
from django.core.files.base import ContentFile
from rest_framework.parsers import JSONParser
from django.core.exceptions import ObjectDoesNotExist
from django.shortcuts import get_object_or_404
from django.http import HttpResponse
import shutil

class VideoUploadView(APIView):
    parser_classes = (MultiPartParser, FormParser)

    def post(self, request, *args, **kwargs):
        video_serializer = VideoSerializer(data=request.data)

        if video_serializer.is_valid():
            video_serializer.save()
            return Response(video_serializer.data, HTTP_201_CREATED)

        return Response(video_serializer.errors, status=HTTP_400_BAD_REQUEST)
    
class BgMusicUploadView(APIView):
    parser_classes = (MultiPartParser, FormParser)

    def post(self, request, *args, **kwargs):
        bg_music_serializer = BgMusicSerializer(data=request.data)

        if bg_music_serializer.is_valid():
            bg_music_serializer.save()

            bg_data_path = os.path.join(bg_music_serializer.data["bgmusic"])
            bg_data_name = os.path.basename(bg_data_path)

            bg_data_id=bg_music_serializer.data["id"]
            obj = BgMusic.objects.get(id=bg_data_id).bgmusic.name


            public_path = '/home/hema/Documents/Applines/ReactFlow_FFMPEG/client/public'
            destination_path = os.path.join(public_path, bg_data_name)

            # Duplicate the file in a separate folder
            duplicate_folder = '/home/hema/Documents/Applines/ReactFlow_FFMPEG/server/duplicate_bg_music'
            duplicate_path = os.path.join(duplicate_folder, bg_data_name)

            command = f'ffmpeg -i {obj} -c:a copy {duplicate_path}'
            subprocess.run(command, shell=True, check=True)
        

            # Move the background music file to the public folder
            shutil.move(duplicate_path, destination_path)

            # Update the serializer data with the new destination path
            bg_music_serializer.data["bgmusic"] = destination_path

            return Response(bg_music_serializer.data, status=HTTP_201_CREATED)

        return Response(bg_music_serializer.errors, status=HTTP_400_BAD_REQUEST)
    
    
class VideoDetailView(APIView):
    permission_classes = (AllowAny,)

    def get(self, request, id):
        try:
            obj = Video.objects.get(id=id)
            audio_file_name = self.extract_audio(obj.file.path)
            extracted_video_file_name = self.extract_video(obj.file.path)
            
            # Save the audio file name to the 'audio' field
            obj.audio = audio_file_name
            obj.extracted_video = extracted_video_file_name
            obj.save()

            # Serialize the updated object
            serializer = VideoSerializer(obj)
            return Response(serializer.data, status=HTTP_200_OK)
        except Video.DoesNotExist:
            return Response({"detail": "Video not found"}, status=HTTP_400_BAD_REQUEST)

    def extract_audio(self, video_path):
        try:
            # Construct audio path
            audio_file_name = f'{os.path.splitext(os.path.basename(video_path))[0]}_audio.mp3'
            folder_path = '/home/hema/Documents/Applines/ReactFlow_FFMPEG/server/extracted_audio'  # Make sure this folder exists in your project
            public_path = '/home/hema/Documents/Applines/ReactFlow_FFMPEG/client/public'
            duplicate_path = '/home/hema/Documents/Applines/ReactFlow_FFMPEG/server/extracted_audio2'

            # Check if the folder exists, if not, create it
            if not os.path.exists(folder_path):
                os.makedirs(folder_path)

            audio_file_path = os.path.join(folder_path, audio_file_name)
            audio_file_path2 = os.path.join(duplicate_path, audio_file_name)

            # Extract audio using ffmpeg
            subprocess.run(['ffmpeg', '-i', video_path, audio_file_path], capture_output=True)
            subprocess.run(['ffmpeg', '-i', video_path, audio_file_path2], capture_output=True)

            destination_path = os.path.join(public_path, audio_file_name)

            # Create a copy of the audio file in the public path
            shutil.move(audio_file_path, destination_path)

            return audio_file_name
        except Exception as e:
            print(e)
            return Response({'status': 'error', 'message': str(e)})
    
    def extract_video(self, video_path):
        try:
            # Construct path for extracted video
            extracted_video_file_name = f'{os.path.splitext(os.path.basename(video_path))[0]}_extracted.mp4'
            folder_path = '/home/hema/Documents/Applines/ReactFlow_FFMPEG/server/extracted_videos'  # Make sure this folder exists in your project
            public_path = '/home/hema/Documents/Applines/ReactFlow_FFMPEG/client/public'
            duplicate_path = '/home/hema/Documents/Applines/ReactFlow_FFMPEG/server/extracted_videos2'
            # folder_path = os.path.join('extracted_videos')

            if not os.path.exists(folder_path):
                os.makedirs(folder_path)

            video_file_path = os.path.join(folder_path, extracted_video_file_name)
            video_file_path2 = os.path.join(duplicate_path, extracted_video_file_name)

            # Extract video without audio using ffmpeg
            subprocess.run(['ffmpeg', '-i', video_path, '-an', video_file_path ], capture_output=True)
            subprocess.run(['ffmpeg', '-i', video_path, '-an', video_file_path2 ], capture_output=True)
            
            destination_path = os.path.join(public_path, extracted_video_file_name)

            # Create a copy of the audio file in the public path
            shutil.move(video_file_path, destination_path)

            return extracted_video_file_name
        except Exception as e:
            print(e)
            return Response({'status': 'error', 'message': str(e)})



class CombineMusicView(APIView):
    def post(self, request, *args, **kwargs):
        try:
            data = JSONParser().parse(request)
            audio_path1 = data.get('audioUrl')
            audio_path2 = data.get('bgURL')

            audio_file = Video.objects.get(id=audio_path1).audio.name
            audio_file_1 = 'extracted_audio2/'+audio_file

            audio_file_2 = BgMusic.objects.get(id=audio_path2).bgmusic.name

            output_path = (f'combined_{audio_file[:-5]}.mp3')
            public_path = '/home/hema/Documents/Applines/ReactFlow_FFMPEG/client/public'

            folder_path = os.path.join('combinedMusic')
            folder_path2 = os.path.join('combinedMusic2')

            if not os.path.exists(folder_path):
                os.makedirs(folder_path)
        
            audio_file_path = os.path.join(folder_path, output_path)
            audio_file_path2 = os.path.join(folder_path2, output_path)

            # Combine audio using FFmpeg
            combinedMc = self.combine_audio(audio_file_1, audio_file_2, audio_file_path)
            combinedMc = self.combine_audio(audio_file_1, audio_file_2, audio_file_path2)

            combined_audio = combinedMusic(combinedMusic=combinedMc)
            combined_audio.save()
            
            combined_audio_id = combined_audio.id

            # Create a copy of the combined audio file in the public path
            destination_path = os.path.join(public_path, output_path)
            shutil.move(audio_file_path2, destination_path)

            return Response({'status': 'success', 'combined_audio_id': combined_audio_id})
        except Exception as e:
            return Response({'status': 'error', 'message': str(e)})

    def combine_audio(self, audio_path1, audio_path2, output_path):
        try:
            command = f'ffmpeg -i "{audio_path1}" -i "{audio_path2}" -filter_complex amix=inputs=2:duration=first:dropout_transition=2 -c:a libmp3lame -q:a 4 "{output_path}"'
            subprocess.run(command, shell=True, check=True)
            return output_path
            
        except subprocess.CalledProcessError as e:
            raise Exception(f'Error combining audio files with FFmpeg: {e}')
        


class CombinedAudioView(APIView):
    permission_classes = (AllowAny,)

    def get(self, request, id):
        try:
            obj = combinedMusic.objects.get(id=id)
            serializer = combinedMusicSerializer(obj)
            return Response(serializer.data, status=HTTP_200_OK)
        except Video.DoesNotExist:
            return Response({"detail": "Video not found"}, status=HTTP_400_BAD_REQUEST)


class CombineMediaView(APIView):
    def post(self, request, *args, **kwargs):
        try:
            data = JSONParser().parse(request)
            video_id = data.get('trimmedVideoId')
            audio_id = data.get('combinedAudioId')

            # Retrieve video and audio paths from the database
            video_p = Video.objects.get(id=video_id).extracted_video.name
            video_path = 'extracted_videos2/' + video_p
            audio_path = combinedMusic.objects.get(id=audio_id).combinedMusic.name
            audio_path = audio_path.replace("combinedMusic2", "combinedMusic")

            output_path = f'finalVideo_{video_p[:-5]}.mp4'
            folder_path = 'finalVideo'
            public_path = '/home/hema/Documents/Applines/ReactFlow_FFMPEG/client/public'

            if not os.path.exists(folder_path):
                os.makedirs(folder_path)

            final_video_path = os.path.join(folder_path, output_path)

            # Save combined media information to CombinedMedia model
            finalOutPut = self.combine_media(video_path, audio_path, final_video_path)
            print(f'Final Output Path: {finalOutPut}')

            saveOutPut = CombinedMedia(combined_video=finalOutPut)
            saveOutPut.save()

            # Move the final video to the public folder
            destination_path = os.path.join(public_path, output_path)
            shutil.move(final_video_path, destination_path)

            return Response({'status': 'success', 'combined_media_id': saveOutPut.id})
        except Exception as e:
            print(f'Error: {e}')
            return Response({'status': 'error', 'message': str(e)})

    def combine_media(self, video_path, audio_path, output_path):
        print(f'Input Paths: Video={video_path}, Audio={audio_path}, Output={output_path}')
        try:
            command = f'ffmpeg -i {video_path} -i {audio_path} -c:v copy -c:a aac {output_path}'
            subprocess.run(command, shell=True, check=True)
            return output_path
        except subprocess.CalledProcessError as e:
            print(f'Error combining audio and video: {e}')

        
class FinalVideoView(APIView):
    permission_classes = (AllowAny,)

    def get(self, request, id):
        try:
            obj = CombinedMedia.objects.get(id=id)
            serializer = CombinedMediaSerializer(obj)
            return Response(serializer.data, status=HTTP_200_OK)
        except Video.DoesNotExist:
            return Response({"detail": "Video not found"}, status=HTTP_400_BAD_REQUEST)


def download_video(request, video_id):
    try:
        video = get_object_or_404(CombinedMedia, id=video_id)
        video_path = video.combined_video.path
        with open(video_path, 'rb') as video_file:
            response = HttpResponse(video_file.read(), content_type='video/mp4')
            response['Content-Disposition'] = f'attachment; filename="{video.combined_video.name}"'
            return response
    except ObjectDoesNotExist:
        return HttpResponse(status=404)
    

class ExampleTableView(APIView):
    parser_classes = (MultiPartParser, FormParser)

    def post(self, request, *args, **kwargs):
        video_serializer = ExampleTableSerializer(data=request.data)

        if video_serializer.is_valid():
            video_serializer.save()
            return Response(video_serializer.data, HTTP_201_CREATED)

        return Response(video_serializer.errors, status=HTTP_400_BAD_REQUEST)
    




    