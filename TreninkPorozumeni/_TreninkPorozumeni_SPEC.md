# TreninkPorozumeni — game specification

Czech listening-comprehension training app for children (Expo / React Native, iPad-first landscape-friendly, iPhone-capable).
User prompts behind the fields-123 structure: `_TreninkPorozumeni_Fields123_PROMPTS.md`.

## App structure (Expo Router)

- `app/index.tsx` — initial page ("User request 25"): exactly 15 test-type buttons 5.1–5.15 (number + Czech name from `Documentation/` doc1/doc2, catalog `FIELDS` in `src/items.ts`), wrapped 5 per row × 3 rows; optional green "Pokračuj v testu — <type> <range>" button full-width on top; settings gear absolutely positioned AFTER the ScrollView (touch ordering, request 20). Tapping a type opens the sets page (does not clear a paused test). Types without items stay tappable.
- `app/sets.tsx` — test-set list of one type (`/sets?field=field51`, "User request 25"): title = type label, one button per EXISTING group of 10 ("1–10", "11–20", … up to "91–100"; a partial last group shows its real end, e.g. "21–25"), 5 per row; a type without items shows "Zatím tu nejsou žádné testy."; "← Zpět" button top-left (absolute, after the ScrollView). Tapping a set clears any paused test and pushes `/game?field=<field>&part=<group>`.
- `app/settings.tsx` — settings page.
  - Setting #1: image regime `2 obrázky` vs `4 obrázky` (persisted via AsyncStorage, default 2).
    - 2-image regime: Target + Grammatical Distractor (the original behavior).
    - 4-image regime: adds the two Lexical Distractors (two columns of two pictures, landscape-safe).
  - Setting #2 ("User follow-up request 21"): speech speed — a continuous slider (`@react-native-community/slider`) 60–150 % in integer steps (any value like 64 % or 90 % allowed), current value shown as "NN %", with five animal jump-to marks under the track (🐌 Šnek 60 %, 🐢 Želva 80 %, 🧍 Člověk 100 %, 🐇 Králík 120 %, 🐆 Gepard 150 %; tapping a mark jumps to its exact value). Persisted via AsyncStorage (`settings.speechSpeedPercent`, default 100, clamped integer).
- `app/game.tsx` — game screen; takes the field AND group as route params (`/game?field=field51&part=2`; `part` = group 1..10; missing/invalid or non-existing group falls back to group 1). All 15 field ids are valid. Its back button returns to the sets page (or the start page after a resume).
- Entry: `expo-router/entry` (`package.json` main); `app.json` has the `expo-router` plugin and `scheme`.

## Game — "pictures, one sentence"

- Each round: a Czech sentence audio plays automatically when the round starts; a replay icon button replays it.
- Speech speed ("User follow-up request 21"): NO special mp3s — the existing mp3s play slower/faster. The persisted speed (percent / 100) is applied right after creating EVERY player — the sentence player and the explanation player — via expo-audio `player.shouldCorrectPitch = true` + `player.setPlaybackRate(rate, 'high')` (pitch-corrected: tempo changes, voice pitch stays natural). The game reads the setting ONCE at game start (same pattern as the image regime): a mid-game settings change applies only to the NEXT game. Unlike the regime, the speed does NOT invalidate a paused test (the round plan does not depend on it); a resume simply plays at the currently stored speed.
- 2 images side by side (2-image regime) or 4 images in two columns of two (4-image regime), in random positions; exactly one (the target) matches the sentence.
- Layout ("User follow-up request 15"): the controls — pause button, round counter ("n / <group size>" — up to 10 rounds per test set since "User request 25"), sentence-replay button — form a vertical column to the LEFT of the pictures (no top bar), so the pictures use the full screen height in landscape. In the 4-image regime the screen reads: controls column | pictures 1+2 | pictures 3+4. The left-column layout applies to BOTH regimes (the app is landscape-only; picture size is height-limited in the 2-image regime too).
- Wrong picture tapped: the app SAYS why the picture is wrong (short child-friendly Czech explanation per distractor, spoken from `<id>_gram_why.mp3` / `<id>_lexa_why.mp3` / `<id>_lexb_why.mp3`); the red tint stays on the tapped picture for the whole explanation playback and a still-playing sentence audio is stopped (paused + released). If the explanation audio is missing (`null`) or fails: plain red tint for 500 ms, nothing spoken. The round then continues until the correct picture is tapped; scored wrong on the first mistake (unchanged).
- GLOBAL SINGLE-AUDIO RULE ("User follow-up request 19"): at most ONE audio plays at any time. Starting ANY audio (sentence auto-play on round advance/restart/resume, sentence replay, explanation) first goes through a single central `stopAllAudio()` step that immediately stops whatever else is sounding (pauses + releases whatever player is sounding or loading — every play uses a fresh player, "User follow-up request 22"); the same step runs on correct tap, restart and pause/`beforeRemove`; unmount and round-change cleanups stop only the sound requested by their own screen instance (owner-scoped, see below).
- LATEST REQUEST WINS ("User follow-up request 22"): every sound (sentence auto-play, replay, explanation) is played ONLY through the central controller `src/audioController.ts`. Each play request immediately stops everything playing or pending (pause, remove, release) and starts the new sound; a monotonically increasing play token guards every async continuation (status events, watchdog and safety timers), so a stale continuation can never start, stop or report on a newer sound. Every play request gets a FRESH player (no player re-use). Screen cleanups (unmount, round change) stop only the sound their own screen instance requested; pause, `beforeRemove`, taps and restart stop everything. No sentence starts after `beforeRemove` (exit animation). A child's wrong tap/replay before the audio mode is ready is not overridden by the late sentence auto-play. The sentence has a 2.5 s start watchdog with ONE fresh-player retry (also on `status.error` before start and when creating or starting the player throws). A sentence counts as started once it was seen playing, advanced (`currentTime > 0`) or finished; a started sentence is never retried. The retry's watchdog only logs a warning and never stops the retry, so a slow sentence still plays late instead of staying silent. Players are created with `keepAudioSessionActive: true` so that pausing the previous sound can never deactivate the iOS audio session under a new sound that is still loading.
- Tap rules DURING an explanation ("User follow-up request 19", replaces the blocking of request 7): EVERY picture is tappable at ALL times. A tap on ANOTHER wrong picture un-reds the former one, stops its speech and immediately turns the new picture red with its own explanation (safety cap + start watchdog re-armed per explanation). A re-tap of the SAME red picture restarts its explanation from the beginning. A tap on the CORRECT picture stops the explanation, clears the red tint, shows the green feedback and advances the round like a normal correct tap ("request 7"). The sentence-replay button also works during an explanation: it stops the explanation (the red tint clears with it) and replays the sentence. Scoring unchanged: the round is counted wrong on the FIRST mistake; further wrong taps do not re-score.
- Watchdog fallback ("User follow-up request 7"): expo-audio emits `status.error` only when the native item actually fails; a source that never finishes loading (stalled asset download) emits neither `error` nor `didJustFinish`. A 2.5 s "must have started playing" watchdog therefore checks `isLoaded && playing` after `play()` and, when playback never truly started, falls back to the plain 500 ms red tint; a 15 s safety cap remains the last resort for audio that started but never reports finishing.
- Correct picture tapped: slight green tint + green checkmark overlay for 500 ms, then the next round.
- Stale-press guard: a picture press only counts if it BEGAN (`onPressIn`) in the current round. The release of a finger held across the 500 ms round advance (or a natively synthesized late click) is ignored, so it can neither silence the new round's auto-played sentence (via the explanation flow pausing it) nor silently skip the new round (see `_TreninkPorozumeni_Fields123_PROMPTS.md`, "User follow-up request 3").
- End of run: score screen (Správně / Špatně counts) with a restart button that reshuffles, and a back button returning to the sets page of the type.

## Pause / resume

(Requested in `_TreninkPorozumeni_Fields123_PROMPTS.md`, "User follow-up request 4".)

- The controls column has a pause-and-go-back button, shown as the "◀⏸" glyph pair (back arrow + pause; "User follow-up request 17" — pause alone did not evoke going back), accessibility label "Přestávka a zpět". Leaving a RUNNING test — pause button, iOS swipe-back or Android hardware back (all saved from the navigation `beforeRemove` event, so they behave identically) — does not stop the test, it PAUSES it: field, sub-test part ("User follow-up request 21" — the paused-test identity is field + part), regime, the exact round plan (order included), round index, Správně/Špatně counts and the current-round mistake flag are saved to the in-memory store `src/pausedGame.ts`.
- In-memory deliberately (module-level variable, NOT AsyncStorage): a paused test is not a saved test — a fresh app start simply has no paused test to continue.
- Flow: start page (15 types) → sets page of the type → game. Pause returns to the sets page. BOTH the sets page (above the set list) and the start page then show a green "Pokračuj v testu — <type label> <range>" button naming the test set, e.g. "Pokračuj v testu — 5.1 Reverzibilní věty 11–20" (shared logic `src/pausedTestOffer.tsx`, re-checked on every focus). Tapping a set button on the sets page still starts that set fresh (and clears the paused test). It is shown only while a paused test exists AND the current image-regime setting equals the paused test's regime. (The speech-speed setting does NOT invalidate a paused test.)
- Invalidation (button disappears, store cleared) happens exactly when: (a) a new/another test is started (any set button on the sets page), (b) incompatible settings are detected — the stored image-regime setting differs from the paused test's regime (checked on the start/sets page's focus, where the button is hidden synchronously until the async check passes, and re-checked in the game's resume path — a mismatch there means the paused test is discarded and a fresh test of that field starts), or (c) the test is actually continued (resume consumes the store). Otherwise the paused test persists — e.g. pause → settings without changing the regime → back: the button is still shown.
- Resume opens `/game?field=<field>&part=<group>&resume=1` (label "Pokračuj v testu — 5.1 Reverzibilní věty 11–20") (a paused part-2 test must never continue under a part-1 route — the game re-checks `paused.part === part` too): the exact same rounds order, index, counts and mistake flag are restored; the current round's sentence auto-plays again (desired). Empty/mismatched store on resume → fresh start of that field + part.
- Edge cases: pausing mid-explanation stops the explanation cleanly (round stays current, mistake flag preserved); pausing during the 500 ms correct-feedback saves the already-scored advance (index + 1, fresh mistake flag) so the round cannot be scored twice, and all pending feedback/explanation timers are cancelled right after the snapshot so nothing (e.g. the next sentence's auto-play) fires during the exit animation; leaving the finished/score screen or an empty field creates NO paused test; "Hrát znovu" does not touch the store.

## Rounds

- Groups of 10 ("User follow-up request 21", generalised by "User request 25"): each field's examples (up to 100) are split DETERMINISTICALLY by the `src/items.ts` order into groups 1 = examples 1–10, 2 = 11–20, … 10 = 91–100 (`examplesForTestPart`, `testPartCount`, `testPartRangeLabel`, `EXAMPLES_PER_TEST_PART`, `MAX_TEST_PARTS` in `src/rounds.ts`). The number of groups is derived from the item count. Shuffling happens only WITHIN a group; the round counter shows "n / <group size>".
- `buildRoundPlan(field, regime, part)` (`src/rounds.ts`): takes the group's examples, shuffles, one round per example; image order shuffled per round.
- Variants ("User request 25"): on every plan build (= every start AND every restart "Hrát znovu") each example independently draws variant 1 or 2 with 50/50 probability (`pickVariant`); an example without `swappedVariant` always plays variant 1. The draw is stored in the round (`GameRound.variant`), so pause/resume keeps it (the paused plan is restored as-is). Variant 2 = target picture ← base `grammaticalDistractorImage`, grammatical-distractor slot ← base `targetImage`, lexA/lexB pictures unchanged; sentence audio (`sentenceAudioForRound`) and all three explanations (`explanationForSlot(round, kind)`) come from `swappedVariant`. Prefetch uses the same helpers, so it follows the drawn variant.
- Asset prefetching ("User follow-up request 16"): on every round start (including plan build and resume), the game fire-and-forgets `expo-asset` `Asset.fromModule(...).downloadAsync()` for the assets of the current round and the NEXT TWO rounds — per round exactly what its regime can use: slot images (2 or 4), sentence mp3, and the explanation `_why` mp3s of the non-target slots present (2-image regime: `gram_why` only). `collectRoundAssetModules` in `src/rounds.ts` collects the module ids; a session-wide `Set` de-duplicates. Failures are silent — the lazy load + watchdog remain the fallback; in release builds assets are bundled and the download is an immediate no-op.

## Data model (`src/items.ts`)

```ts
export type FieldId = 'field51' | 'field52' | … | 'field515'; // 15 types, catalog FIELDS
export interface ComprehensionExample {
  id: string;            // unique slug
  field: FieldId;
  sentence: string;      // Czech sentence played/shown
  audio: AudioSource;                              // assets/audio/<id>.mp3
  targetImage: ImageSourcePropType;                // assets/images/<id>_target.png
  grammaticalDistractorImage: ImageSourcePropType; // assets/images/<id>_gram.png
  lexicalDistractorAImage: ImageSourcePropType;    // assets/images/<id>_lexa.png
  lexicalDistractorBImage: ImageSourcePropType;    // assets/images/<id>_lexb.png
  // Why-it-is-wrong explanations (5-20 words, simple child-friendly Czech), spoken on a wrong tap:
  grammaticalDistractorExplanation: string;
  grammaticalDistractorExplanationAudio: AudioSource | null; // assets/audio/<id>_gram_why.mp3
  lexicalDistractorAExplanation: string;
  lexicalDistractorAExplanationAudio: AudioSource | null;    // assets/audio/<id>_lexa_why.mp3
  lexicalDistractorBExplanation: string;
  lexicalDistractorBExplanationAudio: AudioSource | null;    // assets/audio/<id>_lexb_why.mp3
  swappedVariant?: SwappedVariant; // optional variant 2 ("User request 25")
}
export interface SwappedVariant {  // same picture set, target <-> grammatical distractor swapped
  sentence: string;
  audio: AudioSource;                                        // assets/audio/<id>_v2.mp3
  grammaticalDistractorExplanation: string;                  // explains the BASE target picture
  grammaticalDistractorExplanationAudio: AudioSource | null; // assets/audio/<id>_v2_gram_why.mp3
  lexicalDistractorAExplanation: string;
  lexicalDistractorAExplanationAudio: AudioSource | null;    // assets/audio/<id>_v2_lexa_why.mp3
  lexicalDistractorBExplanation: string;
  lexicalDistractorBExplanationAudio: AudioSource | null;    // assets/audio/<id>_v2_lexb_why.mp3
}
```

- The lexA/lexB slots are generic: for types whose doc defines a second grammatical or a semantic/absence distractor, those pictures and explanations go into lexA/lexB (the swap only exchanges target and the FIRST grammatical distractor).

- Rounds carry `variant` (1 | 2) and `slots: { image, kind }[]` (`kind`: `target` | `grammatical` | `lexicalA` | `lexicalB`) so a tapped wrong picture maps to its explanation (`explanationForSlot` in `src/rounds.ts`).

- Settings persistence: `src/settings.ts` (AsyncStorage keys `settings.imageRegime`, `settings.speechSpeedPercent`).

## Current examples

- Field 5.1: COMPLETE — 20 examples. 10 legacy items migrated from the original two-image model (sentence = old sentence A; target = old `<id>_a.png`; grammatical distractor = old `<id>_b.png`; NEW `<id>_lexa.png`/`<id>_lexb.png` lexical distractors) + 10 new items (strika, kouse, veze, tlacimotorku, objima, budi, krmi, kresli, tahne, hladi; tlacimotorku replaced the original tlaciautobus — „Autobus tlačí auto." was case-ambiguous, nom=acc for both nouns) with all four pictures new. All explanation texts and all `_why` explanation audios wired per the content spec.
- The old `kosa` item (kosa/koza) is a phonological minimal pair, not field 5.1 — excluded, kept aside (assets remain on disk; see comment in `src/items.ts`).
- Field 5.2: COMPLETE — 20 examples (podzidli, podpolstar, poddestnikem, vevane, vbote, nastole, zaplotem, zavazou, zastromem, prede, vedlekosiku, mezivazou, mezirodici, nastul, preskrabici, skrz, kolem, dokose, zkrabice, nadstrechou), all four pictures new per example, all explanation texts and `_why` audios wired per the content spec.
- Field 5.3: COMPLETE — 20 examples (hrusky, svihadlo, kockypiji, okna, medvidci, klukstavi, ptaci, psispi, lavicka, kvetiny, hrnek, kone, jablko, deti, svicka, ryby, kniha, banany, zaba, tancuje), all four pictures new per example, all explanation texts and `_why` audios wired per the content spec.
- 5.1–5.3: 60 examples total (2 sets each); 5.4–5.15: no items yet (sets page shows the empty state; an empty game plan via deep link shows "Zatím tu nejsou žádné příklady" + back button). No example has `swappedVariant` yet (added in P2 of request 25).
- 5.5 Negace: 100 examples (10 sets) in `src/items/field55.ts` (ids `p55_`), all with `swappedVariant`: v1 = negated sentence (target = negated/absent state, gram = affirmative), v2 = affirmative sentence (pictures swap). Lex pictures replace the subject/container (or show a partial state for ani…ani / žádný / všichni groups) so they are false for both sentences.
- 5.8 Rodová shoda podmětu s přísudkem: 100 examples (10 sets) in `src/items/field58.ts` (ids `p58_`), all with `swappedVariant`: v1 = subjectless past tense (-l/-la/-lo), v2 = the other gender (pictures swap: mirrored actor pair, e.g. kluk/holčička, maminka/tatínek, babička/dědeček). Minority form per `_TestTypeScopeRule.md` (`Documentation/TypeScope/5.8_scope.md`): 66 items have v2 in present tense + agreeing sám/sama/samo (E = 33 %); order seed 580058, ≤4 pure-majority items in a row. Lex pictures (same actor not doing the action; other actor doing a different action) are false for both sentences.

## Assets (strict naming contract, per-example)

- Audio: `assets/audio/<id>.mp3` (Edge TTS, cs-CZ neural voice). Migrated 5.1 examples reuse the old `<id>_a.mp3` names.
- Explanation audio: `assets/audio/<id>_gram_why.mp3`, `<id>_lexa_why.mp3`, `<id>_lexb_why.mp3` (same TTS voice). Generated and wired for all 60 examples (fields 5.1, 5.2, 5.3); if a file were ever missing the model field stays `null` and the game falls back to the plain 500 ms red tint.
- Images: `assets/images/<id>_target.png`, `<id>_gram.png`, `<id>_lexa.png`, `<id>_lexb.png` — children-friendly painted fairy-tale-book style, only the described situation, no background/extras. Migrated 5.1 examples reuse the old `<id>_a.png`/`<id>_b.png` names for target/gram.
- Provenance: a `.txt` file next to every generated image (service + parameters + verbatim prompt).

## Technical notes

- Audio library: `expo-audio` (current Expo SDK recommendation; `expo-av` is deprecated). Speech speed via `AudioPlayer.setPlaybackRate(rate, 'high')` + `shouldCorrectPitch`.
- Speed slider: `@react-native-community/slider` (installed via `npx expo install`; works in Expo Go).
- Static `require()` asset references; TypeScript strict.
