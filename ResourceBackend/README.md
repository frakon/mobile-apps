# ResourceBackend

Static resource backend for the mobile apps (**LetterTraining**, standalone **LetterPexeso**), per the
`mobile-apps-preferences` skill and the user decisions recorded in
`LetterTraining/_LetterTraining_PROMPTS.md` (section "Mobile-apps-preferences application"):
large per-exercise resources (word pictures, word/syllable audio, train assets) are NOT bundled in
the apps — they are packed into small archives at deploy time and served over the VPN; the apps
download them, cache them compressed on device (200 MB LRU), and preload rounds ahead.

## Parts

- **`pack.js`** — packer, run at deploy time (and locally for testing): reads
  `../LetterTraining/assets` and writes to `dist/` (gitignored):
  - `words/<word>.zip` — one small zip per word: `picture.png` + `word.mp3` + `first.mp3` + `last.mp3`
    (each entry only if the source exists). Per-word granularity lets the cache deduplicate words
    across games/levels/apps; a round fetches its ~4–8 word zips in parallel.
  - `syllables/<letter>.zip` — syllable mp3s grouped by the first character of the folded file name.
  - `train/train.zip` — all engine/wagon PNGs + `train/manifest.json` (one small fixed set).
  - `manifest.json` — global `version` (content-derived hash: unchanged content ⇒ unchanged version;
    ANY archive change ⇒ new version) + per-archive `sha256`, `size` and file list. The app compares
    this against its cache and **replaces stale cached copies whenever the backend has a new version**.
  - Excluded by design: blind-test logs and `*.txt` provenance files (these were moved out of
    `assets/` into `LetterTraining/blind_test_data/`), `*.md`, letter audio, fonts, icons,
    placeholder/UI assets (those stay bundled in the apps).
  - Zips use store mode (level 0) with a fixed mtime: PNG/MP3 do not deflate, store is fastest, and
    the fixed mtime makes checksums deterministic across repacks.
- **`server.js`** — minimal zero-dependency Node static fileserver serving `dist/`.

## Commands

```bash
npm install          # once (fflate only; server.js has no dependencies)
npm run pack         # build dist/ from ../LetterTraining/assets
npm run serve        # serve dist/ (defaults: 10.67.0.1:9080)
```

Env overrides for `server.js`: `RESOURCE_BACKEND_HOST` (default `10.67.0.1`; `127.0.0.1` for local
testing), `RESOURCE_BACKEND_PORT` (default `9080`), `RESOURCE_BACKEND_ROOT` (default `./dist`).

## Port and VPN-only access (EndgameServer)

- **Port: 9080** (HTTP). Chosen on 2026-10-01 against the live EndgameServer state
  (`ss -tlnp`): listening then were 22, 53, 111, 1431, 1434, 3333 (chartviewer-related), 4444
  (chartviewer), 7777, 31415, 55555, and Metro/Expo Go 8081–8083 (reserved in
  `/apps/MobileApps/_expoGoPorts.md`: 8081 TreninkPorozumeni, 8082 LetterPexeso, 8083 LetterTraining).
  9080 conflicts with none of them and sits far outside the one-by-one growing Expo Go range.
  `_expoGoPorts.md` is Expo-only; this README is the reservation record for 9080.
- **VPN-only:** the server binds **10.67.0.1** — the EndgameServer's WireGuard hub address
  (`10.67.0.0/24` mesh; iPhone = `10.67.0.2`). It never binds `0.0.0.0` or the public IP, so the
  backend is unreachable from the public internet; only WireGuard peers can access it. This matches
  how Expo Go deploys are reached (`exp://10.67.0.1:<port>`).
- App base URL: `http://10.67.0.1:9080/` (e.g. `http://10.67.0.1:9080/manifest.json`,
  `http://10.67.0.1:9080/words/auto.zip`).

## Deployment (NOT part of this folder's scripts)

Deployment to the EndgameServer goes exclusively through the `app-deployer` agent on explicit user
request. Intended target layout: `/apps/MobileApps/ResourceBackend/` with `node pack.js` run at
deploy time (assets synced alongside, or packed locally and `dist/` uploaded), then `node server.js`
kept alive in a screen session (e.g. `screen -S resource-backend`). This folder only defines the
packer + server; nothing here deploys.
