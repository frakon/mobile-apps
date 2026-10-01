// Settings of the "Skládání slov" game persisted with AsyncStorage (same pattern as TreninkPorozumeni src/settings.ts) -
// `_LetterTraining_PROMPTS.md` / "## Q&A 5 — Skládání slov round 2" (tiles "Chooseable in settings of the game
// (CAPITALS, lower_case)").

import AsyncStorage from '@react-native-async-storage/async-storage';

import { ComposeLengthRange, ComposeVariant, TileCase } from './logic';

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

// ---- Word length range per variant (`_LetterTraining_PROMPTS.md` / "## Follow-up prompt 19") ----
// Stored as JSON {min,max} per variant; missing / invalid -> null = the full range (default). Callers clamp the value
// into the current dataset bounds (clampComposeLengthRange), so a changed word list never yields an impossible range.

function lengthRangeStorageKey(variant: ComposeVariant): string {
  return `compose.lengthRange.${variant}`;
}

export async function loadComposeLengthRange(variant: ComposeVariant): Promise<ComposeLengthRange | null> {
  try {
    const stored = await AsyncStorage.getItem(lengthRangeStorageKey(variant));
    if (stored === null) {
      return null;
    }
    const parsed = JSON.parse(stored) as { min?: unknown; max?: unknown };
    return typeof parsed.min === 'number' && typeof parsed.max === 'number' ? { min: parsed.min, max: parsed.max } : null;
  } catch {
    return null; // storage / parse failure -> full range
  }
}

export async function saveComposeLengthRange(variant: ComposeVariant, range: ComposeLengthRange): Promise<void> {
  try {
    await AsyncStorage.setItem(lengthRangeStorageKey(variant), JSON.stringify({ min: range.min, max: range.max }));
  } catch {
    // Save failed: the game falls back to the full range.
  }
}
