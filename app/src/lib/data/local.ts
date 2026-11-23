import AsyncStorage from '@react-native-async-storage/async-storage';

/** Tiny on-device store used in test mode (localStorage on web). */
export async function readLocal<T>(key: string, fallback: T): Promise<T> {
  try {
    const raw = await AsyncStorage.getItem(`dreamlife.local.${key}`);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

export async function writeLocal<T>(key: string, value: T): Promise<void> {
  await AsyncStorage.setItem(`dreamlife.local.${key}`, JSON.stringify(value));
}
