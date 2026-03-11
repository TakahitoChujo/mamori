import { sendSOSMessage } from '../src/services/sosService';
import * as SMS from 'expo-sms';
import { EmergencyContact, LocationData } from '../src/types';

describe('sosService', () => {
  const mockContacts: EmergencyContact[] = [
    { id: '1', name: 'お母さん', phoneNumber: '09012345678', relationship: '母' },
    { id: '2', name: '友人A', phoneNumber: '08087654321', relationship: '友人' },
  ];

  const mockLocation: LocationData = {
    latitude: 35.6762,
    longitude: 139.6503,
    accuracy: 10,
    timestamp: Date.now(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('sends SMS to all emergency contacts with location', async () => {
    const result = await sendSOSMessage(mockContacts, mockLocation);
    expect(result).toBe(true);
    expect(SMS.sendSMSAsync).toHaveBeenCalledWith(
      ['09012345678', '08087654321'],
      expect.stringContaining('緊急通報')
    );
  });

  it('includes Apple Maps URL in message when location is provided', async () => {
    await sendSOSMessage(mockContacts, mockLocation);
    expect(SMS.sendSMSAsync).toHaveBeenCalledWith(
      expect.any(Array),
      expect.stringContaining('maps.apple.com')
    );
  });

  it('sends message without location when location is null', async () => {
    await sendSOSMessage(mockContacts, null);
    expect(SMS.sendSMSAsync).toHaveBeenCalledWith(
      expect.any(Array),
      expect.not.stringContaining('maps.apple.com')
    );
  });

  it('returns false when no contacts are provided', async () => {
    const result = await sendSOSMessage([], mockLocation);
    expect(result).toBe(false);
  });

  it('returns false when SMS is not available', async () => {
    (SMS.isAvailableAsync as jest.Mock).mockResolvedValueOnce(false);
    const result = await sendSOSMessage(mockContacts, mockLocation);
    expect(result).toBe(false);
  });
});
