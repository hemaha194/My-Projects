import soundfile as sf
import numpy as np 
import matplotlib.pylab as plt
from pydub import AudioSegment
import wave

def convert_mp3_to_wav(mp3_file, wav_file):
    # Load the MP3 file using pydub
    audio = AudioSegment.from_mp3(mp3_file)

    # Export the audio to WAV format
    audio.export(wav_file, format="wav")
    


def calculate_db(audio_path, interval=5):
    data, sample_rate = sf.read(audio_path)
    # print("Sample Rate: ",sample_rate)
    

    # Calculate the number of samples in each 5-second interval
    interval_samples = int(interval * sample_rate)
    

    # Initialize a list to store the dB levels for each interval
    db_levels = []

    # Calculate the dB level for each 5-second interval
    for i in range(0, len(data), interval_samples):
        interval_data = data[i:i+interval_samples]
        rms = np.sqrt(np.mean(interval_data ** 2))
        db_level = 20 * np.log10(rms)
        db_levels.append(db_level)
    # print(db_levels)
    # print(len(db_levels))

    #convert -inf to 0 using numpy
    array=np.array(db_levels)
    array[np.isinf(array)] = 0
    
    return array,np.mean(array)


# mp3_file = "vocals/ted-video1_vocals_1.wav"
# print(mp3_file[-3:])
# if(mp3_file[-3:] == "wav"):
#     audio_path = mp3_file
#     print(audio_path,"**************")
#     db_values = calculate_db(audio_path)
# else:
#     audio_path = mp3_file[::-3] + ".wav"
#     print(audio_path,"**************")
#     convert_mp3_to_wav(mp3_file, audio_path)
#     db_values = calculate_db(audio_path)
    
# print("db values :",db_values)


# def ploting(obj):
#     sample_freq=obj.getframerate()
#     n_samples=obj.getnframes()
#     signal_wave=obj.readframes(-1)


#     obj.close()
#     t_audio=n_samples/sample_freq
#     print(t_audio)

#     signal_array=np.frombuffer(signal_wave,dtype=np.int16)

#     times=np.linspace(0,t_audio,num=n_samples)
#     # print(len(signal_array))
#     # print(len(times))
   
#    ##if the lengths of the 2 arrays that is x and y axis lists are not equal then do them become equal
#     if len(signal_array) != len(times):
#         # Reshape the longer array to match the shorter one
#         if len(signal_array) > len(times):
#             times = np.resize(times, len(signal_array))
#         else:
#             signal_array = np.resize(signal_array, len(times))

#     # print(len(signal_array))
#     # print(len(times))

  

#     plt.figure(figsize=(15,5))
#     plt.plot(times,signal_array)
#     plt.title("Audio signal")
#     plt.ylabel("signal wave")
#     plt.xlabel("time(s)")
#     plt.xlim(0,t_audio)
#     plt.show()

# if __name__ == "__main__":
#     audio_path = "ted-video1_audio_conversion.wav"  # Replace with the path to your audio file
#     db_levels = calculate_db(audio_path)
#     obj=wave.open("ted-video1_audio_conversion.wav","rb")

    # Print the dB levels for each 5-second interval
    # for i, db in enumerate(db_levels):
    #     start_time = i * 0.5
    #     end_time = (i + 1) * 0.5
    #     print(f"Interval {i+1}: {start_time:.1f}-{end_time:.1f} seconds | dB Level: {db:.2f} dB")

    # ploting(obj)
    
# db_levels = calculate_db(audio_path= "ted-video1_audio_conversion.wav")
