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
