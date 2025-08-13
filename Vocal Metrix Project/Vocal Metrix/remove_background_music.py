from spleeter.separator import Separator

def generate_audio_bg_files(audio_path):
    # Initialize the Spleeter separator with the appropriate pre-trained model
    separator = Separator('spleeter:2stems')  # Separates into vocals and accompaniment

    # Provide the path to the input audio file and specify the output directory
    output_directory = 'removed_bg_music_file'

    # Perform source separation
    separator.separate_to_file(audio_path, output_directory)




# input_audio_path = '/home/applines-11/Documents/Materials/2Minute_Timer_with_Music_audio_conversion.wav'
# generate_audio_bg_files(input_audio_path)