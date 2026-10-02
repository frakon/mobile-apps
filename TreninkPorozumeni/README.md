# TreninkPorozumeni

Czech speech-comprehension trainer for children (Expo / React Native, landscape, iPad-first). Three grammar fields — 5.1 reversible sentences, 5.2 prepositions/space, 5.3 singular/plural — each split into two 10-round sub-tests. Each round plays a Czech sentence; the child taps the matching picture among 2 or 4 (setting: target + grammatical distractor, optionally + 2 lexical distractors). A wrong tap turns the picture red and plays a short spoken child-friendly explanation of why it is wrong.

Full behavior spec: `_TreninkPorozumeni_SPEC.md`. All user prompts verbatim: `_TreninkPorozumeni_Fields123_PROMPTS.md`.

## New or reworked test type — MUST load first

When implementing a new test type or reworking an existing one, FIRST load `_TestTypeScopeRule.md`. It covers the web scope explorer step, the 32–34% minority-form share per played sentence, the mixing and contrast rules, and the retroactive rework (User request 25, follow-up 5).

## Develop

- `npx expo start --port 8081` (device: Expo Go; web preview: `npx expo start --web`). Use `--clear` once after changing `babel.config.js` / `babel-plugin-backend-assets.js`.
- Per-exercise pictures/sounds are NOT bundled (User request 26): they are served as per-item zips by `../ResourceBackend` (VPN only); the game needs the backend reachable (or the rounds cached). Base URL = `EXPO_PUBLIC_RESOURCE_BASE_URL` in the git-ignored `.env.local` (copy `.env.example`; Metro inlines it at bundle time, restart Metro with `--clear` after changing it). DEPLOYER: create `.env.local` in the app folder on the server before starting Metro — the real host comes from the EndgameServer/WireGuard hub notes (not in git); without it every game shows the offline screen. Local test of the backend: `node ../ResourceBackend/pack.js`, then serve `dist/` with `RESOURCE_BACKEND_HOST=127.0.0.1` and point `configureResourceBackend({ baseUrl })` at it.
- Checks: `npx tsc --noEmit`, `npx expo export --platform ios`.
- Key files: `app/` (Expo Router screens: `index.tsx` field selection, `settings.tsx`, `game.tsx`), `src/items.ts` + `src/items/field5X.ts` (examples; their `require` lines are the packer's source and become marker strings in the bundle), `src/itemResources.ts` (round → archive entries), `src/resources/` (backend cache/preload client), `src/StartAnimation.tsx`, `src/rounds.ts` (round plans), `src/settings.ts`, `src/pausedGame.ts`, `src/audioController.ts` (the ONLY place that plays audio: "latest request wins", see `_TreninkPorozumeni_SPEC.md`).
- Assets naming contract (per example id): `assets/images/<id>_target|_gram|_lexa|_lexb.png` (+ provenance `.png.txt`), `assets/audio/<id>.mp3` and `<id>_gram_why|_lexa_why|_lexb_why.mp3` (Edge TTS cs-CZ).

**Before creating any new example, explanation text, or image: read `_TreninkPorozumeni_LEARNINGS.md`** (user-derived quality rules for texts and images) and `_ImageGenerationLearnings.md` (generation pipeline + blind-test protocol). Rejected/repaired pictures are archived under `ImageLearnings/`.

## Deploy

Per the `ios-expo-react-native` skill (endgame repo, `.claude/skills/`): pack without `node_modules`, upload to EndgameServer `/apps/MobileApps/TreninkPorozumeni`, `npm ci`, run Metro in the per-app screen `expo-TreninkPorozumeni` on port **8081** (the app's only Expo Go port, reserved in `/apps/MobileApps/_expoGoPorts.md`), then open the app in Expo Go over WireGuard using the `exp://` URL from the skill's deploy section (printed by Metro on start).

- App icon (assets/icon.png, android-icon-*.png, favicon.png) and welcome splash (assets/splash.png, app.json `splash`, contain, #FAF6EA) were AI-generated per the mobile-apps-preferences skill (_TreninkPorozumeni_Fields123_PROMPTS.md — User request 26); winner: splash candidate 1 ("Listen and pick the card": child with headphones + four picture cards, one with a green ✓), taken from candidate 1 first (splash + icon derived before any judging), then confirmed afterwards 3/3 by three independent opus judges who saw the three candidates in random order (retroactive vote, repair R1, 2026-10-01; provenance: endgame AGENTS/Tasks/20260930_191525_TreninkPorozumeni15Types/Temp/PREFS/splash_candidates, votes in P_PREFS_progress.md); the icon is derived from it.

### Deploy with backend resources (User request 26) — NEXT DEPLOYER

Since User request 26 the app no longer bundles per-exercise assets. The next deploy MUST, together:
1. run `node ResourceBackend/pack.js` (writes `dist/porozumeni/items/<id>.zip` + `dist/porozumeni/manifest.json`, ~790 MB for 905 items),
2. upload `dist/porozumeni/` (archives + manifest) to the ResourceBackend on the EndgameServer and keep `server.js` running (port 9080, WireGuard hub address only),
3. deploy these app changes (Metro started with `--clear` once).
Deploying the app without the uploaded archives makes every game show the offline screen.
