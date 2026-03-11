import { Audio } from 'expo-av';

let buzzerSound: Audio.Sound | null = null;

export async function startBuzzer(): Promise<void> {
  try {
    await Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
      playsInSilentModeIOS: true,
      staysActiveInBackground: true,
      shouldDuckAndroid: false,
    });

    if (buzzerSound) {
      await buzzerSound.unloadAsync();
    }

    const { sound } = await Audio.Sound.createAsync(
      require('../../assets/buzzer.mp3'),
      {
        shouldPlay: true,
        isLooping: true,
        volume: 1.0,
      }
    );
    buzzerSound = sound;
  } catch (error) {
    console.error('Buzzer start failed:', error);
  }
}

export async function stopBuzzer(): Promise<void> {
  try {
    if (buzzerSound) {
      await buzzerSound.stopAsync();
      await buzzerSound.unloadAsync();
      buzzerSound = null;
    }
  } catch (error) {
    console.error('Buzzer stop failed:', error);
  }
}
