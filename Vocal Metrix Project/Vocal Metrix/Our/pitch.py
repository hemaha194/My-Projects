import librosa
import numpy as np

y, sr = librosa.load('ted-video1_audio_conversion.wav')
# f0, voiced_flag, voiced_probs = librosa.pyin(y, fmin=librosa.note_to_hz('C2'), fmax=librosa.note_to_hz('C7'))

# # Filter out unvoiced segments
# f0_voiced = f0[voiced_flag]

# # Calculate mean pitch (average F0)
# mean_pitch = np.mean(f0_voiced)

# # Calculate median pitch
# median_pitch = np.median(f0_voiced)

# # Calculate pitch range (difference between maximum and minimum F0)
# pitch_range = np.max(f0_voiced) - np.min(f0_voiced)

# print("Mean Pitch:", mean_pitch)
# print("Median Pitch:", median_pitch)
# print("Pitch Range:", pitch_range)

# Define the desired interval length (5 seconds in this case)
interval_length = 5  # seconds

# Estimate pitch using pyin
f0, voiced_flag, voiced_probs = librosa.pyin(y, fmin=librosa.note_to_hz('C2'), fmax=librosa.note_to_hz('C7'))

# Get the time indices corresponding to each frame of pitch estimation
frame_times = librosa.times_like(f0)
print("frame times :",frame_times)
# Calculate the number of frames per interval (5-second interval)
frames_per_interval = int(interval_length * sr / len(y))
print("len of y",len(y),y)
print("sr value :",sr)
print("frames per interval :",frames_per_interval)

# Split pitch values into 5-second intervals
pitch_intervals = [f0[i:i + frames_per_interval] for i in range(0, len(f0), frames_per_interval)]
print("intervals",pitch_intervals)
# Calculate the average pitch value for each interval
mean_pitch_values = [np.mean(interval) for interval in pitch_intervals]

# Print or use the results
for i, pitch_value in enumerate(mean_pitch_values):
    start_time = i * interval_length
    end_time = (i + 1) * interval_length
    print(f"Pitch for {start_time} to {end_time} seconds: {pitch_value:.2f} Hz")