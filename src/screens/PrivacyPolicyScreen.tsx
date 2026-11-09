import * as SecureStore from 'expo-secure-store';
import { MeasurementRecord } from '../types';

const HISTORY_KEY = 'dimensionmass_history';

export async function saveMeasurement(record: MeasurementRecord): Promise<void> {
  const raw = await SecureStore.getItemAsync(HISTORY_KEY);
  const previous: MeasurementRecord[] = raw ? JSON.parse(raw) : [];
  const next = [record, ...previous].slice(0, 50);
  await SecureStore.setItemAsync(HISTORY_KEY, JSON.stringify(next));
}

export async function loadMeasurementHistory(): Promise<MeasurementRecord[]> {
  const raw = await SecureStore.getItemAsync(HISTORY_KEY);
  if (!raw) return [];

  try {
    const parsed: MeasurementRecord[] = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}
