import { useAppStore } from '../src/store/appStore';

describe('appStore', () => {
  beforeEach(() => {
    // Reset store to initial state
    useAppStore.setState({
      sosStatus: 'idle',
      buzzerStatus: 'idle',
      fakeCallStatus: 'idle',
      currentLocation: null,
      returnTimer: {
        durationMinutes: 30,
        isActive: false,
        startedAt: null,
        destination: '',
      },
    });
  });

  describe('SOS', () => {
    it('updates SOS status', () => {
      useAppStore.getState().setSosStatus('confirming');
      expect(useAppStore.getState().sosStatus).toBe('confirming');
    });
  });

  describe('Buzzer', () => {
    it('updates buzzer status', () => {
      useAppStore.getState().setBuzzerStatus('playing');
      expect(useAppStore.getState().buzzerStatus).toBe('playing');
    });
  });

  describe('Fake Call', () => {
    it('updates fake call status', () => {
      useAppStore.getState().setFakeCallStatus('ringing');
      expect(useAppStore.getState().fakeCallStatus).toBe('ringing');
    });

    it('updates fake call config', () => {
      useAppStore.getState().setFakeCallConfig({ callerName: 'パパ' });
      expect(useAppStore.getState().fakeCallConfig.callerName).toBe('パパ');
      // Other config values should remain
      expect(useAppStore.getState().fakeCallConfig.delaySeconds).toBe(5);
    });
  });

  describe('Return Timer', () => {
    it('starts timer with current timestamp', () => {
      const before = Date.now();
      useAppStore.getState().startReturnTimer();
      const state = useAppStore.getState().returnTimer;

      expect(state.isActive).toBe(true);
      expect(state.startedAt).toBeGreaterThanOrEqual(before);
    });

    it('stops timer and clears startedAt', () => {
      useAppStore.getState().startReturnTimer();
      useAppStore.getState().stopReturnTimer();
      const state = useAppStore.getState().returnTimer;

      expect(state.isActive).toBe(false);
      expect(state.startedAt).toBeNull();
    });

    it('updates duration', () => {
      useAppStore.getState().setReturnTimer({ durationMinutes: 60 });
      expect(useAppStore.getState().returnTimer.durationMinutes).toBe(60);
    });
  });

  describe('Location', () => {
    it('stores current location', () => {
      const location = {
        latitude: 35.6762,
        longitude: 139.6503,
        accuracy: 10,
        timestamp: Date.now(),
      };
      useAppStore.getState().setCurrentLocation(location);
      expect(useAppStore.getState().currentLocation).toEqual(location);
    });
  });
});
