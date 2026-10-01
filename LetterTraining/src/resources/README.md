# src/resources — backend-served resource module

Shared, self-contained module (copyable as-is into the standalone LetterPexeso app) implementing
the `mobile-apps-preferences` large-data rules: backend-served compressed archives, 200MB
compressed on-device LRU cache, checksum invalidation, in-memory unpack, offline retry UI.
Requested in `_LetterTraining_PROMPTS.md`, section
"## Follow-up prompt 9 — mobile-apps-preferences (backend resources, cache, preload)".

## Backend contract (manifest shape — Phase A's packer/fileserver MUST conform)

Static fileserver (VPN-only, WireGuard `10.67.0.1`, port **9080** — the reserved,
conflict-checked backend port, see `ResourceBackend/README.md`; default in `resourceStore.ts` is
`http://10.67.0.1:9080` — override with `configureResourceBackend({ baseUrl })`). It serves:

- `GET /manifest.json`:

```json
{
  "version": "<16 hex chars, content-derived>",
  "generatedAtUtc": "2026-10-01T12:00:00.000Z",
  "archives": {
    "words/auto.zip":   { "sha256": "<64 lowercase hex chars>", "bytes": 123456,
                          "files": ["picture.png", "word.mp3", "first.mp3", "last.mp3"] },
    "syllables/b.zip":  { "sha256": "...", "bytes": 2345, "files": ["ba.mp3", "be.mp3"] },
    "train/train.zip":  { "sha256": "...", "bytes": 345678,
                          "files": ["engines/engine01.png", "wagons/wagon01.png", "manifest.json"] }
  }
}
```

- `GET /<archivePath>` for every key of `archives` — a plain zip. `version` changes whenever ANY
  archive changes (content-derived: unchanged content ⇒ unchanged version); `sha256` is the zip
  file's SHA-256 and is the staleness token: the app replaces its cached copy when it differs.
  `bytes` is the compressed size (informational; the app measures the downloaded bytes itself).
  `files` lists the zip's inner entry names (informational; lets callers know an archive's
  contents without downloading it — the app also lists the real entries after unzip).
- **Fixed inner entry names** (so Phase C can map entries deterministically):
  - `words/<word>.zip` — the word's picture + audio variants under FIXED names: `picture.png`,
    `word.mp3`, `first.mp3`, `last.mp3`. Each entry is present only if the source asset exists.
  - `syllables/<char>.zip` — syllable mp3s grouped by the FIRST character of the folded file
    name; inner names are the original folded file names (e.g. `ba.mp3`).
  - `train/train.zip` — all engine/wagon PNGs under `engines/<name>.png` / `wagons/<name>.png`
    plus the train's own `manifest.json`.

If Phase A produces a different shape, reconcile here (this file is the single documented
contract on the app side).

## Files

- `types.ts` — manifest/cache/unpack types + the `CacheFileSystem` interface.
- `cacheCore.ts` — pure cache logic (no Expo imports): 200MB limit on compressed files only,
  per-file last-used timestamps, LRU eviction one file at a time, sha256 invalidation.
  Unit-tested with a mocked filesystem (`__tests__/cacheCore.test.ts`).
- `expoFileSystemAdapter.ts` — `CacheFileSystem` over expo-file-system (SDK 57 `File`/`Directory`
  API, Expo Go-compatible), cache dir `<cache>/backendResourceCache/`.
- `resourceStore.ts` — facade: `configureResourceBackend`, `refreshManifest`,
  `getUnpackedArchive`, `releaseUnpackedArchive`, `releaseAllUnpackedArchives`,
  `areArchivesAvailableOffline`, `ResourceUnavailableError`. Unzips with pure-JS `fflate`
  (native zip modules do not run in Expo Go) and yields per-file `dataUri` (base64) usable
  directly as `<Image source={{ uri }}>` and as expo-audio `AudioSource` (`{ uri }`) — the whole
  sound is hot in memory before the round starts.
- `base64.ts` — pure-JS base64/data-URI helpers.
- `OfflineRetry.tsx` — child-friendly Czech error + "Zkusit znovu" retry component.

## Intended integration (Phase C)

1. On game start: `refreshManifest()` (old manifest from the same run keeps working offline).
2. Preload rounds N..N+5: `getUnpackedArchive('words/<id>.zip')` per word of those rounds.
3. Leaving a round: `releaseUnpackedArchive(...)` for that round's archives (disk cache stays).
4. `ResourceUnavailableError` → render `OfflineRetry` with a retry callback.
5. Audio players are still created only by `src/audioController.ts` — pass it
   `{ uri: archive.files['<name>.mp3'].dataUri }` as the source.

## Notes / limitations

- sha256 is used as an identity/staleness token only; the app does not re-hash downloaded bytes
  (no cryptographic integrity check — VPN-only trusted backend).
- In-memory unpacked data intentionally does NOT count toward the 200MB limit (per preferences).
- The disk cache index lives in `cacheIndex.json` inside the cache directory; a corrupt index
  resets to empty and orphaned zips get overwritten on next download.
