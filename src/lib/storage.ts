import AsyncStorage from '@react-native-async-storage/async-storage';

import type { KeelState } from '@/types';

export const STORAGE_KEY = 'keel.v2';

export async function loadState(): Promise<KeelState | null> {
  const raw = await AsyncStorage.getItem(STORAGE_KEY);
  if (!raw) return null;
  return JSON.parse(raw) as KeelState;
}

export async function saveState(state: KeelState): Promise<void> {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}
