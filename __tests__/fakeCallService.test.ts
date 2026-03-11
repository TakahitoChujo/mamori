import {
  scheduleFakeCall,
  cancelFakeCall,
} from '../src/services/fakeCallService';
import { FakeCallConfig } from '../src/types';

describe('fakeCallService', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    cancelFakeCall();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  describe('scheduleFakeCall', () => {
    it('calls onRing after specified delay', () => {
      const onRing = jest.fn();
      const config: FakeCallConfig = {
        callerName: 'お母さん',
        delaySeconds: 5,
        ringtoneEnabled: true,
      };

      scheduleFakeCall(config, onRing);

      expect(onRing).not.toHaveBeenCalled();

      jest.advanceTimersByTime(5000);

      expect(onRing).toHaveBeenCalledTimes(1);
    });

    it('does not call onRing before delay', () => {
      const onRing = jest.fn();
      const config: FakeCallConfig = {
        callerName: 'お母さん',
        delaySeconds: 10,
        ringtoneEnabled: true,
      };

      scheduleFakeCall(config, onRing);
      jest.advanceTimersByTime(9999);

      expect(onRing).not.toHaveBeenCalled();
    });
  });

  describe('cancelFakeCall', () => {
    it('prevents onRing from being called', () => {
      const onRing = jest.fn();
      const config: FakeCallConfig = {
        callerName: 'お母さん',
        delaySeconds: 5,
        ringtoneEnabled: true,
      };

      scheduleFakeCall(config, onRing);
      cancelFakeCall();
      jest.advanceTimersByTime(10000);

      expect(onRing).not.toHaveBeenCalled();
    });
  });
});
