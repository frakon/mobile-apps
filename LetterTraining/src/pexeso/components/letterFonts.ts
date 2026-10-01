import { TextStyle } from 'react-native';

import type { LetterStyle } from '../game/pexesoLogic';

// Font hooks of the letter styles - `_LetterPexeso_PROMPTS.md` / "Follow-up prompt 7 (verbatim)" + "Follow-up prompt 8
// (verbatim)" (psací: Comenia Script style AND tradiční vázané písmo; the user chooses the fonts from candidates).
// Bundled fonts (user choice, `_LetterPexeso_PROMPTS.md` / "Q&A 10 — psací fonts"): Comenia-Script style = Playwrite FR
// Moderne, tradiční vázané písmo = Playwrite CZ (both SIL OFL 1.1, static Regular instances in assets/fonts with OFL texts).
// The app root loads them with expo-font useFonts (keys = the family names below; the require() map lives in the root
// because the relative asset path differs between LetterTraining and LetterPexeso - this file stays byte-identical) and
// waits until loading finished. If loading FAILED, the root calls setLetterFontsLoaded(false) and both cursive styles
// fall back to the system italic (DECISION, not user-specified).
export const CURSIVE_COMENIA_FONT_FAMILY = 'PlaywriteFRModerne-Regular';
export const CURSIVE_TRADITIONAL_FONT_FAMILY = 'PlaywriteCZ-Regular';

let areLetterFontsLoaded = false;

// Called by the app root once useFonts has finished (true = loaded, false = load error -> italic fallback).
export function setLetterFontsLoaded(loaded: boolean): void {
  areLetterFontsLoaded = loaded;
}

export function letterStyleTextStyle(letterStyle: LetterStyle): TextStyle {
  if (letterStyle === 'cursiveComenia') {
    return areLetterFontsLoaded
      ? { fontFamily: CURSIVE_COMENIA_FONT_FAMILY, fontWeight: 'normal' }
      : { fontStyle: 'italic', fontWeight: '600' };
  }
  if (letterStyle === 'cursiveTraditional') {
    return areLetterFontsLoaded
      ? { fontFamily: CURSIVE_TRADITIONAL_FONT_FAMILY, fontWeight: 'normal' }
      : { fontStyle: 'italic', fontWeight: '800' };
  }
  return {};
}
