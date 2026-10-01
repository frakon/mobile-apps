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
- `src/pexesoWords.ts` + `assets/audio/letters` — GENERATED / copied from LetterTraining by endgame2
  `AGENTS/Tasks/20261001_090718_LetterTraining/scripts/pexeso/gen_pexeso_words.py` (Level-1-eligible words only; re-run after
  LetterTraining `src/words.ts` changes), then converted to the archive model by endgame2
  `AGENTS/Tasks/20261001_162724_LetterTrainingMobileAppsPreferences/scripts/phaseE_transform_pexeso_words.js` (re-run it after
  the generator).
- `src/resources/` — backend resource module, copied byte-identical from LetterTraining `src/resources/` (keep in sync;
  details and manifest contract in `src/resources/README.md`).

## Resources (mobile-apps-preferences)
- **Backend-served:** image-card word pictures + word audio come from the shared `ResourceBackend` (mobile-apps2 repo root;
  VPN-only static fileserver `http://10.67.0.1:9080`, `manifest.json` + per-word `words/<id>.zip`, the same archives as
  LetterTraining). Every archive of the dealt board is downloaded, cached and unpacked hot in memory BEFORE the board shows
  (one round per play: preload everything for the play). Offline with uncached archives → Czech "Jejda!" message + retry.
- **Device cache:** 200MB of compressed zips for this app, last-used tracking, LRU eviction, manifest checksum invalidation.
- **Bundled:** letter audio (warmed at app start in `App.tsx`), fonts, the ear picture, UI assets and three downsized
  (168 px) settings preview samples in `assets/images/pexeso_samples/`. Letters-only and sound-only boards work fully offline.
- The old bundled word assets `assets/images/*.jpg|*.png` and `assets/audio/words/` are no longer referenced (kept in the
  repo, not bundled).
- Start animation: while the board's archives load, a themed ≤5 s animation plays (6 cards fly onto the table within
  1 s, a matching pair vanishes with a sparkle, a different pair turns back), then holds its last frame („Připravuji
  hru…"); cut immediately when ready. `src/startAnimation/` is shared byte-identical with LetterTraining (RN core
  `Animated`, no extra dependency).

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
