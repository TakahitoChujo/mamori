import { create } from 'zustand';
import {
  SOSStatus,
  BuzzerStatus,
  FakeCallStatus,
  LocationData,
  ReturnTimerConfig,
  FakeCallConfig,
} from '../types';
import { DEFAULT_RETURN_TIMER_MINUTES, FAKE_CALL_DEFAULT_DELAY_SECONDS } from '../constants';

interface AppState {
  // SOS
  sosStatus: SOSStatus;
  setSosStatus: (status: SOSStatus) => void;

  // Buzzer
  buzzerStatus: BuzzerStatus;
  setBuzzerStatus: (status: BuzzerStatus) => void;

  // Fake Call
  fakeCallStatus: FakeCallStatus;
  setFakeCallStatus: (status: FakeCallStatus) => void;
  fakeCallConfig: FakeCallConfig;
  setFakeCallConfig: (config: Partial<FakeCallConfig>) => void;

  // Location
  currentLocation: LocationData | null;
  setCurrentLocation: (location: LocationData | null) => void;

  // Return Timer
  returnTimer: ReturnTimerConfig;
  setReturnTimer: (config: Partial<ReturnTimerConfig>) => void;
  startReturnTimer: () => void;
  stopReturnTimer: () => void;
}

export const useAppStore = create<AppState>((set, get) => ({
  // SOS
  sosStatus: 'idle',
  setSosStatus: (status) => set({ sosStatus: status }),

  // Buzzer
  buzzerStatus: 'idle',
  setBuzzerStatus: (status) => set({ buzzerStatus: status }),

  // Fake Call
  fakeCallStatus: 'idle',
  setFakeCallStatus: (status) => set({ fakeCallStatus: status }),
  fakeCallConfig: {
    callerName: 'お母さん',
    delaySeconds: FAKE_CALL_DEFAULT_DELAY_SECONDS,
    ringtoneEnabled: true,
  },
  setFakeCallConfig: (config) =>
    set((state) => ({
      fakeCallConfig: { ...state.fakeCallConfig, ...config },
    })),

  // Location
  currentLocation: null,
  setCurrentLocation: (location) => set({ currentLocation: location }),

  // Return Timer
  returnTimer: {
    durationMinutes: DEFAULT_RETURN_TIMER_MINUTES,
    isActive: false,
    startedAt: null,
    destination: '',
  },
  setReturnTimer: (config) =>
    set((state) => ({
      returnTimer: { ...state.returnTimer, ...config },
    })),
  startReturnTimer: () =>
    set((state) => ({
      returnTimer: { ...state.returnTimer, isActive: true, startedAt: Date.now() },
    })),
  stopReturnTimer: () =>
    set((state) => ({
      returnTimer: { ...state.returnTimer, isActive: false, startedAt: null },
    })),
}));
