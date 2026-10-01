# LetterTraining

Expo Go app (Czech UI) for training the Czech alphabet with games of increasing difficulty.
User intentions: `_LetterTraining_PROMPTS.md`.

## Trainings

The intro page (`app/index.tsx`) lists the trainings from the extensible registry `src/trainings.ts`:

- **Pexeso** (`app/pexeso.tsx`) – the LetterPexeso game nested into this app (`src/pexeso/`). Only this screen is locked
  to landscape (locked on enter, unlocked on leave); it has a back button and „Zpět na výběr" in its end overlay.
  Settings route `app/pexeso-settings.tsx`; `src/pexeso/` is IDENTICAL to standalone LetterPexeso `src/` except
  `pexesoPlatform.ts` (images = Level-1-eligible words of `src/words.ts`).
  Settings (⚙ in the game header; persisted with AsyncStorage) - `_LetterPexeso_PROMPTS.md` / "Follow-up prompt 6", "Q&A 8", "Q&A 9",
  "Follow-up prompt 7/8": háčky (on) / čárky incl. Ů (off) checkboxes, CH always; sizes 2x2 ... 4x10 (sizes needing more letters
  than available are greyed); sound on/off (mutes letter + image cards only; ear "sound-only" cards always play); two columns
  (card 1 / card 2) with letters / images / sound-only, VELKÁ / malá and tiskací / psací – nevázané (Comenia) / psací – tradiční vázané
  (case + style active only for letters). Scoring: match = right; a mismatch is wrong only when the partner of either card was
  already seen or either card is turned for the 3rd+ time; results show wrong tries and total tries.

  **Psací fonts (bundled):** Comenia-Script style = **Playwrite FR Moderne**, tradiční vázané písmo = **Playwrite CZ**
  (TypeTogether, https://github.com/TypeTogether/Playwrite; SIL Open Font License 1.1 - licence texts `assets/fonts/OFL_*.txt`).
  Static Regular instances (fontTools instancer, full Czech coverage, calt joining kept) in `assets/fonts/`, loaded with
  expo-font `useFonts` in the app root (app/_layout.tsx waits for them; on load error system italic fallback); family names in
  `src/pexeso/components/letterFonts.ts`. Comenia Script itself is a paid font and is not used; the settings label "Psací – nevázané (Comenia)" means the unjoined Comenia-style script (rendered with the look-alike Playwrite FR Moderne).
- **Začátky slov – úroveň 1 (písmena)** – picture + spoken word (🔊 replays it), choose the first letter out of 3
  („ch" is one letter).
- **Začátky slov – úroveň 2 (první slabika)** – choose the first syllable out of 4 (2 start with the word's first
  letter incl. the correct one, 2 start with one other letter); only words with ≥ 2 syllables.
- **Začátky slov – úroveň 3 (poslední slabika)** – the same with the last syllable.

- **Skládání slov – písmena / slabiky** (`app/compose.tsx?variant=letters|syllables`, logic in `src/compose/`) – drag the
  shuffled letter/syllable tiles into one box per letter/syllable (react-native-gesture-handler + reanimated). Arrow from
  the first-letter tile to box 1 only for the first tile of round 1 of a play ("## Follow-up prompt 19" / "### Q&A 19"; shown again after "Hrát znovu"); tile spoken at drag start; any overlap with an eligible box fills
  that box (duplicates interchangeable; the first empty box wins when overlapped, else the larger overlap; also a later
  box - precise out-of-order direct drops kept); otherwise
  the tile belonging to the first empty box slides there automatically (0.5 s) when tapped, moved a little or released
  anywhere (`_LetterTraining_PROMPTS.md` "## Follow-up prompt 11"); any other tap / release is wrong: slides back in
  0.5 s, red shade fading 2 s on it + green shade on the correct tile until the first empty box gets its value (moves to the other duplicate if
  the green tile is dropped into a later box); ✓ when the last tile lands, then next round after max(500 ms, sound end)
  counted from the landing; 10 rounds + results (correct = no wrong selection, taps included). Words: at least 2 tiles; syllables variant:
  `excludeLevel2` words skipped. Settings (⚙ in the game header, `app/compose-settings.tsx?variant=...`): tile case CAPITALS /
  lower_case, and ("## Follow-up prompt 19") a word-length range bar with min/max knots for the opened variant (letters:
  letter count, ch = 1; syllables: syllable count) - bounds = shortest/longest eligible word (currently letters 2–11,
  syllables 2–5), live count of usable words in the range next to the bar, default full range, stored per variant; both
  persisted with AsyncStorage. A changed range starts a new play limited to it; a pool smaller than 10 words keeps 10
  rounds with repeated words.
  Autonomous decisions (not user-specified, may be changed on request): default tile case CAPITALS; direct-hit
  placements also use the 0.5 s eased slide; a release overlapping the first empty box and a later matching box fills the
  first empty box (refines "## Q&A 11" out-of-order drops to precise hits); a second wrong tile cuts the previous red fade
  (as the train); green shade fades in/out in 250 ms (as the train); (the former "< 12 px tap"
  and "release on own home spot" non-wrong rules are superseded by "## Q&A 11"); completion waits at most 3000 ms for the last tile sound; the screen is locked to portrait; the ✓ is shown
  directly above the last box (in the empty gap between the tiles row and the boxes row).

- **Abecedový vlak** (`app/train.tsx`, logic in `src/train/`) – landscape; steam engine + attached wagons on top (train
  end at ~60 % width), N waiting wagons (shuffled, slightly floating in 1 px gliding steps, one axis at a time, ≥ 0.5 s
  pause between steps) in a row below; touch / tap (or drag and release anywhere) the next letter's wagon. Letter name
  spoken at touch-down (CZ voice, or EN voice `assets/audio/letters_en/`). Correct → the wagon slides behind the last
  wagon in 0.5 s, the train shifts one wagon left (the 1 s part travels 90 % of the wagon width, the rest of the pitch
  over 10 s, smoothly retargeted on the next placement), the next letter appears at a random pool position
  (neighbours ease apart, the new wagon grows from a point). Wrong → slides back, red shade on it fading in 2 s +
  permanent green shade on the correct wagon until it connects; no sound. After the last letter (no shift) the train
  leaves in 1 s, accelerating then at constant speed → „Hotovo" 150 ms later (Znovu / Zpět). All animations ignore the
  system Reduce Motion. Random engine per play, random wagon image per letter;
  train pictures come from the backend archive `train/train.zip`, loaded hot during the start animation (EN/CZ
  letter audio is bundled and warmed). Settings (⚙, `app/train-settings.tsx`, persisted): alphabet CZ (34 letters incl.
  CH, háčky, no Ě / čárky / kroužky) / EN (26) with drawn flags, VELKÁ / malá, waiting wagons 4–8 (default 6).
  Images: `assets/train/` (packer source, not bundled) + `manifest.json` → `src/train/assets.ts` is **GENERATED** by
  `endgame2/AGENTS/Tasks/20261001_090718_LetterTraining/scripts/gen_train_ts.py` (re-run after image/audio changes, then
  re-apply endgame2 `AGENTS/Tasks/20261001_162724_LetterTrainingMobileAppsPreferences/scripts/transform_asset_maps_to_archives.js`);
  without images, drawn placeholder engine/wagons are shown.
  Autonomous decisions (not user-specified, may be changed on request): Q&A 6 says "35 letters" but lists 34 – the
  list is used; default case CAPITALS; drop zone = 1 wagon width left of the train end to 1.5 widths right, 0.4 wagon
  height above the train to 0.6 below, drawn as a dashed outline; the wiggle only for a wrong letter released in the
  drop zone (elsewhere just slide back); the last wagon first slides onto the train (500 ms), then the 1 s exit
  (constant acceleration for 30 % of the time, then constant speed), „Hotovo" +150 ms; slide back 500 ms, make-space
  350 ms, grow-in 350 ms, floating ±4 px in 1 px steps (350 ms glide + 0.5–1.2 s pause, random axis order), green shade
  fade 250 ms, shades = soft halo (iOS glow, Android tint only); a settings change restarts the play (shades reset
  instantly); the settings page is landscape too.

Word starts (`app/words.tsx?level=1|2|3`, logic in `src/wordStarts/`): 10 rounds per play, then a results page
(„Správně: X/10", „Hrát znovu", „Zpět na výběr"). Word pictures/audio come from the resource backend as per-word
zip archives: the current round's archives are hot in memory before the round shows and the **next 5 rounds are
preloaded** ahead (downloaded, disk-cached, unpacked; past rounds released) — see `src/resources/README.md`
(supersedes the earlier 2-rounds-ahead bundled-Asset prefetch). A round counts as correct only if the first tap
is correct.

Start animations (`src/startAnimation/`): while a game's resources load, a themed ≤5 s animation per game plays
(words: picture + 🔊 + letter options; compose: tiles slide into boxes; train: wagons hook onto the engine; pexeso:
cards dealt, pair matched, pair turned back), then holds its last frame („Připravuji hru…"); it is cut immediately when
the resources are ready. RN core `Animated`, shared byte-identical with LetterPexeso.

Feedback:
- correct tap → green tint + green ✓ on the option, the letter/syllable sound plays, and the next round shows after
  **max(500 ms, end of the sound)** (decision: the sound is not cut at 500 ms; missing/failed sound = 500 ms).
- wrong tap → red tint on the option while its letter/syllable sound plays (500 ms tint if there is no audio).

## Resources (mobile-apps-preferences)

- **Backend-served:** word pictures + word audio (`words/<id>.zip`), syllable audio (`syllables/<char>.zip`) and train
  pictures (`train/train.zip`) from the shared `ResourceBackend` (mobile-apps2 repo root; VPN-only static fileserver
  `http://10.67.0.1:9080`, `manifest.json` with version + per-archive sha256). Offline with uncached archives → Czech
  „Jejda!" message + „Zkusit znovu" retry; games with cached/bundled resources keep working.
- **Device cache:** 200MB of compressed zips, last-used tracking, LRU eviction, checksum invalidation (`src/resources/`).
- **Preload:** words/compose = current round + next 5 rounds; pexeso/train = everything for the play before it starts.
- **Bundled:** letter audio, fonts, UI assets, downsized pexeso settings samples.

## Dataset

`src/words.ts` is **GENERATED** by `endgame2/AGENTS/Tasks/20261001_090718_LetterTraining/scripts/gen_words_ts.py` from
the task `words.json` (re-run it after new pictures are accepted; never edit it by hand). It includes only words with
an ACCEPTED picture (`assets/images/<id>.png` + accepted `blind_test_data/_blind_test_log/<id>.md`) and exports `WORDS`
(word, syllables, firstLetter, alternativeNames, excludeLevel1/2/3, hasAudioFirst, hasAudioLast; pictures/audio live in backend `words/<id>.zip`),
`LETTER_AUDIO`, `SYLLABLE_AUDIO` (real + synthetic syllables) and `REAL_SYLLABLES` (all words.json syllables).
Level 1 plays the plain word, Level 2 the word read naturally with the first syllable separated by a space ("no viny",
`audio/words_first/`), Level 3 read with the last syllable separated ("novi ny", `audio/words_last/`) — one natural TTS
reading per file, no syllable concatenation or artificial emphasis ("## Follow-up prompt 12"). `excludeLevelN` words are skipped in that level; in Level 1 only
letters with >= 3 eligible words can be the correct answer (a level without eligible words shows „Pro tuto úroveň
zatím nejsou žádná slova."). `assets/placeholder/` is no longer used.

## Development

- `npx expo start` (Expo Go), `npx expo start --web --port 8082` (web preview)
- Checks: `npx tsc --noEmit`, `npx jest`, `npx expo-doctor`, `npx expo export --platform ios --output-dir <dir>`

## Deployment

- Expo Go port: **8083** – the ONLY port to deploy this app on the EndgameServer (reserved in
  `/apps/MobileApps/_expoGoPorts.md`; on conflict that file wins and this README is fixed).
- Deploy ONLY via the `app-deployer` agent; on the server the app lives in `/apps/MobileApps/LetterTraining`.
- iPhone: WireGuard hub tunnel on, open `exp://10.67.0.1:8083` in Expo Go.
