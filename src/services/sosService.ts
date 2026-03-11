import * as SMS from 'expo-sms';
import * as Haptics from 'expo-haptics';
import { EmergencyContact, LocationData } from '../types';
import { formatLocationForSMS } from './locationService';
import { APP_NAME } from '../constants';

export async function sendSOSMessage(
  contacts: EmergencyContact[],
  location: LocationData | null
): Promise<boolean> {
  const isAvailable = await SMS.isAvailableAsync();
  if (!isAvailable) return false;

  const phoneNumbers = contacts.map((c) => c.phoneNumber);
  if (phoneNumbers.length === 0) return false;

  let message = `【${APP_NAME} 緊急通報】\n助けが必要です！`;

  if (location) {
    const mapsUrl = formatLocationForSMS(location);
    message += `\n\n現在地: ${mapsUrl}`;
  }

  message += `\n\nこのメッセージは${APP_NAME}アプリから自動送信されました。`;

  try {
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    const { result } = await SMS.sendSMSAsync(phoneNumbers, message);
    return result === 'sent' || result === 'unknown';
  } catch {
    return false;
  }
}

export async function triggerSOSHaptic(): Promise<void> {
  await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
}
