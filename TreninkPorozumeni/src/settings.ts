// App settings persisted with AsyncStorage.
// Setting #1 — image regime (2 vs 4 images) — requested in
// _TreninkPorozumeni_Fields123_PROMPTS.md (section "User request", settings bullet).

import AsyncStorage from '@react-native-async-storage/async-storage';
import { Regime } from './rounds';

const REGIME_STORAGE_KEY = 'settings.imageRegime';

export const DEFAULT_REGIME: Regime = 2;

export async function loadRegime(): Promise<Regime> {
  try {
    const stored = await AsyncStorage.getItem(REGIME_STORAGE_KEY);
    return stored === '4' ? 4 : DEFAULT_REGIME;
  } catch {
    return DEFAULT_REGIME; // storage failure → fall back to the default regime
  }
}

export async function saveRegime(regime: Regime): Promise<void> {
  try {
    await AsyncStorage.setItem(REGIME_STORAGE_KEY, String(regime));
  } catch {
    // Save failed: the game re-reads storage via loadRegime(), so it falls back to the default regime.
  }
}
