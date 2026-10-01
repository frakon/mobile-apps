// Persisted pexeso settings (AsyncStorage, same pattern as LetterTraining src/compose/settings.ts) - FINAL SPEC 1 of the
// evaluation for `_LetterPexeso_PROMPTS.md` / "Follow-up prompt 6 — Pexeso improvements (standalone LetterPexeso +
// integrated in LetterTraining) (verbatim)". IDENTICAL file in LetterPexeso and LetterTraining.

import AsyncStorage from '@react-native-async-storage/async-storage';

import { DEFAULT_SETTINGS, PexesoSettings, sanitizeSettings } from './game/pexesoLogic';

const SETTINGS_STORAGE_KEY = 'pexeso.settings';

export async function loadPexesoSettings(): Promise<PexesoSettings> {
  try {
    const stored = await AsyncStorage.getItem(SETTINGS_STORAGE_KEY);
    return stored === null ? DEFAULT_SETTINGS : sanitizeSettings(JSON.parse(stored));
  } catch {
    return DEFAULT_SETTINGS; // storage failure / corrupt JSON -> defaults
  }
}

export async function savePexesoSettings(settings: PexesoSettings): Promise<void> {
  try {
    await AsyncStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
  } catch {
    // Save failed: the next load falls back to the defaults.
  }
}
