# TreninkPorozumeni

Czech speech-comprehension trainer for children (Expo / React Native, landscape, iPad-first). Three grammar fields — 5.1 reversible sentences, 5.2 prepositions/space, 5.3 singular/plural — each split into two 10-round sub-tests. Each round plays a Czech sentence; the child taps the matching picture among 2 or 4 (setting: target + grammatical distractor, optionally + 2 lexical distractors). A wrong tap turns the picture red and plays a short spoken child-friendly explanation of why it is wrong.

Full behavior spec: `_TreninkPorozumeni_SPEC.md`. All user prompts verbatim: `_TreninkPorozumeni_Fields123_PROMPTS.md`.

## Develop

- `npx expo start` (device: Expo Go, same Wi-Fi; web preview: `npx expo start --web`).
- Checks: `npx tsc --noEmit`, `npx expo export --platform ios`.
- Key files: `app/` (Expo Router screens: `index.tsx` field selection, `settings.tsx`, `game.tsx`), `src/items.ts` (60 examples, static `require` assets), `src/rounds.ts` (round plans, prefetch), `src/settings.ts`, `src/pausedGame.ts`, `src/audioController.ts` (the ONLY place that plays audio: "latest request wins", see `_TreninkPorozumeni_SPEC.md`).
- Assets naming contract (per example id): `assets/images/<id>_target|_gram|_lexa|_lexb.png` (+ provenance `.png.txt`), `assets/audio/<id>.mp3` and `<id>_gram_why|_lexa_why|_lexb_why.mp3` (Edge TTS cs-CZ).

**Before creating any new example, explanation text, or image: read `_TreninkPorozumeni_LEARNINGS.md`** (user-derived quality rules for texts and images) and `_ImageGenerationLearnings.md` (generation pipeline + blind-test protocol). Rejected/repaired pictures are archived under `ImageLearnings/`.

## Deploy

Per the `ios-expo-react-native` skill (endgame repo, `.claude/skills/`): pack without `node_modules`, upload to EndgameServer `/apps/MobileApps/TreninkPorozumeni`, `npm ci`, run Metro in screen `expo`, then open the app in Expo Go over WireGuard using the `exp://` URL from the skill's deploy section (printed by Metro on start).
