export interface EmergencyContact {
  id: string;
  name: string;
  phoneNumber: string;
  relationship: string;
}

export interface LocationData {
  latitude: number;
  longitude: number;
  accuracy: number | null;
  timestamp: number;
}

export interface FakeCallConfig {
  callerName: string;
  delaySeconds: number;
  ringtoneEnabled: boolean;
}

export interface ReturnTimerConfig {
  durationMinutes: number;
  isActive: boolean;
  startedAt: number | null;
  destination: string;
}

export type SOSStatus = 'idle' | 'confirming' | 'sending' | 'sent' | 'cancelled';

export type BuzzerStatus = 'idle' | 'playing';

export type FakeCallStatus = 'idle' | 'scheduled' | 'ringing' | 'answered';
