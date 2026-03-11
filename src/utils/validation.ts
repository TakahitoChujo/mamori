/**
 * Sanitize phone number: remove non-digit characters except leading +
 */
export function sanitizePhoneNumber(input: string): string {
  const trimmed = input.trim();
  if (trimmed.startsWith('+')) {
    return '+' + trimmed.slice(1).replace(/[^\d]/g, '');
  }
  return trimmed.replace(/[^\d]/g, '');
}

/**
 * Validate Japanese phone number format
 * Accepts: 090XXXXXXXX, 080XXXXXXXX, 070XXXXXXXX, 0X0-XXXX-XXXX, +81XXXXXXXXX
 */
export function isValidPhoneNumber(phone: string): boolean {
  if (!phone || phone.length < 10) return false;

  // Japanese mobile: 070/080/090 + 8 digits
  if (/^0[789]0\d{8}$/.test(phone)) return true;

  // Japanese landline: 0X-XXXX-XXXX (10 digits)
  if (/^0\d{9,10}$/.test(phone)) return true;

  // International format +81
  if (/^\+81\d{9,10}$/.test(phone)) return true;

  // General international format
  if (/^\+\d{10,15}$/.test(phone)) return true;

  return false;
}

/**
 * Sanitize text input to prevent injection
 */
export function sanitizeTextInput(input: string, maxLength: number = 50): string {
  return input
    .replace(/[<>"'&]/g, '')
    .trim()
    .slice(0, maxLength);
}
