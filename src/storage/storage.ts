import AsyncStorage from '@react-native-async-storage/async-storage';

const KEYS = {
  weights: '@streakdiaet/weights',
  water: '@streakdiaet/water',
  meals: '@streakdiaet/meals',
  settings: '@streakdiaet/settings',
} as const;

export async function loadJson<T>(key: keyof typeof KEYS, fallback: T): Promise<T> {
  const raw = await AsyncStorage.getItem(KEYS[key]);
  if (!raw) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export async function saveJson<T>(key: keyof typeof KEYS, value: T): Promise<void> {
  await AsyncStorage.setItem(KEYS[key], JSON.stringify(value));
}

export async function clearAll(): Promise<void> {
  await AsyncStorage.multiRemove(Object.values(KEYS));
}
