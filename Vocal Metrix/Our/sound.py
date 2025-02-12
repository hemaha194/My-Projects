import librosa
import numpy as np

y, sr = librosa.load('ted-video1_audio_conversion.wav')

# Calculate RMS (Root Mean Square) energy as loudness
rms = librosa.feature.rms(y=y)[0]
mean_loudness = np.mean(rms)

# Calculate the spectral centroid
spectral_centroids = librosa.feature.spectral_centroid(y=y, sr=sr)[0]
mean_spectral_centroid = np.mean(spectral_centroids)

# Calculate the zero-crossing rate
zero_crossing_rate = librosa.feature.zero_crossing_rate(y)[0]
mean_zero_crossing_rate = np.mean(zero_crossing_rate)

# Calculate the MFCCs
mfccs = librosa.feature.mfcc(y=y, sr=sr, n_mfcc=13)
mean_mfccs = np.mean(mfccs, axis=1)

print("Mean Loudness:", mean_loudness)
print("Mean Spectral Centroid:", mean_spectral_centroid)
print("Mean Zero-Crossing Rate:", mean_zero_crossing_rate)
print("Mean MFCCs:", mean_mfccs)