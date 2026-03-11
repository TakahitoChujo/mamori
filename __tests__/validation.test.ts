import {
  sanitizePhoneNumber,
  isValidPhoneNumber,
  sanitizeTextInput,
} from '../src/utils/validation';

describe('sanitizePhoneNumber', () => {
  it('removes dashes and spaces from phone number', () => {
    expect(sanitizePhoneNumber('090-1234-5678')).toBe('09012345678');
    expect(sanitizePhoneNumber('090 1234 5678')).toBe('09012345678');
  });

  it('preserves leading + for international format', () => {
    expect(sanitizePhoneNumber('+81-90-1234-5678')).toBe('+819012345678');
  });

  it('removes non-digit characters', () => {
    expect(sanitizePhoneNumber('(090)1234-5678')).toBe('09012345678');
  });

  it('trims whitespace', () => {
    expect(sanitizePhoneNumber('  09012345678  ')).toBe('09012345678');
  });
});

describe('isValidPhoneNumber', () => {
  it('accepts valid Japanese mobile numbers', () => {
    expect(isValidPhoneNumber('09012345678')).toBe(true);
    expect(isValidPhoneNumber('08012345678')).toBe(true);
    expect(isValidPhoneNumber('07012345678')).toBe(true);
  });

  it('accepts valid Japanese landline numbers', () => {
    expect(isValidPhoneNumber('0312345678')).toBe(true);
  });

  it('accepts international format +81', () => {
    expect(isValidPhoneNumber('+819012345678')).toBe(true);
  });

  it('rejects too short numbers', () => {
    expect(isValidPhoneNumber('090123')).toBe(false);
    expect(isValidPhoneNumber('')).toBe(false);
  });

  it('rejects invalid formats', () => {
    expect(isValidPhoneNumber('abcdefghijk')).toBe(false);
    expect(isValidPhoneNumber('12345')).toBe(false);
  });

  it('rejects null/undefined-like inputs', () => {
    expect(isValidPhoneNumber('')).toBe(false);
  });
});

describe('sanitizeTextInput', () => {
  it('removes dangerous characters', () => {
    expect(sanitizeTextInput('<script>alert("xss")</script>')).toBe(
      'scriptalert(xss)/script'
    );
  });

  it('trims whitespace', () => {
    expect(sanitizeTextInput('  hello  ')).toBe('hello');
  });

  it('enforces max length', () => {
    const longString = 'a'.repeat(100);
    expect(sanitizeTextInput(longString, 10)).toHaveLength(10);
  });

  it('uses default max length of 50', () => {
    const longString = 'a'.repeat(100);
    expect(sanitizeTextInput(longString)).toHaveLength(50);
  });
});
