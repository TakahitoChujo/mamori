import { Audio } from 'expo-av';
import * as Haptics from 'expo-haptics';
import { FakeCallConfig } from '../types';

let ringtoneSound: Audio.Sound | null = null;
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
    await Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
      playsInSilentModeIOS: true,
      staysActiveInBackground: true,
      shouldDuckAndroid: false,
    });

    const { sound } = await Audio.Sound.createAsync(
      require('../../assets/ringtone.mp3'),
      {
        shouldPlay: true,
        isLooping: true,
        volume: 1.0,
      }
    );
    ringtoneSound = sound;

    vibrationInterval = setInterval(() => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    }, 1000);
  } catch (error) {
    console.error('Ringtone start failed:', error);
  }
}

export async function stopRinging(): Promise<void> {
  try {
    if (ringtoneSound) {
      await ringtoneSound.stopAsync();
      await ringtoneSound.unloadAsync();
      ringtoneSound = null;
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
