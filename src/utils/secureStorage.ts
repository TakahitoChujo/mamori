import * as SecureStore from 'expo-secure-store';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SECURE_STORE_AVAILABLE = true;

/**
 * Store sensitive data using SecureStore (Keychain on iOS).
 * Falls back to AsyncStorage in environments where SecureStore is unavailable (e.g. Expo Go web).
 */
export async function secureSetItem(key: string, value: string): Promise<void> {
  try {
    if (SECURE_STORE_AVAILABLE) {
      await SecureStore.setItemAsync(key, value);
    } else {
      await AsyncStorage.setItem(key, value);
    }
  } catch {
    // Fallback to AsyncStorage if SecureStore fails
    await AsyncStorage.setItem(key, value);
  }
}

export async function secureGetItem(key: string): Promise<string | null> {
  try {
    if (SECURE_STORE_AVAILABLE) {
      return await SecureStore.getItemAsync(key);
    }
    return await AsyncStorage.getItem(key);
  } catch {
    return await AsyncStorage.getItem(key);
  }
}

export async function secureDeleteItem(key: string): Promise<void> {
  try {
    if (SECURE_STORE_AVAILABLE) {
      await SecureStore.deleteItemAsync(key);
    } else {
      await AsyncStorage.removeItem(key);
    }
  } catch {
    await AsyncStorage.removeItem(key);
  }
}
