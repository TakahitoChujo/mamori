import {
  formatLocationForSMS,
  formatLocationText,
  getCurrentLocation,
} from '../src/services/locationService';
import * as Location from 'expo-location';

describe('locationService', () => {
  describe('formatLocationForSMS', () => {
    it('generates Apple Maps URL with coordinates', () => {
      const location = {
        latitude: 35.6762,
        longitude: 139.6503,
        accuracy: 10,
        timestamp: Date.now(),
      };
      const url = formatLocationForSMS(location);
      expect(url).toBe('https://maps.apple.com/?q=35.6762,139.6503');
    });
  });

  describe('formatLocationText', () => {
    it('formats coordinates with 6 decimal places', () => {
      const location = {
        latitude: 35.6762,
        longitude: 139.6503,
        accuracy: 10,
        timestamp: Date.now(),
      };
      const text = formatLocationText(location);
      expect(text).toContain('35.676200');
      expect(text).toContain('139.650300');
    });
  });

  describe('getCurrentLocation', () => {
    it('returns location when permission is granted', async () => {
      const location = await getCurrentLocation();
      expect(location).not.toBeNull();
      expect(location?.latitude).toBe(35.6762);
      expect(location?.longitude).toBe(139.6503);
    });

    it('returns null when permission is denied', async () => {
      (Location.requestForegroundPermissionsAsync as jest.Mock).mockResolvedValueOnce({
        status: 'denied',
      });
      const location = await getCurrentLocation();
      expect(location).toBeNull();
    });
  });
});
