import { createAudioPlayer, setAudioModeAsync, type AudioPlayer } from 'expo-audio';

const buzzerSource = require('../../assets/buzzer.mp3');

let buzzerPlayer: AudioPlayer | null = null;

export async function startBuzzer(): Promise<void> {
  try {
    await setAudioModeAsync({
      playsInSilentMode: true,
    });

    if (buzzerPlayer) {
      buzzerPlayer.remove();
      buzzerPlayer = null;
    }

    buzzerPlayer = createAudioPlayer(buzzerSource);
    buzzerPlayer.loop = true;
    buzzerPlayer.volume = 1.0;
    buzzerPlayer.play();
  } catch (error) {
    console.error('Buzzer start failed:', error);
  }
}

export async function stopBuzzer(): Promise<void> {
  try {
    if (buzzerPlayer) {
      buzzerPlayer.pause();
      buzzerPlayer.remove();
      buzzerPlayer = null;
    }
  } catch (error) {
    console.error('Buzzer stop failed:', error);
  }
}
