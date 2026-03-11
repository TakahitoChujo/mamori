import { createAudioPlayer, setAudioModeAsync, type AudioPlayer } from 'expo-audio';
import * as Haptics from 'expo-haptics';
import { FakeCallConfig } from '../types';

let ringtonePlayer: AudioPlayer | null = null;
let scheduledTimeout: ReturnType<typeof setTimeout> | null = null;
let vibrationInterval: ReturnType<typeof setInterval> | null = null;

export function scheduleFakeCall(
  config: FakeCallConfig,
  onRing: () => void
): void {
  cancelFakeCall();

  scheduledTimeout = setTimeout(() => {
    onRing();
  }, config.delaySeconds * 1000);
}

export async function startRinging(): Promise<void> {
  try {
    await setAudioModeAsync({
      playsInSilentMode: true,
    });

    ringtonePlayer = createAudioPlayer(require('../../assets/ringtone.mp3'));
    ringtonePlayer.loop = true;
    ringtonePlayer.volume = 1.0;
    ringtonePlayer.play();

    vibrationInterval = setInterval(() => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    }, 1000);
  } catch (error) {
    console.error('Ringtone start failed:', error);
  }
}

export async function stopRinging(): Promise<void> {
  try {
    if (ringtonePlayer) {
      ringtonePlayer.pause();
      ringtonePlayer.remove();
      ringtonePlayer = null;
    }
    if (vibrationInterval) {
      clearInterval(vibrationInterval);
      vibrationInterval = null;
    }
  } catch (error) {
    console.error('Ringtone stop failed:', error);
  }
}

export function cancelFakeCall(): void {
  if (scheduledTimeout) {
    clearTimeout(scheduledTimeout);
    scheduledTimeout = null;
  }
  stopRinging();
}
