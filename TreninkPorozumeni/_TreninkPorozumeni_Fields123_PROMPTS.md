# TreninkPorozumeni — Fields 5.1 / 5.2 / 5.3 — user prompts and decisions

Feature: initial field-selection page, settings page (2/4-image regime), Expo Router migration,
new example data model (target + grammatical distractor + 2 lexical distractors).

## User request (verbatim)

> I want you to continue development of the TreninkPorozumeni app.
> I added 3 explanatory files of what shall be trained in the app: they are in TrenikPorozumeni/Documentation folder. Explore them by subagents.
> I want you to implement the first 3 fields from the (the 5.1, 5.2, 5.3):
> * for that the app shall be added an initial page with selection of which field we want to test (do not mix the fields now, keep them separated yet)
> * there shall be newly also settings (settings page) by which we shall adjust behaviour of the app:
>    * as the first setting put there decision of whether we want to use 2 images regime or 4 images regime (2 images regime is the currently implemented regime: we use in it the "Target" and "Grammatical Distractor"; another regime is with 4 images: when 2 more images are displayed: the Lexical Distractors)
> * for every field create 20 examples. You may use the internet for inspiration. Prefer use of examples which use words from the 2000 most used czech words.
> * the images shall be blind tested (see the /image-generation skill) and improved if not their meaning clear

## User Q&A decisions (verbatim answers)

1. Example sets: **"Docs + authored (Recommended)"** — use doc1+doc3 examples (deduplicated, typos fixed, weak items like "Strom zasáhl padající kámen" replaced), author remaining ~10 per field in same style, prefer 2000 most common Czech words.
2. Image scope: **"All 4 images per example"** — ~240 images generated and blind-tested now; 4-image regime fully usable.
3. Old 11 items: **"Reuse in 5.1 (Recommended)"** — matching existing items become part of 5.1's 20 (extended with lexical distractors); kosa/koza pair doesn't fit 5.1 — kept aside or dropped.
4. Navigation: **"Expo Router (Recommended)"** — file-based routing, settings persisted via AsyncStorage.

## User follow-up request — spoken explanation of a wrong picture (verbatim)

> One more change/addition: When wrong picture is selected: let the app say what was wrong:
> * prepare 5-20 words explanation in czech of why the just selected picture does not satisfy the conditions or what is different on it (e.g. for example with "Jel s kosou vs. jels s kozou" it would be something like: "Tady je koza, ne kosa"). Keep the explanation very short and simple and understandable for a child. Keep the red background of an image for the duration of the "why it is wrong" explanation speech play.

Conventions decided for this: model fields `grammaticalDistractorExplanation` / `lexicalDistractorAExplanation` / `lexicalDistractorBExplanation` (string) + matching `...ExplanationAudio` (`AudioSource | null`); audio files `assets/audio/<id>_gram_why.mp3`, `<id>_lexa_why.mp3`, `<id>_lexb_why.mp3`. Until the audio files are generated the fields are `null` and the game keeps the previous plain 500 ms red tint. During an explanation playback ALL taps (pictures and sentence replay) are blocked so audios cannot overlap; scoring is unchanged (first mistake counts).

## User follow-up request 2 — per-field deployment + parallel work (verbatim)

> After the 5.1 is done: do a deployment to EndgameServer, then continue with 5.2 and 5.3. Do deployment after each so that I can check it there.
> Also: do the work highly parallelly (image generation uses muse spark API and that one can be called paralelly)

Meaning: per-field flow = images done → wire field's examples into src/items.ts → checks → deploy to EndgameServer (deployment explicitly requested by the user, once after each field). Image generation maximally parallel (Muse Spark API supports parallel calls).

## User follow-up request 3 (verbatim) — held tap silences the next round

> Meanwhile repair/prevent this small error: When I click the right picture and keep my finger there a little longer (few 100ms is enough), then once the next pictures are loaded the sound does not play. I have to press the sound button. I want to prevent this unwanted behaviour (race condition).

Root cause (evidence in `app/game.tsx`): `Pressable` delivers `onPress` at finger RELEASE (react-native `Pressability`, `RESPONDER_RELEASE`; a natively synthesized late `click` can also invoke `onPress` directly). A press held across the 500 ms correct-feedback advance gets that release delivered AFTER the advance timer has already reset `correctTapped`/`roundAdvancePending`, so it is handled as a fresh tap on the NEW round: on a distractor slot the explanation flow pauses the just-created sentence player (the round stays silent until the replay button is pressed); on the target slot the new round would be silently skipped. Fix: a `roundGeneration` counter bumped on every round advance/restart + `pressStartGeneration` recorded in `onPressIn`; `handlePictureTap` ignores any press that did not BEGIN in the current round.

## User follow-up request 4 (verbatim) — pause the test, "Pokračuj v testu" on the initial page

> Another thing: I want to put there a button to go back from the current test/training (to the initial disambigulation page: page with the options). The current training shall not be stopped, only paused and on the initial page shall be displayed a button with "Pokračuj v testu". The "Pokračuj v testu" shall be invalidated when a new (another test is started) or when incompatible settings are set (incompatible with the currently paused test) or when the test is actually continued. Otherwise even when we pause the training, then go to settings and back, the "Pokračuj v testu" shall be still shown.

Implementation decisions: paused state lives in an in-memory module store `src/pausedGame.ts` (field, regime, exact round plan, round index, counts, current-round mistake flag) — game screens unmount on router pop, so the state must live outside the component; deliberately NOT AsyncStorage (paused ≠ saved; a fresh app start has no paused test). The game saves the snapshot from the navigation `beforeRemove` event, so the pause button, iOS swipe-back and Android hardware back all pause identically; nothing is saved from the finished/score screen or an empty field (nothing to continue). "Incompatible settings" = the stored image-regime setting differing from the paused test's regime; the initial page re-checks on every focus and clears the store when it detects the mismatch. Resuming consumes the store (`/game?field=...&resume=1`) and rebuilds the exact rounds order/index/counts/mistake flag; the current round's sentence auto-plays again (fine and desired). Pausing mid-explanation stops the explanation cleanly; the round stays current with the mistake flag preserved. Pausing during the 500 ms correct-feedback saves the already-scored advance (index + 1) so the round cannot be scored twice. `restartGame` ("Hrát znovu") does not touch the store.

## User follow-up request 7 (verbatim) — silent explanation fallback + green tappable during red

> Repair another race condition: I pressed the wrong picture, it got red, but no sentence started to play. But after some time the picture got unred (back to normal).
> Another thing: Do not make the red prevent pressing the green: currently when the red is pressed, then the text about what is correct plays, but we cannot press the green until red stops. I want to be able to press green also meanwhile the red and meanwhile the correctness explanation.

Findings and decisions (evidence in `app/game.tsx` and installed expo-audio native sources): the observed signature (red tint, no speech, un-red "after some time") is the 15 s safety-timeout path — expo-audio emits `status.error` ONLY when the native item actually fails (iOS `AVPlayerItem.status == .failed` in `node_modules/expo-audio/ios/AudioPlayer.swift`; Android `onPlayerError` in `.../android/.../AudioPlayer.kt`); an asset whose download from the Metro/Expo Go server stalls or never completes keeps the item unloaded forever with NO error and NO `didJustFinish`. Fix: a 2.5 s "must have started playing" watchdog after `play()` checks the player's synchronous `isLoaded && playing` properties and falls back to the plain 500 ms tint when playback never truly started; the 15 s cap stays as last resort for audio that started but never reports finishing. Behavior change: during the red tint + explanation, a tap on the CORRECT picture now registers — it stops the explanation immediately, clears the red, shows the green feedback and advances the round exactly like a normal correct tap (scoring unchanged: the round is already marked wrong by the mistake flag); taps on OTHER wrong pictures stay blocked during an explanation so explanations cannot overlap.

## User follow-up request 8 (verbatim) — "Věta říká" explanation texts too long/adult (recorded later; applied earlier in the task)

> Ad some versions of the corrected texts (the texts that are played when wrong thing is pressed), e.g.: "Tady kreslí kluk holčičku. Věta říká, že holčička kreslí kluka." Such formulation is wrong: it is long and it is too adult. Make it smaller and more child friendly: "Tady kreslí kluk holčičku, ne holčička kluka." Repair all "red" sentences that contain "Věta říká", or which are too long and can be made shorter and child friendlier.

Applied at the time of the request: all 42 gram-why explanation texts were rewritten to the short child pattern „Tady X, ne Y." (no „Věta říká", no meta-language about the sentence, 5–20 words, single sentence) and their audio files were regenerated. The generalized rule lives in `_TreninkPorozumeni_LEARNINGS.md` (§ Text learnings, rule 1).

## User follow-up request 11 (verbatim) — tahne repair + ImageLearnings archiving convention

> Ad "Kluka táhne holčička": On both pictures the girl is actually pulling the boy. Just on one picture it is in rage and very explicitly, on other picture it is kind of sadly. Remove the anger or sadness and make one picture truly so that a girl pulls boy and on another so that boy pulls girl (make them clearly distinguishable).
>
> One more thing: store every picture to which I have had a comment/improvement request to a separate folder under a folder TreninkPorozumeni/ImageLearnings. Store there the picture, its .txt file and my comment/request and how was it at the end repaired. We need to keep it for later to learn from the faults.

Applied convention (second paragraph): `ImageLearnings/<pictureFileBaseName>/` containing the ORIGINAL (pre-repair) png + its `.txt`, `_user_comment.md` (verbatim user request), `_repair_result.md` (how it was repaired, final prompt learnings). Applies to all user-commented pictures (kolem_target, kolem_gram, podpolstar_target, tlaci_a/_b, vede, tahne_target/_gram) — and to EVERY future image change/improvement request. Additionally, each archived case must be PROJECTED into `_TreninkPorozumeni_LEARNINGS.md` as a new or updated fault-class rule.

## User follow-up request 15 (verbatim) — controls column left of the pictures

> In the 4 picture layout: Put the image count ("1/20"), the sound button and the go back button vertically next to the the pictures (probably to the left of all pictures). WHY: because now the pictures are too small. They would be a little larger when the layout is not "First row 1/20 and sound button, second row first 2 pictures, third row the last 2 pictures", but: "1st column the go back button and image count and play sound button, 2nd column first two pictures and 3rd column the last two pictures" would give more space for the pictures.

Implementation decisions: the top bar was replaced by a vertical controls column (pause button, round counter, replay button) to the LEFT of the pictures; the 4-image regime renders two columns of two pictures (2nd column = pictures 0+1, 3rd column = pictures 2+3). The same left-column layout was ALSO applied to the 2-image regime: the app is landscape-only, so picture size is height-limited there too and removing the top bar makes those pictures bigger as well (horizontal space is abundant). Behavior (tap handling, tints, pause, explanations) unchanged; safe-area side insets in landscape are handled by the existing SafeAreaView.

## User follow-up request 16 (verbatim) — prefetch upcoming rounds' assets

> I want you to implement "add prefetching of the next round's 4 images + 4 audio files during the current round (or a one-time per-field preload with a small loading indicator at game start) — that would be a fairly small change in rounds.ts/game.tsx" (the forked subagent is just checking it)

Amendment (verbatim):

> And, actually: do prefetching of not 1 round, but of 2 rounds.

Implementation decisions: continuous prefetch during play was chosen (not the one-time per-field preload — no loading indicator needed). On every round start, a `game.tsx` effect fire-and-forgets `expo-asset` `Asset.fromModule(moduleId).downloadAsync()` for the assets of rounds `[roundIndex .. roundIndex + 2]`: the next TWO rounds per the amendment, plus the current round so the first round (and the restored round of a resumed test — the effect depends on `roundIndex`, so the resume path is covered automatically) gets its explanation audios warmed too; the current round's sentence/images still load the old way. Per round, EXACTLY the assets reachable in the regime the plan was built for are prefetched (`collectRoundAssetModules` in `src/rounds.ts` walks the round's slots): slot images (2 or 4), sentence mp3, and the explanation `_why` mp3 of each non-target slot present — in the 2-image regime `gram_why` IS prefetched (the grammatical distractor is on screen) while the unreachable lexa/lexb images and explanations are skipped. A session-wide `Set` of module ids de-duplicates; all failures are silent (the existing lazy load + watchdog remain the fallback) and nothing ever blocks the UI or the round advance. In a release build the assets are bundled, so `downloadAsync()` resolves immediately (harmless no-op).

## User follow-up request 17 (verbatim) — pause button shall look like "pause and go back"

> The pause button shall look more like "pause and go back button". The pause alone does not evoke what the user usually wants in that situation: to go back.

Implementation decisions: the button in the left controls column now shows the two-glyph pair `◀⏸` (back arrow + pause) instead of the lone `⏸️` emoji, so it visually communicates going back AND pausing. It became a wider pill (72×56, width matched to the replay button below so the column reads as one family); the glyphs are plain text characters, so they get an explicit dark-brown color matching the app palette. `accessibilityLabel` updated to "Přestávka a zpět". Behavior unchanged (same `pauseAndGoBack` handler, pause semantics of request 4 intact).

## User follow-up request 18 (verbatim) — initial page overflows with the resume button

> currently with the "Pokračuj v testu" button the buttons to not fit to the inital screen. Some better layout or scroll shall be added.

Implementation decisions (`app/index.tsx`): BOTH aspects were done. (1) Compact landscape layout — the three field buttons moved from a vertical column into ONE horizontal row (landscape width is abundant, height is scarce; labels wrap to two lines, font 26 → 20), the "Pokračuj v testu" button sits prominently full-width ABOVE the row, the title shrank (36 → 28) and the vertical margins/paddings were reduced, so the common case (title + resume + field row) fits a typical landscape phone without scrolling. (2) Safety net — the content is wrapped in a `ScrollView` with `flexGrow: 1` + centered content, so it stays centered exactly as before when it fits and becomes scrollable only when it does not (very small screens / large font scaling); the settings gear stays absolutely positioned outside the ScrollView with the safe-area insets unchanged. Child-friendly look and Czech labels unchanged.

## User follow-up request 19 (verbatim) — global single-audio rule + every picture tappable at all times

> Another repair request: only 1 audio shall always play at a time (if other audio is playing when next audio starts, the previous audio must immediatelly stop). What is not working properly currently: When I press wrong picture, it starts the explanation why it is wrong. But if I do not let it finish and click on the right picture: the "why the previous was wrong" keeps playing but also the new audio to the next 4 pictures starts playing. I want only the next audio to be playing and the former to stop. This holds generally, not just in this situation.
>
> Another thing to change: When I press wrong picture, I need to be able to press another wrong picture (not just the correct one). Now it waits for the original pressed wrong picture till its audio finishes and meanwhile I can try multiple pictures and only the right one lets me through. It is wrong that the right picture can be then tried so that only the right one works. Every picture must work at all times. So if one picture is already red and I press another wrong picture: the formerly red picture "unreds" and stops playing its sound/speech and the new wrong picture gets red instead and its sound starts playing immediatelly.

Implementation decisions (`app/game.tsx`): (1) Single-audio rule centralized in one `stopAllAudio()` helper (stops + releases a running explanation incl. its safety/watchdog timers, pauses the sentence player) invoked before EVERY audio start — sentence auto-play on round advance/restart/resume, sentence replay, explanation start — and on correct tap, restart, pause button, `beforeRemove` and unmount. `stopExplanation` now `pause()`s the explanation player BEFORE `remove()` (remove alone only schedules the native release, the likely cause of the reported explanation-under-next-sentence overlap). (2) The wrong-tap block during an explanation was removed: every picture is tappable at all times. A tap on another wrong picture un-reds the former one (single `wrongTappedIndex` state), stops its speech via `stopAllAudio()` and immediately reds + speaks the new one; the correct picture advances as before. Re-tap of the SAME red picture: RESTARTS its explanation from the beginning (chosen over ignoring — same code path, and the child may want to hear it again). Scoring unchanged: `mistakeMadeThisRound` is set on the first mistake; further wrong taps do not re-score. The replay button now also works during an explanation: it stops the explanation (red tint clears with its speech) and replays the sentence. The `explanationPlaying` React state was removed (it only fed the removed blocks); `explanationPendingRef` remains as the synchronous "explanation active" marker for the replay post-await re-check. Kept: `roundGeneration` stale-press guard, `roundAdvancePending` correct-tap path, pause/`beforeRemove` semantics, prefetch effect, 2.5 s start watchdog + 15 s safety cap (re-armed per explanation), stale-listener guard via player identity.

## User follow-up request 20 (verbatim) — settings button stopped working

> Repair the settings button: it stopped working in the last version. Then deploy and commit, push

Root cause (`app/index.tsx`): the request-18 rework rendered the absolutely positioned settings-gear View BEFORE the new full-screen ScrollView sibling. React Native hit-tests later siblings first, and the ScrollView (`flex: 1`, covering the whole SafeAreaView) claimed every touch — including touches over the gear, which was still visible (it drew under the transparent ScrollView) but unreachable. Fix: the gear View moved AFTER the ScrollView in JSX (styles, insets, and the `navigateOnce` guard unchanged). The other touchables on the screen (resume button, field buttons) live INSIDE the ScrollView content, so no sibling overlays them — no equivalent hazard.

## User follow-up request 21 (verbatim) — animal speech-speed slider + split tests by 10

> Add to the setting speech speed options expressed as animals (snail: 60%, tortoise: 80%, human: 100%, rabbit: 120%, gepard: 150%). Make it selectable on a bar: even values like 90%, 64%, etc. Do not produce special .mp3s, just play the existing mp3s slower or faster.
>
> Another thing: split the current tests to by 10 (not by 20). So make it 6 tests instead of 3.
>
> Then: verify, deploy, commit, push

Q&A / caller amendments: range 60–150 % with integer percent steps; Czech animal labels (Šnek/Želva/Člověk/Králík/Gepard); `expo-audio` `AudioPlayer.setPlaybackRate(rate, 'high')` with pitch correction for BOTH the sentence and the explanation players; the game reads the speed at game start (same pattern as the regime — a mid-game settings change applies only to the next game); test split deterministic by `src/items.ts` order (field's examples 1–10 → "<field label> 1", 11–20 → "<field label> 2"), shuffle stays WITHIN the 10; paused-test identity must include the sub-test and "Pokračuj v testu" names it; route param extended with backward-safe fallback; round counter "n / 10".

Implementation decisions: speed persisted in AsyncStorage (`settings.speechSpeedPercent`, default 100, clamped integer 60–150; `src/settings.ts`). Settings page uses `@react-native-community/slider` (installed via `npx expo install`; supported in Expo Go, `expo-doctor` still 21/21) with the five animal emoji+label+percent marks absolutely positioned at their proportional positions under the track; tapping a mark jumps to its exact value; the current value shows as "NN %". The game loads the speed once at mount into a nullable state the sentence auto-play effect waits for (even the FIRST sentence plays at the set speed) and applies `player.shouldCorrectPitch = true` + `player.setPlaybackRate(percent / 100, 'high')` right after creating each player (sentence and explanation). The speed does NOT invalidate a paused test (the round plan does not depend on it — resume simply picks up the current speed; the regime keeps invalidating as before). Test split: `TestPart = 1 | 2` in `src/rounds.ts` (`examplesForTestPart`, `EXAMPLES_PER_TEST_PART = 10`; `buildRoundPlan(field, regime, part)`); route `/game?field=...&part=1|2` (missing/invalid part → part 1, backward-safe); `PausedGame.part` added and checked on resume (initial page and game both); initial page shows 6 buttons in three field columns × two stacked part buttons (request-18 compact layout kept, ScrollView fallback remains); the counter shows "n / 10" automatically via the 10-round plan length.

## User follow-up request 22 (verbatim) — every play: latest request wins

Context: reported after the single-audio rule of request 19; sounds occasionally stayed silent on the iPhone (Expo Go).

> Do this repair: Sometimes, when new set of images appear, the sound does not play. And sometimes, especially when wrong answer is selected while the intro speach to the images is playing, it happens that the speech to the wrong answer (to the redded picture) does not play. I want you to properly repair every play: that everytime the last speech/sound which is due to play starts playing and everything else what was before that stops playing immediatelly. Ensure every sound play works like this everywhere.

Implementation decisions: new central controller `src/audioController.ts` (the only code creating/playing/releasing players): `playAudio(source, {key, owner, rate, onFinish, onFailure, startWatchdog, retryOnceOnStartFailure, safetyTimeoutMilliseconds})`, `stopAllAudio()` and `stopAudioIfOwnedBy(owner)`. Every request bumps a monotonically increasing play token and stops everything first: pause, then remove the listener subscription and `remove()`, then `release()`; every async continuation (status listener, watchdog/safety timers) re-checks its token / object identity. Every request gets a FRESH player (no player re-use, no `seekTo`), so a stale `didJustFinish` of a previous playback can never kill a replay. Screen cleanups are owner-scoped: unmount and round change call `stopAudioIfOwnedBy(screen)`, so a leaving screen never silences another (resumed) screen; pause/`beforeRemove`/restart/correct tap call `stopAllAudio()`. The sentence has a 2.5 s start watchdog with ONE fresh-player retry (also on `status.error` before start and when `createAudioPlayer` or `play()` throws); a sentence seen playing, advanced (`currentTime > 0`) or finished counts as started and is never retried; the retry's watchdog only logs a warning and never stops the retry (a slow sentence plays late rather than never; no further retries). The explanation watchdog of request 7 is unchanged. `leavingRef` (set in `beforeRemove`) blocks sentence auto-play, replay and picture taps during the exit animation; `userAudioRoundRef` keeps a child's wrong tap/replay in a round from being overridden by the late sentence auto-play (audio mode not yet ready). Root-cause fix: players are created with `keepAudioSessionActive: true` — expo-audio's iOS `pause()` otherwise schedules an `AVAudioSession.setActive(false)` 100 ms later whenever no player reports `.playing`. HYPOTHESIS (code-derived, not confirmed on a device): this deactivation silenced a new sound still loading right after the old one was paused.

## User follow-up request 23 (verbatim) — record the "Věta říká" shortening rule in the docs

> Add the '"Věta říká" text shortening' learning/instruction also to the prompts file and to the learning file.

Result: request 8 (with its application summary) was added above in this file; `_TreninkPorozumeni_LEARNINGS.md` already contained the rule verbatim with the actionable instruction (§ Text learnings, rule 1: never „Věta říká", pattern „Tady X, ne Y.", 5–20 words).

## User follow-up request 24 (verbatim) — record the ImageLearnings archiving + projection instruction

> Ensure that the instruction that every image change/improvement request shall be stored into the image learnings folder and projected to the learnings file: put this original instruction to the Prompts file and ensure it is also in the learnings file.

Result: the original instruction (User follow-up request 11, second paragraph) was added verbatim above in this file together with the applied folder convention; `_TreninkPorozumeni_LEARNINGS.md` cross-cutting checklist item 7 states the full obligation: archive every user-commented picture under `ImageLearnings/<pictureFileBaseName>/` (original png + .txt + `_user_comment.md` + `_repair_result.md`) AND project it into the learnings file as a new/updated fault-class rule.

## User request 25 (verbatim) — 15 test types, test-set list page, two variants per item, 100 sets per type

Context: /delegate-1-ops request after the audio fix (request 22); master managed the run, clarification in two AskUserQuestion rounds.

```
I want you to be a manager of the following large changes:
* Every four pictures set (1 test question (set)) shall have two variants of test: "Lev tlačí medvěda" vs "Medvěd tlačí lva". Currently in the test set there is always only one of those variants. I want every four pictures to have two variants and in the 10 test question set always exactly one of the two variants shall be tested (which one is tested is chosen randomly). It means that for every pair of responses: "Target"-"Grammatical Distractor" a sentense which will make the "Grammatical Distractor" from "Target" and "Target" from "Grammatical Distractor" shall be invented. WHY all this: it is needed when chilren play the same 10 test question set again: if we do not do this, they just remember which image is the correct one. Only when we randomize for each set of pictures the actual question sentence and its output: they will have to listen to every sentence (because the correct picture could be different than the last time). But it also means that for the second option 4 different mp3 recordings will need to be made (1 for the question itself - the intro sentence itself and 3 for the wrong answers). But: the images will not need to be regenerated. And the Lexical Distractors stay the same. So: for every every existing test set of 4 pictures create an alternative question variant + alternative mp3s.
* I want you to manage subagents changing the intro page: there shall be instead of 3 x 2 types of tests (5.1,5.2,5.3 x 2) exactly 15 selectable types of tests (5.1 - 5.15) and when a test type is selected, a page with list of test sets for the given test shall be show. Currently it would be empty for everything 5.4 - 5.15, and the 5.1,5.2,5.3 would have 2 test sets each (test set 1-10 and test set 11-20). There shall be a "go back" button and if clicking on a test set: it shall start (so e.g. clicking on 1-10 button it will start this test set for the currently selected test type).
* Explore the Documentation folder: there are three .md files where the 5.1 - 5.15 types of questions are described. I want you to manage subagents to incorporate every of 5.1 - 5.15 test types and for every test type to create 100 test sets (grouped by 10: 1-10, 11-20, ..., 91-100). Every test set:
   * shall be tested for czech language correctness of the sentence and of the "wrong answer" texts
   * shall get its own 4 images created by /image-generation skill:
      * the images shall go through blind test rounds until it is completely clear what the pictures wanted to say
      * the images shall be also tested for real-world correctness (explore the ImageLearnings folder what to verify in the images)
   * and every test set shall have two variants (and each variant having a different correct answer picture: keep the rule of switching "Grammatical Distractor" and "Target").
Do the test sets consequentially (first full 5.1, then full 5.2, etc.). After every 5.1 set is finished: run verify-improve-rounds, and after it is finished: deploy the new app to the EndgameServer, do not commit, and go to the next set.

Explore and ask clarification questions now. You need to ask everything beforehand because I will not be here to answer your questions later. But collect the open questions if any.
```

Q&A (verbatim, AskUserQuestion round 1):
- Q: "100 test sets" per type = 100 picture-items (each with 4 images), grouped as 1–10 … 91–100. For 5.1/5.2/5.3, should the existing 20 items become sets 1–20 (then create 80 new each), or create 100 completely new items?
  A: Reuse as 1–20 (Recommended) — Existing 20 blind-tested/user-repaired items become sets 1–20; create 80 new per type for 5.1–5.3 (they also get the swapped variant).
- Q: Several types don't swap Target↔Grammatical-Distractor naturally (5.4 passive: gram pictures are often absurd; 5.6 tenses and 5.15 aspect: "during" vs "finished" ambiguity; 5.10/5.12 quantifiers; 5.11 pronouns: hardly picturable; 5.14 instrumental: animated tools). How should they be handled?
  A: Constrain items (Recommended) — For each type, only invent items where both sentences are natural Czech and both pictures are clearly depictable (e.g. 5.4 only reversible animate pairs, 5.9 only comparatives). Items that can't meet this are not created. Record the decisions in open_questions.md.
- Q: Some types in the docs (5.6, 5.10, 5.11–5.15) use 2 grammatical distractors or a 'semantic/absence' third distractor instead of 2 lexical ones. How should the 4 pictures be filled?
  A: Follow doc per type — Allow a second grammatical/semantic distractor in the lexA/lexB slots where the doc defines it (explanations adapted).
- Q: This is roughly 90–110 h of unattended agent work with 6000+ Muse Spark images. The workflow is: after each full TYPE (5.1, then 5.2, …) run verify-improve-rounds, then deploy, with no commit. Is that the intended reading of "after every 5.1 set is finished", and is this scale and budget OK?
  A: Yes, per type, go (Recommended) — verify-improve-rounds plus deploy after each completed type (15 cycles); run everything; no commits.

Q&A (verbatim, AskUserQuestion round 2):
- Q: With 'constrain items', some types (e.g. 5.11 pronouns, 5.14 instrumental) may not yield 100 items that are clearly depictable AND swappable. What should happen then?
  A: Always reach 100 (Recommended) — Keep inventing new constrained items until there are 100 good ones, even if they become more repetitive in structure.
- Q: An item's image keeps failing the blind test or the real-world check. How many repair/regeneration rounds before giving up on it?
  A: 3 rounds, then replace — Faster: replace the item after 3 failed rounds.
- Q: For a swapped variant, an existing lexical-distractor picture might accidentally also fit (or nearly fit) the new sentence. Since you said images are not regenerated and lexical distractors stay the same: what then?
  A: Regenerate that lex image (Recommended) — Exception to the 'no new images' rule: regenerate only the conflicting lexical picture so it is wrong for BOTH sentences, blind-test it again and log it.
- Q: If Muse Spark is throttled or out of quota for a long time (hours), or the EndgameServer deploy fails while you're away, what should happen?
  A: Wait and retry (Recommended) — Back off and retry for up to ~2 h per outage, meanwhile continue non-image work (texts, audio, reviews). If it still fails, log it to open_questions.md and continue with what's possible; send a Discord notification.

### User request 25 — follow-up (verbatim)
"Let every 5.x type of test be managed by a separate level-1 subagent (by that way you spare your context and will be able to finish the task properly)"

### User request 25 — follow-up 2 (verbatim)
"I am permitting 3-5 repair rounds (increasing limit from 3: for cases when we are close to be OK after the third round)"

### User request 25 — follow-up 3 (verbatim)
"One more specific and general instruction: For the plural vs singular (5.3  test type): use random plural count (2-4), do NOT use fixed count as it was now (everything was 3). Mix the current 1-20 among 1-100 randomly (so that the first 20 are not all 3). Apply the same principle to all: try to differentiate on multiple fronts for every test type. Use different objects, different verbs, different prepositions, etc. Make the tests rich in diversity while keeping the words mostly among 2000 most frequent word in the language."

### User request 25 — follow-up 4 (verbatim)
"Run three test types parallelly - at the same time (to make the execution faster): each by its own level-1 subagent. No need to run it in sequence. The test types are kind of independent, so we can speed up the generation by parallellisation."


### User request 25 — 5.3 coordinator decisions (for the verbatim 5.3 instruction above)
- Sentences use a bare plural without numerals (e.g. "Hrušky leží na talíři."); singular->plural swaps also bare plural.
- Plural counts are random 2-4 and appear only in the pictures and in the grammatical why-texts (80 new items: 27x2 / 27x3 / 26x4).
- Order of all 100 5.3 items (src/items/field53.ts) = Python random.Random(530053).shuffle(old 20 + 80 new), script p5_integrate.py; old 20 land at positions 3,6,7,8,14,15,19,25,27,29,50,51,55,59,61,64,71,75,76,82.

### User request 25 — follow-up 5 (verbatim) — test-type scope rule
"Another strong instruction to remember and follow from now on (also in every future development; write to README.md): before every test type implementer starts: run explorers with permission to use web to find out exactly what the given test type is about and what everything belongs to it. We need to not only follow a strict test type example, but to test everything what grammatically or in other way belongs to the given test type. Example: The 5.4 section "Slovesný rod" uses for everything "trpný rod (pasivum)", but the test purpose is to check whether children understand correctly "trpný rod", since the "rod činný" is more frequent and it is supposed that they already understand it (because: more normally used "rod" is "rod činný (aktivum)"). But if all the test questions are in "trpný rod", the children will just learn during the training app to "switch against how it normally works" - that "switched against normal is the correct answer", and they will not fully grasp the difference nor to understand quickly if the two "rod"s are used in normal spoken language. Therefore it is highly advantages to dedicate a minority of test questions (e.g. 1/3 of test questions in the test type) also to other forms of the given grammar/problematic. In this case it would be to dedicate roughly 1/3 of questions also to "rod činný" and to questions to contain "rod činný". These shall be mixed among the "rod trpný" questions proportionally and randomly (definitelly it shall not be so that there are 20 consecutive questions with "rod trpný" and then 10 consecutive questions with "rod činný"). They shall be reasonably mixed. And in this case the mix can be also such that in one test set of 4 images when we have two variants pointing to different correct image result: one variant can be in "rod trpný" and another in "rod činný". In this case we can do the mixing also in this way.

Launch a fresh evaluation subagent of this rule. Let him propose repeated clarification questions (if needed) of this rule (you have quite long context already, so letting it consider a new agent would be better): for future agents to understand the rule properly and use it correctly.

Then add this new rule to the prompts file and to a dedicated .md file which will be referenced by README.md with instruction to load it when a new test type is implemented."

#### Q&A (verbatim) — follow-up 5
1. Q: Should already-finished types be reworked to follow the new rule? (5.4 is now 100% passive; 5.1 and 5.7 each use a single construction; 5.3 and 5.5 already mix through their swapped variant.) — A: "Rework, text+audio only (Recommended)"
2. Q: What about the types in progress (5.6 tenses, 5.8 gender, 5.9 comparison)? — A: "Apply now (Recommended)"
3. Q: How should the 'roughly 1/3' be counted? — A: "Per played sentence. Over all 200 variant sentences of a type, the target is 32–34% minority form, and every group of 10 has at least 3 minority sentences in expectation (the variant is picked 50/50 at play time)."
4. Q: How should the minority be mixed in? — A: "Prefer mixed-variant items (Recommended)"
5. Q: Must minority items still test the type's grammatical contrast? — A: "Yes, same contrast (Recommended)"
6. Q: Who decides each type's list of 'other forms' (majority vs minority)? — A: "Explorer + coordinator (Recommended)"
7. Q: What are the web explorer's limits and where does its output go? — A: "Read-only Czech sources, saved in app (Recommended)"
8. Q: Does this rule override 'Follow doc per type' and per-type feasibility constraints (e.g. 5.9 comparatives only)? — A: "Yes, where depictable (Recommended)"
Rule file: _TestTypeScopeRule.md (referenced from README.md).

## User request 26 (verbatim) — apply mobile-apps-preferences

"Meanwhile: appoint a new level-1 subagent to load delegate-1-ops and mobile-apps-preferences skill and to manage implementation of everything written in the mobile-apps-preferences skill into the TreninkPorozumeni app. Everything what is in the skill overwrites current potentially conflicting instructions (e.g. that we shall preload 5 rounds instead of 2, etc.)."

Note (coordinator): per this request the mobile-apps-preferences skill overrides these earlier instructions: request 16 "Implementation decisions" (Metro/expo-asset prefetch of 2 rounds, "no loading indicator needed", static `require` of all assets, "in a release build the assets are bundled") → per-item zip archives from ResourceBackend, on-device compressed LRU cache (200 MB), preload of the next 5 rounds, start animation while round-1 resources load; SPEC "Rounds" (current + NEXT TWO rounds, SPEC:71) → next 5 rounds; SPEC "Technical notes"/"Assets" (static require, PNG per id bundled) → backend-served per-item archives, only UI/icon/splash bundled; SPEC:130 provenance `.png.txt` next to images → excluded from the packer and the bundler (files are not moved, because field content is edited in parallel); README "Deploy" (shared screen `expo`) → per-app screen `expo-TreninkPorozumeni`, port 8081. New: custom app icon + splash (welcome) screen. NOT overridden: every request-22 audio controller guarantee (hot sounds = pre-cached local file URIs passed to a fresh player per play).

## User request 25 — follow-up 6: final verification clarifications (Q&A verbatim, 2026-10-03)

Context: questions asked by the coordinator before the final rework/verification phases of the 15 types (endgame task `AGENTS/Tasks/20260930_191525_TreninkPorozumeni15Types`, `_plan_progress_L2.md`); questions in short form, answers verbatim.

1. Q1: When to commit/push (after each deployed phase / only at the very end / no commit)? — A: "After each deployed phase"
2. Q2: Deploy the rework even though the types are already live? — A: "Yes, after Phase A and also after Phase B and C"
3. Q3: Backend images are already 512×512 PNG; convert backend-archive images to JPEG/WebP, or skip and log? — A: "Skip and log"
4. Q4: 5.2 word-order-only minority (PP-first) if judged insufficient: replace with real directional forms, or accept and log? — A: "Accept and log"
5. Q5: 5.5 minority share at the upper edge / verb repetition („nesedí" 8× in 32 negated): accept, or push toward 33 %? — A: "Accept larger minority, vary verbs"
6. Q6: Repair scope if the final check finds issues in already-deployed types: fix medium+ and redeploy / fix all incl. low / log only? — A: "Fix medium+ and redeploy"
7. Q7: Rework: regenerate a lexical image when a new sentence makes that lex picture fit? — A: "Regenerate that image"
8. Q8: Server cleanup of orphan archives and old /tmp uploads: remove each explicitly, or leave and log? — A: "Remove, one file per command. Be VERY careful with each removal (so that nothing goes wrong)."
9. Q9: /tmp/x.py created outside the repo by a worker: leave and report, or delete? — A: "Leave and report"
10. Q10: Verification round cap: up to 5 rounds then log remaining lows, or unlimited? — A: "Up to 5, then log the lows"
11. Q11: Keep the Fable ban / opus-medium-agent verifiers? — A: "Keep Fable ban, use fable only as advisor if needed."
12. Q12: Pending open_questions.md items: present at the end, or decide each now? — A: "Present at the end"
13. Q13: Provenance `.png.txt`/`.part` inside `assets/` (excluded from bundler and packer): leave and log, or move to a repo-only folder? — A: "Leave and log"
14. Q14: A reworked type cannot stay within 32–34 % minority share: choose other items/forms until in range, or accept another value and log? — A: "Minority share 33-50% is permitted when enough diversity is could not be achieved otherwise."
    - Coordinator interpretation: 32–34 % stays the target; a higher minority share (up to 50 %) only when enough diversity cannot be achieved otherwise; every such case is logged (rule file `_TestTypeScopeRule.md` §4).
15. Q15: Endgame repo still tracks force-added AudioFix_R* verification files: leave, or untrack in the next commit? — A: "Untrack in next commit"
16. Q16: Device/Expo Go end-to-end check: user tests manually, or agents re-check via web preview? — A: "You test manually"

## User request 27 (verbatim, 2026-10-03) — Round 2 feedback on open questions
Context: answers to open_questions.md items 3 (server orphan cleanup), 4 (5.5 minority share), 6 (endgame AudioFix_R untrack), 7 (machine addresses in tracked files), plus 5.5 explanation and 5.11 diversity feedback.

"""
Ad 5.5: it must be corrected. I opened the example with "Lev neleží na kameni.". The picture with lev on a stone says: "Tady lev leží na kameni, nepije z řeky.": the "nepije z řeky" is completely irelevant and not a proper explanation. The only relevant part is "Tady lev leží na kameni." and maybe yet better explanation would be "Tady naopak lev leží na kameni.". But also picture with zebra is wrong and misleading and could be much corrected, curent text: "Tady neleží na kameni zebra, ne lev". The "Tady neleží na kameni zebra" is wrong, it shall be "Tady je zebra". The part about kámen is irelevant and there even is not "kámen" there. So the proper explanation would be "Tady je zebra, ne lev". The third picture text (with tiger on the stone) is also mediocre, current text: "Tady leží na kameni tygr, ne lev". The text contradicts/explains only the tiger vs lion, but it does not explain, that it wronglz lies on a stone. So the correct explanation would contain also the stone lying explanation: "Tady je místo lva tygr a navíc leží na kameni.". That sentence is correct and nice in czech and yet explains both problems: that there is tiger instead of lion and that it lies on the stone instead of not lying on it. Go through all texts and improve the explanations significantly.

Ad 5.11: 29 of podává is too much. There are countless of possibilities of what one person or even a dog (animal) can do with a thing of he/she/it (of other person or thing). Just a few of examples, that may be multiplied/said differently in multiple ways (and which even do not need the constructs with the two very distinguished colors of their clothes): "pes roztrhl její sukni", "chlapec jí dal svou hračku" (e.g. traktor or bagr (typical male toy)), "utrhl její jahůdku" (a boy is seen to hold a straberry while the girl pures water on strabberries), "odnesl její klubíčko" (a dog (which is in czech language a male) is seen with ball of yarn (which is typically connected to cats) and a cat is somewhere further behind (in czech language "kočka" is a female word)), etc. etc. So many possibilities. Instruct the subagents to be much more creative: with the persons (animals, objects) and also with the verbs and target objects. But do not just throw away the current already created examples. Rather put them to an Extra category (behind all the 1-10,...,91-100 categories), no need to delete them completely, if they are otherwise good. I just need the 1-100 pictures in regular categories/excercises to be good and nicely diversed and to have nice diverse examples.

The previous holds for everything: when we have already good pictures and an otherwise good test set (then it is just alone: not being considered as part of 100 of its kind), then never delete it: put it into Extra (category above the 100 count).

Ad 3.: I approve the clean up: but be very careful not to delete anything else than what is wanted.

Ad 4.: 5.5's minority share: 37.5% is ok.

Ad 6.: I explicitly request: the AudioFix_R* untrack

Ad 7.: "Private machine addresses are in tracked mobile-apps files": private are ok, public would be problem
"""

Follow-up (verbatim): "And you (your subagents) are now permitted to use fable as advisor or idea maker or evaluator"

## User request 28 (verbatim, 2026-10-03) — Round 2 Q&A answers
Context: answers to the 27 upfront Round 2 questions (Task folder round2_questions.md).

Answers to round2_questions.md, verbatim as relayed by the coordinator:
- Q1 Extra layout: "One Extra tile + sub-screen".
- Q2: "Only if type has extras".
- Q3: "Exempt" (Extra items are exempt from the ratio rules).
- Q5 progress tracking: "Yes, same as others".
- Q4 order: "Seeded shuffle".
- Q6 5.11 verb cap: "≤6 of 200, ≤3 minority".
- Q7 objects and actors, USER'S OWN ANSWER verbatim: "No object or person or animal repeat in more than 25% of test sets".
- Q8/Q9: "As many as caps need".
- Q10 tense: "Mixed past + present".
- Q11 gender: "Via grammar, where clear".
- Q12 templates, USER'S OWN ANSWER verbatim: "Use more natual explanations generally. Always first: evaluate, what everything is wrong on a picture, and what to the contrary should there be or be differently (make this evaluation first). Then propose 5 very short and coincise explanations in czech. Then let 3 evaluators rate them by factual correctness, czech language correctness and by which is the most natural czech language sentence. Decide the winner according to rates, for ties decide yourself (the currently executing agent). Use this for all categories."
  - Follow-up answers: batching is allowed ("Yes, batch": the 3 evaluators can each score 20–50 texts per run). The 5-candidate process runs "Only those found flawed", after every text has been evaluated.
- Q13: "Evaluate all, rewrite flawed".
- Q14: "Fix all" (style issues included).
- Q15 length, verbatim: "1 short sentence is prefered, but if no correctly explaing AND simple sentence exists (children need simple sentences), then it may be longer. But always prefer coinciness."
- Q16: "Separately per variant".
- Q17 [coordinator interpretation]: covered by the Q12 process.
- Q18 stale `_why.mp3`: "Leave and list".
- Q19 orphans: "Assess; good ones to Extra" (delete the rest one file per command, VERY carefully).
- Q20 [coordinator interpretation]: approved items are cleaned up before the deploy and new orphans after it, as you recommended.
- Q21 deploy: "After each phase" ([coordinator interpretation] deploy after EACH content phase, i.e. B, C1, C2, C3 and D, with the Extra mechanism shipped with the first one).
- Q22/23 endgame: "Untracks + pending KB, then push".
- Q24 mobile-apps [coordinator interpretation]: commit and push after each deploy, as authorized before.
- Q25 Fable: "Advisor, ideas, evaluator" (final verifiers stay opus-medium-agent; Fable can be one of the 3 evaluators).
- Q26 picture: "Re-render only that one".
- Q27 other types' diversity: "Measure and report only".

## User request 29 (verbatim, 2026-10-03) — Q7 clarification: what is a "test set"
Context: clarification of the Q7 answer in User request 28 (5.11 rule "No object or person or animal repeat in more than 25% of test sets").

- Question: For the 5.11 rule "No object or person or animal repeat in more than 25% of test sets", what is a "test set"?
- User answer verbatim: "Group of 10 (≤2–3 groups of 10)".
- Option description: "No object, person or animal in more than 25% of the 10 groups (1–10, …, 91–100). Much stricter, so far more replacement items."
- [coordinator interpretation]: for regular items 1–100, each specific object, person role and animal may appear in items from at most 2 of the 10 groups (25% of 10 = 2.5). Extra is exempt.

## User request 30 (verbatim, 2026-10-04) — ElevenLabs regeneration of all TTS sounds

"There is a new skill text-to-speech. I would like you to manage by another L1 agent a regeneration of all "text to speech"-like sounds in the TreninkPorozumeni application using everywhere the elevenLabs method and the scripts/methods described in the skill (they override any method/instruction used till now). Also: I want the syllables to have just one form (to be generated in just one form): not trying to generate it for mid-word and word-end separatelly."

- Question: "Another session already regenerated LetterTraining + LetterPexeso with ElevenLabs, with syllables in one form, but without the skill's „Slabika:" lead-in. What should the ElevenLabs regeneration phase cover?"
- User answer verbatim: "TreninkPorozumeni only (Recommended)".
- Option description: "Leave LetterTraining and LetterPexeso as the other session made them."

## User request 31 (verbatim, 2026-10-04) — answers to ElevenLabs questions Q-E1..Q-E10

- Q-E1 quota: "I count with that and I enabled pay-as-you-go with 0.08$/1000k characters and limit 500$. That means upto about 6M characters, so you are fine."
- Q-E2: "No need to see it: upto 6M you are fine." (still Fatal stop on 401/quota)
- Q-E3 order: "Generate by ElevenLabs the test types that are already rewritten, then continue to rewrites which will finish later (after they finish)"
- Q-E4: "Raw, no trimming now (may be requested later)."
- Q-E5: "No checks now. Deploy it and I will check it directly in the application."
  - L2 interpretation (not user words): no listening/quality checks; keep cheap automatic integrity checks (exists, mono/44.1k/192k, non-zero sane duration, TS==text).
- Q-E6: "Per batch of finished types"
- Q-E7: "Keep committing"
- Q-E8 speed: "Default speed"
- Q-E9: "Generate once, copy"
- Q-E10: "List only"
