import speech_recognition as sr
from deepmultilingualpunctuation import PunctuationModel
import subprocess
import assemblyai as aai
import nltk
nltk.download('punkt')
import json
import pandas
import numpy as np
import shutil
#exported from our files
import phrases
import audio_segments
import pause_times
import db
import remove_background_music
import re


model = PunctuationModel()
aai.settings.api_key = "841c107621174524a33f2f9d7b53e66c"
transcriber = aai.Transcriber()

def extract_audio_from_video(input_file,output_file):
    command=[
        'ffmpeg',
        '-i',input_file,
        '-vn',
        # '-c:a',"mp3",
        '-acodec', 'pcm_s16le',  #convert the voice file to WAV format
        output_file
    ]

    subprocess.run(command,check=True)

def extract_text_from_audio(output_file):
    transcript = transcriber.transcribe(output_file)
    text = transcript.text
    return text

# def count_no_of_sentences(text):
#     sentences = nltk.sent_tokenize(text)
#     return len(sentences)
def count_no_of_sentences(text):
    sentences = re.split(r'[.!?]+', text)  # Split using ., !, ? as sentence delimiters
    sentences = [s.strip() for s in sentences if s.strip()]  # Remove empty strings
    return len(sentences)


def count_syllables(word):
    vowels = "AEIOUaeiou"
    count = 0

    prev_is_vowel = False

    for char in word:
        if char in vowels:
            if not prev_is_vowel:
                count += 1
                prev_is_vowel = True
        else:
            prev_is_vowel = False

    if word.endswith("e"):
        count -= 1

    return count if count > 0 else 1

def convert_np_to_list(obj):
    if isinstance(obj, np.ndarray):
        return obj.tolist()
    return obj

def main():

    input_file="true_friend_story.mp4"
    output_file=input_file[:-4]+"_audio_conversion.wav"
    extract_audio_from_video(input_file,output_file)
    output_file1 = "removed_bg_music_file/"+ output_file[:-4] +"/vocals.wav"
    remove_background_music.generate_audio_bg_files(output_file)
    audio_files = audio_segments.divide_audio_into_minute_intervals(output_file1)
    print(audio_files,"*************")
    All_data=[]
    
    for i in range(len(audio_files)):
        segment_data = {}
        audio_text=extract_text_from_audio(audio_files[i])

        try:
            user_improvements_list = {}
            intervals = {}
            voice_input = ''
            if(audio_text != ""):
                voice_input = model.restore_punctuation(audio_text)
                intervals["data"] = voice_input
            # print(f"Voice input [{i+1}] audio file : \n {voice_input}")
            print("-----------------------------------------------------")

            #counting no.of sentences 
            sentence_count = count_no_of_sentences(voice_input)
            if(sentence_count == 0):
                user_improvements_list["sentences"] = "None"
            elif(sentence_count < 10 and sentence_count > 4):
                user_improvements_list["Sentences"] = "good"
            elif(sentence_count <=4):
                user_improvements_list["sentences"] = "slow"
            else:
                user_improvements_list["sentences"] = "fast"
                
            intervals["sentences_count"] = sentence_count
        
            # Count phrases and pauses
            phrases_list,phrases_count = phrases.count_phrases(voice_input)
            intervals["phrases"] = phrases_list
            intervals["phrases_count"] = phrases_count
            # print(phrases_list)

            # Count syllables
            words = voice_input.split()
            syllables = sum(count_syllables(word) for word in words)
            if(syllables == 0):
                user_improvements_list["syllables"] = "None"
            elif(syllables < 100):
                user_improvements_list["syllables"] = "good"
            else:
                user_improvements_list["syllables"] = "improve"
                
            intervals["syllables_count"] = syllables
            
            #finding db values
            db_values = db.calculate_db(audio_files[i])
            intervals["db_values"] = db_values
            
            
            
            # finding pauses from an audio file
            
            silence_threshold_dB = 0  # Adjust the silence threshold (in dBFS)
            min_silence_duration_ms = 500  # Adjust the minimum silence duration (milliseconds)
            # long_pause_threshold_ms = 2000  # Adjust the duration for long pause threshold (milliseconds)

            audio = pause_times.load_audio(audio_files[i])
            short_pauses,long_pauses,silence_pauses = pause_times.detect_pauses(audio, silence_threshold_dB, min_silence_duration_ms)

            intervals["short_pauses"] = len(short_pauses)
            intervals["long_pauses"] = len(long_pauses)
            intervals["silence_pauses"] = len(silence_pauses) 
            total_pauses = len(short_pauses) + len(long_pauses) + len(silence_pauses)
            
            if(total_pauses == 0):
                user_improvements_list["pauses"] = "None"
            elif(total_pauses > 3 and total_pauses < 10):
                user_improvements_list["pauses"] = "good"
            elif(total_pauses <= 3):
                user_improvements_list["pauses"] = "fast"
            else:
                user_improvements_list["pauses"] = "improve"
            intervals["total_pauses"] = total_pauses
            
            print(f"Audio-Segment-{i+1} data : {intervals}")
            segment_data[f"segment{i+1}_data"] = intervals
            
            All_data.append(segment_data)
            print(f"User improvement Summary : - {user_improvements_list}")
            intervals["segment_summary"] = user_improvements_list
            print("-----------------------------------------------------")
            
        except sr.UnknownValueError:
            print("Could not understand the audio.")
        except sr.RequestError as e:
            print(f"Error in speech recognition: {e}")

    print(All_data)
    
    storeData_file_path = "Summary/"+input_file[:-4]+".txt"
    with open(storeData_file_path,"w+") as file:
        data_string = json.dumps(All_data, default=convert_np_to_list, indent=4)
        file.writelines(data_string)
        
    #Deleting intervals audio files
    shutil.rmtree("minute_intervals/removed_bg_music_file")
    shutil.rmtree("removed_bg_music_file")
    
    # overall_data = pandas.DataFrame(All_data)
    # overall_stats = overall_data.sum()
    # print("Overall Stats :\n",overall_stats)
    
    
    
    
    
if __name__ == "__main__":
    main()
