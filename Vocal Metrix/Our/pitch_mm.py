import madmom
from madmom.features import Melodia
import numpy as np

# Load audio file
audio_file = "ted-video1_audio_conversion.wav"
signal, sample_rate = madmom.audio.signal.load_audio_file(audio_file, num_channels=1)

# Initialize Melodia pitch estimator
melodia = Melodia()

# Calculate pitch values using Melodia
pitch_values, _ = melodia(signal, sample_rate)

# Get the time intervals corresponding to each pitch value
interval_length = 5  # seconds
frame_interval = melodia.params['hop_size'] / float(sample_rate)
time_intervals = [(i * frame_interval, (i + 1) * frame_interval) for i in range(len(pitch_values))]

# Split pitch values into 5-second intervals and calculate the mean pitch value for each interval
mean_pitch_values = []
for i in range(0, len(pitch_values), int(interval_length / frame_interval)):
    interval_pitch = pitch_values[i:i + int(interval_length / frame_interval)]
    mean_pitch = interval_pitch[~np.isnan(interval_pitch)].mean()
    mean_pitch_values.append(mean_pitch)

# Print or use the results
for i, pitch_value in enumerate(mean_pitch_values):
    start_time = i * interval_length
    end_time = (i + 1) * interval_length
    print(f"Pitch for {start_time} to {end_time} seconds: {pitch_value:.2f} Hz")

