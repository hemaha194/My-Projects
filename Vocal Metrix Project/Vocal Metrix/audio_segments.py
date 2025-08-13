from pydub import AudioSegment
import os
import math

def divide_audio_into_minute_intervals(audio_file):
    audio_files_list = []
    audio = AudioSegment.from_file(audio_file)
    audio_duration_ms = len(audio)
    # print("audio duration :",audio_duration_ms)
    interval_duration_ms = 60 * 1000  # 1 minute = 60 seconds = 60,000 milliseconds
    # print("interval duration : ", interval_duration_ms)
    intervals = audio_duration_ms / interval_duration_ms
    floating_interval = intervals - int(intervals)
    # print(floating_interval)
    if(floating_interval > 0.2):
        num_intervals = math.ceil(audio_duration_ms / interval_duration_ms)
    else:
        num_intervals = int(intervals)
    # print("no.of intervals : ",num_intervals)
    # print(math.ceil(audio_duration_ms / interval_duration_ms))
    output_dir = "minute_intervals/"+audio_file[:-4]+"_intervals"
    os.makedirs(output_dir,exist_ok=True)

    # Divide the audio into minute intervals
    for i in range(num_intervals):
        start_time = i * interval_duration_ms
        end_time = (i + 1) * interval_duration_ms
        # print("start time : ", start_time)
        # print("end time : ",end_time)
        # Extract the minute interval
        minute_interval = audio[start_time:end_time]
        # print("minute interval : ",minute_interval)
        # Save the minute interval as a new audio file
        output_file = os.path.join(output_dir, f"interval_{i + 1}.wav")
        audio_files_list.append(output_file)
        minute_interval.export(output_file, format="wav")
        
    return audio_files_list
    
    
# if __name__ == "__main__":
#     # Replace 'your_audio_file.wav' with the path to your audio file
#     audio_file_path = "classic countdown timer  - 1 Minute  - Silent.mp4"

#     # Divide audio into minute intervals
#     audio_paths = divide_audio_into_minute_intervals(audio_file_path)
#     print(audio_paths)