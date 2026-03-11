import * as Location from 'expo-location';
import { LocationData } from '../types';

export async function requestLocationPermission(): Promise<boolean> {
  const { status } = await Location.requestForegroundPermissionsAsync();
  return status === 'granted';
}

export async function getCurrentLocation(): Promise<LocationData | null> {
  try {
    const hasPermission = await requestLocationPermission();
    if (!hasPermission) return null;

    const location = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.High,
    });

    return {
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
      accuracy: location.coords.accuracy,
      timestamp: location.timestamp,
    };
  } catch {
    return null;
  }
}

export function formatLocationForSMS(location: LocationData): string {
  const mapsUrl = `https://maps.apple.com/?q=${location.latitude},${location.longitude}`;
  return mapsUrl;
}

export function formatLocationText(location: LocationData): string {
  return `緯度: ${location.latitude.toFixed(6)}, 経度: ${location.longitude.toFixed(6)}`;
}
