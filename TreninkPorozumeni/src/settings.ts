// App settings persisted with AsyncStorage.
// Setting #1 — image regime (2 vs 4 images) — requested in
// _TreninkPorozumeni_Fields123_PROMPTS.md (section "User request", settings bullet).
// Setting #2 — speech speed in percent (60–150, integer; animal-labeled slider) — requested
// in _TreninkPorozumeni_Fields123_PROMPTS.md (section "User follow-up request 21").

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

// Speech speed ("User follow-up request 21"): percent of the mp3s' natural speed, any
// integer in [60, 150] (continuous slider values like 64 % or 90 % are allowed; the animal
// labels 60/80/100/120/150 are just jump-to marks). Played via expo-audio
// AudioPlayer.setPlaybackRate(percent / 100, 'high') — no special mp3s are produced.
const SPEECH_SPEED_STORAGE_KEY = 'settings.speechSpeedPercent';

export const DEFAULT_SPEECH_SPEED_PERCENT = 100;
export const MIN_SPEECH_SPEED_PERCENT = 60;
export const MAX_SPEECH_SPEED_PERCENT = 150;

// Any value coming from storage (or a slider) is normalized to an integer inside the range.
export function clampSpeechSpeedPercent(value: number): number {
  if (!Number.isFinite(value)) {
    return DEFAULT_SPEECH_SPEED_PERCENT;
  }
  return Math.min(MAX_SPEECH_SPEED_PERCENT, Math.max(MIN_SPEECH_SPEED_PERCENT, Math.round(value)));
}

export async function loadSpeechSpeedPercent(): Promise<number> {
  try {
    const stored = await AsyncStorage.getItem(SPEECH_SPEED_STORAGE_KEY);
    if (stored === null) {
      return DEFAULT_SPEECH_SPEED_PERCENT;
    }
    return clampSpeechSpeedPercent(Number(stored));
  } catch {
    return DEFAULT_SPEECH_SPEED_PERCENT; // storage failure → natural speed
  }
}

export async function saveSpeechSpeedPercent(percent: number): Promise<void> {
  try {
    await AsyncStorage.setItem(SPEECH_SPEED_STORAGE_KEY, String(clampSpeechSpeedPercent(percent)));
  } catch {
    // Save failed: the game re-reads storage via loadSpeechSpeedPercent(), so it falls back to the default speed.
  }
}
