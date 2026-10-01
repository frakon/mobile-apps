// Settings of "Abecedový vlak" persisted with AsyncStorage (same pattern as src/compose/settings.ts) -
// `_LetterTraining_PROMPTS.md` / "## Follow-up prompt 5 — new game "Abecedový vlak" (verbatim)" (alphabet CZ/EN,
// default czech; capitals or lower letters), "## Q&A 6" (waiting wagons 4–8), "## Q&A 7" (default 6, remembered).

import AsyncStorage from '@react-native-async-storage/async-storage';

import { DEFAULT_WAITING_WAGONS, TrainAlphabet, TrainLetterCase, clampWaitingWagons } from './logic';

const STORAGE_KEY = 'train.settings';

export interface TrainSettings {
  readonly alphabet: TrainAlphabet;
  readonly letterCase: TrainLetterCase;
  readonly waitingWagons: number;
}

// DECISION (not user-specified): default letter case CAPITALS (evaluation "Final decisions").
export const DEFAULT_TRAIN_SETTINGS: TrainSettings = { alphabet: 'cz', letterCase: 'upper', waitingWagons: DEFAULT_WAITING_WAGONS };

export function parseTrainSettings(raw: string | null): TrainSettings {
  if (raw === null) {
    return DEFAULT_TRAIN_SETTINGS;
  }
  try {
    const value = JSON.parse(raw) as Partial<Record<keyof TrainSettings, unknown>>;
    return {
      alphabet: value.alphabet === 'en' ? 'en' : 'cz',
      letterCase: value.letterCase === 'lower' ? 'lower' : 'upper',
      waitingWagons: typeof value.waitingWagons === 'number' ? clampWaitingWagons(value.waitingWagons) : DEFAULT_WAITING_WAGONS,
    };
  } catch {
    return DEFAULT_TRAIN_SETTINGS;
  }
}

export async function loadTrainSettings(): Promise<TrainSettings> {
  try {
    return parseTrainSettings(await AsyncStorage.getItem(STORAGE_KEY));
  } catch {
    return DEFAULT_TRAIN_SETTINGS;
  }
}

export async function saveTrainSettings(settings: TrainSettings): Promise<void> {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  } catch {
    // Save failed: the next load falls back to the defaults.
  }
}
