from pydub import AudioSegment

def get_audio_duration(audio_file):
    # Load the audio file
    audio = AudioSegment.from_file(audio_file)

    # Get the duration in milliseconds
    duration_ms = len(audio)
    print("duration : in ms -",duration_ms)
    # Convert milliseconds to seconds
    seconds = duration_ms / 1000
    seconds = seconds % (24 * 3600)
    hour = seconds // 3600
    seconds %= 3600
    minutes = seconds // 60
    seconds %= 60
    print(seconds, minutes, hour)
    
    return "%d:%02d:%02d" % (hour, minutes, seconds)

# Replace 'your_audio_file.wav' with the path to your actual audio file
audio_file_path = 'bbc-video2.wav'

# Get the audio duration in minutes
audio_duration_minutes = get_audio_duration(audio_file_path)

print(f"Audio duration: {audio_duration_minutes}")