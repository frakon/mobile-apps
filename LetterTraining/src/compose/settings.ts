// Settings of the "Skládání slov" game persisted with AsyncStorage (same pattern as TreninkPorozumeni src/settings.ts) -
// `_LetterTraining_PROMPTS.md` / "## Q&A 5 — Skládání slov round 2" (tiles "Chooseable in settings of the game
// (CAPITALS, lower_case)").

import AsyncStorage from '@react-native-async-storage/async-storage';

import { TileCase } from './logic';

const TILE_CASE_STORAGE_KEY = 'compose.tileCase';

// DECISION (not user-specified): default CAPITALS, consistent with the uppercase options of Začátky slov.
export const DEFAULT_TILE_CASE: TileCase = 'upper';

export async function loadTileCase(): Promise<TileCase> {
  try {
    const stored = await AsyncStorage.getItem(TILE_CASE_STORAGE_KEY);
    return stored === 'lower' ? 'lower' : stored === 'upper' ? 'upper' : DEFAULT_TILE_CASE;
  } catch {
    return DEFAULT_TILE_CASE; // storage failure -> default
  }
}

export async function saveTileCase(tileCase: TileCase): Promise<void> {
  try {
    await AsyncStorage.setItem(TILE_CASE_STORAGE_KEY, tileCase);
  } catch {
    // Save failed: the game re-reads storage via loadTileCase() and falls back to the default.
  }
}
