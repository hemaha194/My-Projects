import librosa
import matplotlib.pyplot as plt
import numpy as np

# Load the audio file
audio_file = 'hello_world.wav'
y, sr = librosa.load(audio_file, sr=None)

# Compute the pitch using librosa's piptrack function
pitch, _ = librosa.piptrack(y=y, sr=sr)

# Get the pitch frequencies from the pitch array
pitch_frequencies = pitch.max(axis=0)


# Convert the frame index to time (seconds)
timestamps = librosa.times_like(pitch_frequencies, sr=sr)

segment_duration = 5 * sr  # Number of samples per 5 seconds
segments = [y[i:i+segment_duration] for i in range(0, len(y), segment_duration)]
pitch_points_list = []
for i, segment in enumerate(segments):
    # Compute the pitch using librosa's piptrack function for each segment
    pitch, _ = librosa.piptrack(y=segment, sr=sr)

    pitch_freq_data = pitch.max(axis=0)

    # pitch_frequency = pitch[pitch_index][0] 
    
    timestamp = librosa.samples_to_time(i * segment_duration, sr=sr)

    # Append the pitch frequency and timestamp to the lists
    pitch_points_list.append(pitch_freq_data)
    
# print(pitch_points_list)
for index, value in enumerate(pitch_points_list):
    print("Segment-",index+1)
    print(value)
    print("\n")
    


# Plot the pitch frequencies over time
plt.plot(timestamps, pitch_frequencies, marker='o', linestyle='-', color='b')
plt.xlabel('Time (seconds)')
plt.ylabel('Pitch Frequency (Hz)')
plt.title('Pitch of the Voice')
plt.show()

