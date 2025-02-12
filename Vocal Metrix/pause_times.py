from pydub import AudioSegment
from pydub.silence import split_on_silence

def load_audio(audio_path):
    audio = AudioSegment.from_file(audio_path)
    return audio

def detect_pauses(audio, silence_threshold_dB, min_silence_duration_ms):
    short_pause_lengths = []
    long_pause_lengths = []
    silence_lengths = []
    pause_threshold = audio.dBFS - silence_threshold_dB
    silence_segments = split_on_silence(audio, min_silence_len=min_silence_duration_ms, silence_thresh=pause_threshold)
    
    for segment in silence_segments:
        pause_duration = len(segment)
        seconds = pause_duration/1000
        print(seconds,"****************")
        if (seconds > 1 and seconds < 5):
            long_pause_lengths.append(seconds)
        elif(seconds >= 5):
            silence_lengths.append(seconds)
        else:
            short_pause_lengths.append(seconds)
    
    return short_pause_lengths,long_pause_lengths,silence_lengths
