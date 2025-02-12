import soundfile as sf
import numpy as np 
import matplotlib.pylab as plt
import wave

def calculate_db(audio_path, interval=5):
    data, sample_rate = sf.read(audio_path)
    print("Sample Rate: ",sample_rate)
    

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
    print(array)
    print(len(array)) 


    #finding short and long pause
    # short_pause=0
    # long_pause=0
    # count=0
    # for i in array:
    #     if(i==0):
    #        count=count+1
    #     else:
    #         if(count>4):
    #             long_pause=long_pause+1
    #             count=0
    #         elif (count>=1 and count<=4):
    #             short_pause=short_pause+1
    #             count=0
    #         else:
    #             pass


    # print("short pauses= ",short_pause)
    # print("long pauses= ",long_pause)  


    return array

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
