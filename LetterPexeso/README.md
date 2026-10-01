# LetterPexeso

Pexeso (memory game) with Czech alphabet letters for children. iPhone first (Expo / React Native, landscape).
Each game picks random distinct letters of the Czech alphabet (incl. CH), default 18 cards in a 6 x 3 grid
(landscape; rows / columns swapped when the window is taller than wide, e.g. the web preview).

Settings (⚙ in the game header; persisted with AsyncStorage) - `_LetterPexeso_PROMPTS.md` / "Follow-up prompt 6", "Q&A 8", "Q&A 9",
"Follow-up prompt 7/8": háčky (on) / čárky incl. Ů (off) checkboxes, CH always; sizes 2x2 ... 4x10 (sizes needing more letters
than available are greyed); sound on/off (mutes letter + image cards only; ear "sound-only" cards always play); two columns
(card 1 / card 2) with letters / images / sound-only, VELKÁ / malá and tiskací / psací – nevázané (Comenia) / psací – tradiční vázané
(case + style active only for letters). Scoring: match = right; a mismatch is wrong only when the partner of either card was
already seen or either card is turned for the 3rd+ time; results show wrong tries and total tries.

**Psací fonts (bundled):** Comenia-Script style = **Playwrite FR Moderne**, tradiční vázané písmo = **Playwrite CZ**
(TypeTogether, https://github.com/TypeTogether/Playwrite; SIL Open Font License 1.1 - licence texts `assets/fonts/OFL_*.txt`).
Static Regular instances (fontTools instancer, full Czech coverage, calt joining kept) in `assets/fonts/`, loaded with
expo-font `useFonts` in the app root (App.tsx waits for them; on load error system italic fallback); family names in
`src/components/letterFonts.ts`. Comenia Script itself is a paid font and is not used; the settings label "Psací – nevázané (Comenia)" means the unjoined Comenia-style script (rendered with the look-alike Playwrite FR Moderne).

Requirements and decisions: `_LetterPexeso_PROMPTS.md`.

## Structure
- `App.tsx` — root: game + settings screen shown on top of it.
- `src/PexesoGame.tsx`, `src/PexesoSettingsScreen.tsx`, `src/pexesoSettingsStorage.ts`, `src/game/pexesoLogic.ts` (pure logic:
  letter pools, deck, reducer, scoring), `src/components/` — IDENTICAL to LetterTraining `src/pexeso/` (keep in sync).
- `src/pexesoPlatform.ts` — the only app-specific glue (audio + word data); `src/audioController.ts` copied from LetterTraining.
- `src/pexesoWords.ts` + `assets/images`, `assets/audio/{words,letters}` — GENERATED / copied from LetterTraining by endgame2
  `AGENTS/Tasks/20261001_090718_LetterTraining/scripts/pexeso/gen_pexeso_words.py` (Level-1-eligible words only; re-run after
  LetterTraining `src/words.ts` changes).

## Run on iPhone (Expo Go)
```bash
npm install
npx expo start
```
Scan the QR code with the iPhone camera (same Wi-Fi) to open the app in Expo Go.
Expo Go requires a free Expo account signed in on BOTH sides: `npx expo login` on the CLI AND sign-in in the Expo Go app with the same account.

## Tests / checks
```bash
npm test            # jest (jest-expo preset)
npx tsc --noEmit    # typecheck
npx expo-doctor     # dependency / config diagnostics
```
