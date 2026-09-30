# LetterPexeso

Pexeso (memory game) with Czech alphabet letters for children. iPhone first (Expo / React Native, landscape).
Each game picks 9 random letters of the 42-letter Czech alphabet (incl. CH and letters with diacritics), shown as 18 cards in a 6 x 3 grid
(landscape; a 3 x 6 grid is the fallback when the window is taller than wide, e.g. the web preview).

Requirements and decisions: `_LetterPexeso_PROMPTS.md`.

## Structure
- `App.tsx` — game screen (grid, background tap, mismatch timer, end overlay).
- `src/game/pexesoLogic.ts` — pure game logic (deck, reducer, stats); no React.
- `src/game/__tests__/pexesoLogic.test.ts` — unit tests of the logic.
- `src/components/` — `PexesoCard` (card with simple flip effect), `EndOverlay` (statistics + "Hrát znovu").

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
