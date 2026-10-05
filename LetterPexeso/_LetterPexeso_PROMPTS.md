# LetterPexeso — user prompts and decisions

## User request (verbatim)
I want you to create and implement a new application LetterPexeso. It shall be primarily for iphone and it shall work as following: it should randomly choose a subset (9 letters) of all czech alphabet letters (including "písmena s háčky"). It shall show them in 3x6 layout and it shall let a child play that pexeso game. When a card is touched, it turns over. When two different are turned over: after 1 second or after clicking other card or other area: they turn back hidden. When two same cards (representing the same letter) are open, they immediately disappear.
At the end there shall be statistics on how many right/wrong matches the game was finished and offer to play again.

## Master decisions (not user-specified)
These are defaults chosen by the implementing agent, NOT specified by the user:
- Location: `OtherApps/MobileApps/LetterPexeso/`.
- Stack: Expo (latest SDK, `npx create-expo-app@latest`, TypeScript), testable in Expo Go on iPhone.
- Letter pool = full Czech alphabet (42): A Á B C Č D Ď E É Ě F G H CH I Í J K L M N Ň O Ó P Q R Ř S Š T Ť U Ú Ů V W X Y Ý Z Ž (CH as one card). Kept as one constant for easy change.
- Layout: 3 columns x 6 rows (portrait), 18 cards = 9 pairs, cards fill the screen.
- Mismatch: when 2 different cards open, a 3rd tap anywhere (card or background) hides both immediately; the tapped card (if hidden) is then flipped as the new first card. Otherwise auto-hide after 1000 ms.
- Match: both disappear immediately (leave an empty slot, grid does not reflow).
- Stats at end: right matches (always 9), wrong matches (mismatched pair attempts), total attempts; "Play again" button -> new random 9 letters.
- Game logic in a pure TS module with unit tests (jest via jest-expo) — logic verifiable on Windows without iPhone.
- Tapping the single already-open card does nothing; tapping an empty slot (removed pair) behaves as a background tap.
- UI texts in Czech (child audience in CZ): "Pexeso písmen", "Správně", "Špatně", "Pokusů celkem", "Výborně!", "Hrát znovu".
- `ios.supportsTablet: false` (app is primarily for iPhone, portrait-only).
- "Other area" (background) includes the top/bottom safe-area strips (status bar / notch / home-indicator areas): tap anywhere outside a card hides a shown mismatch.
- Tap on one of the two shown mismatched cards hides both without reopening the tapped card.
- Tap on an empty slot (removed pair) = background tap.

## Follow-up 1: landscape
User request (verbatim):
Make the game landscape (rotate it by 90 degrees: all the texts).

Master interpretation (not user-specified):
- The app runs in landscape orientation: app.json `"orientation": "landscape"`, and additionally lock at runtime with `expo-screen-orientation` (`ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE)` on mount, installed via `npx expo install expo-screen-orientation`) so it also holds in Expo Go. Guard it so web does not crash (lockAsync may reject on web — catch and ignore).
- The grid becomes 6 columns x 3 rows (still 18 cards / 9 pairs), sized to fit the landscape safe area (iPhone landscape has left/right notch insets — respect them). All texts (header, card letters, end overlay) read normally when the phone is held sideways — i.e. regular unrotated text in a landscape layout, no CSS transform rotation.
- Header + grid + end overlay must fit the short landscape height (e.g. iPhone SE landscape ~375x667 → height 375 minus insets): consider putting the header compactly (single line) or to the side; end overlay must stay usable (it already has a ScrollView).
- Choose the layout from the actual window dimensions (useWindowDimensions): if width >= height use 6x3, else 3x6 as a fallback — so the browser preview (which cannot lock orientation) still looks right in either shape.
- This supersedes the earlier master decisions "Layout: 3 columns x 6 rows (portrait)" and "portrait-only" (3 x 6 stays only as the fallback for a portrait-shaped window).

## Follow-up prompt 6 — Pexeso improvements (standalone LetterPexeso + integrated in LetterTraining) (verbatim)
Appoint subagents with the following improvements of both LetterPexeso app which is outside (standalone) and inside (integrated into) this LetterTraining app (and write it to prompts file(s)):
* add the following general options into settings and implement them into the pexeso:
  * using "hacky", using "carky" separate checkboxes. By default the "hacky" on, the "carky" off
  * pexeso size: 2x2, 2x3, 2x4, 3x4, 3x5, 3x6, 3x8, 4x8, 4x10
  * there shall be a setting saying whether the sound is played loud or silent: this setting is applicable only when letters or images are selected; we cannot turn off sounds for empty cards with sound only. When on: whenever a card is touched its content is played (the letter or the name of the image)
* add to the settings also the following options. Every of the following options shall be mentioned twice, in two columns (in every column each of the following options shall be once, so in column 1 (card1 from the pair) there shall be: capital vs lowercase radio button group, tiskací vs psací radio button group, the previous two radio button groups shall be active only when the "letters" option in radio button group "letters vs images vs empty cards with letter sounds" is selected ...)
  * capital vs lowercase letters
  * "Tiskací vs psací": written vs printed letters
  * letters vs images vs empty cards with letter sounds only
      * the "capital vs lowercase letters" option and "Tiskací vs psací" option are active (not disabled, not greyed out) only when letters are selected (because for other options (images or sounds) they do not make sense)
      * letters means that on every card is a letter
      * images means that on a card is an object with very unambigous name (top images from the "skládání slov" game could be used) and a first letter is taken from the word which is represented by the image (and the letter is matched against to whatever is on other card)
      * empty card (sound) means that when the card is turned over: there is unique picture of ear and from sound going to the ear for every of the cards from this group and the sound of the letter is played ... so every card has its assigned letter, but it is not shown visually, it is only played
  * WHY the two columns: because we shall be able to select what to match against each other freely: we should be able to play e.g. the following games: capital printed letters vs capital printed letters (the basic version), lowercase written letters vs images, images vs empty cards with sounds, etc., basically we want to be able to play any combination against each other combination
* the calculation of results shall be different:
  * the attempt shall NOT be considered wrong if the player could not know where the other card is (when the other card to the pair was not yet turned over; but it shall be considered wrong if any of the two cards was turned over already 3 times). And if the two cards match: that shall be considered as "right".

Pass it to a fresh evaluation agent and let him ask through you repeated clarification questions.
Continue also the stopped subagents: they were stopped accidentally

## Q&A 8 — Pexeso improvements round 1
- Q: 3x5 (odd card count)? A: Drop 3x5.
- Q: Diacritics checkboxes? A: Á…Ý + Ů under čárky (Recommended): háčky = Č Ď Ě Ň Ř Š Ť Ž; čárky = Á É Í Ó Ú Ý + Ů; CH always included.
- Q: Psací font? A: Find a free font (Recommended) — web search for a free, licence-checked Czech school cursive font with diacritics; show the candidate to the user before bundling.
- Q: Neutral attempts on results? A: "Show the wrong tries and total tries."

## Q&A 9 — Pexeso improvements round 2
- Q: Ear pictures on sound cards? A: Same ear everywhere — one identical ear picture on every sound card.
- Q: Standalone LetterPexeso? A: Full feature set (Recommended) — copy letter sounds, accepted pictures, word audio, word data; add expo-audio.
- Q: Sound on match? A: No, only on flip (Recommended).
- Q: Images vs images? A: Different, same first letter (Recommended) — two different pictures whose words start with the same letter; letters with only one picture left out of that board.

## Follow-up prompt 7 (verbatim)
Ad the "psací písmo": find some free "Comenia script" font, not "tradiční vázané písmo"

## Follow-up prompt 8 (verbatim)
Or actually: add there both options: commenia script and the tradiční vázané písmo. Show me 3-5 alternatives for both and I will choose

## Q&A 10 — psací fonts
- Q: Comenia-style font (free look-alikes; Comenia Script itself is paid)? A: "Playwrite FR Modern" (Playwrite FR Moderne, OFL).
- Q: Tradiční vázané písmo font? A: Playwrite CZ (OFL).

## Q&A 11 — Pexeso scoring details
- Q: Count mismatch as wrong when the SECOND card's partner was seen before? A: Only first card's partner (Recommended) — wrong only if the FIRST flipped card's partner was already seen.
- Q: 3-flip rule — which flip counts as wrong? A: From the 3rd flip (this flip included).

## Follow-up prompt 9 (verbatim) — custom icon and welcome screen
"a new custom icon and welcome screen shall be created based on the specified purpose of the app (WHY: because we have already mutiple Expo Go apps and each of them has the default icons and welcome screen; we need to be able to distinguish them also visually); create the icon(s) and the welcome screen by the image-generation skill. Instruct it to create decent welcome screen(s) for mobile/ipad apps with such and such functionality: try three different functionality specifications, every one with some concrete imaginable things. Then let three independent opus subagents consider the three pictures in random order and ask them which picture best reflects the app purpose. Choose that picture(s), based on that create smaller icon(s)."

### Outcome
- 3 welcome-screen candidates were generated (Muse Spark); 3 independent judges unanimously chose welcome1_letter_picture_pair.png (pexeso board of star-backed cards, two flipped revealing letter "M" and a mouse, sparkles, watercolor, no text).
- App icon derived from the winner's motif (two flipped cards "M" + mouse with sparkles, same watercolor style) — accepted on generation attempt 1; provenance in AGENTS/Tasks/20261001_162724_LetterTrainingMobileAppsPreferences/Temp/AppIcon/LetterPexeso/ (endgame2 repo).
- Wired in: assets/icon.png (1024x1024), assets/splash.png (winner, 1280x1920), android adaptive foreground/background/monochrome and favicon regenerated from the icon; app.json got a splash block (contain, background #F9F2E5 sampled from the splash edges) and adaptiveIcon backgroundColor #F9F2E5.

## Phase E — mobile-apps-preferences in the standalone app (2026-10-01)
User request + all Q&A answers are recorded verbatim in `LetterTraining/_LetterTraining_PROMPTS.md` /
"## Follow-up prompt 9 — mobile-apps-preferences (backend resources, cache, preload) (2026-10-01)" (not duplicated here).
Scope answer for this app: the user chose the answer option labeled "Per app; also update LetterPexeso" (exact option label from the clarification question; decision 8: cache per app, 200MB each; the
standalone LetterPexeso gets the same treatment).

### Implementation note
- `src/resources/` copied byte-identical from LetterTraining (expo-file-system ~57.0.7 + fflate ^0.8.3 added, same versions).
- `src/PexesoGame.tsx`, `src/components/PexesoCard.tsx`, `src/game/pexesoLogic.ts`, `src/PexesoSettingsScreen.tsx` synced
  byte-identical from LetterTraining `src/pexeso/` (identity invariant restored; `src/pexesoPlatform.ts` stays the only
  app-specific glue and re-exports the resource module).
- Image cards: picture + word audio from backend `words/<id>.zip` (decisions 2, 5, 11 — the same ResourceBackend archives as
  LetterTraining); every archive of the dealt board preloaded hot before the board shows (decision 6); offline → Czech
  retry (decision 7); letters/sound-only boards need no archives. Letter audio stays bundled and is warmed in `App.tsx`.
- Settings preview: three bundled 168 px samples (decision 9), copies of LetterTraining's `assets/images/pexeso_samples`.
- `src/pexesoWords.ts` no longer `require`s word images/audio (they stay in `assets/` unreferenced, not bundled).
- Start animation (decision 4): not part of this step — arrives with the shared `PexesoGame.tsx` from LetterTraining Phase D.


## ElevenLabs regeneration of all sounds (2026-10-04)
Prompt 1 (verbatim, /ios-expo-react-native invocation): "Regenerate all sounds in applications LetterPexeso and LetterTraining by the new skill: text-to-speech using everywhere the elevenLabs method and the scripts/methods described in the skill (they override any method/instruction used till now). Also: I want the syllables to have just one form (to be generated in just one form): not trying to generate it for mid-word and word-end separatelly."

Prompt 2 (verbatim, follow-up while exploration was running): "Then: commit, push, deploy apps"

Note (not a user prompt): this supersedes the Vlasta/edge-tts audio and post-processing of the earlier prompts (long-vowel stretching/trim/fade of "## Follow-up prompt 16/18" etc.); everything is ElevenLabs raw per the text-to-speech skill (voice CzKids_Bedtime_BestVoice, eleven_v4, language cs, mp3_44100_192). Task record: endgame2 AGENTS/Tasks/20261004_063630_RegenerateLetterAppsSoundsElevenLabs/. Syllables use the single unified method with a carrier word each (`syllable_carrier_words.json` in the task folder, listed in `assets/audio/audio_texts.md`). `letters_en/` (English) not regenerated; orphan files not regenerated/deleted. The commit/push/deploy part is handled by the master agent, not by the generation agent.

Q&A (verbatim, follow-up after verification): Q: "Syllables and *_long vowels made with next_text come out cut off (the text has no trailing period). Adding a final "." to the text ("pe.", "á."), with previous_text and next_text unchanged, gave a clean ending in 14 of 14 test runs. How do I proceed?" A: "Listen to samples first"

Q&A (verbatim): Q: "Two smaller changes the implementer made or skipped. What should I do about the letter "ú" name and the "y"/"ý" pronunciation?" A: "Revert ú name, y/ý -> í (Recommended)" (option text: Letter ú goes back to "ú s čárkou" (the implementer changed it to "dlouhé ú" without being asked). y/ý pronunciation files use "í" per the skill, with the test file updated accordingly.)

Prompt (verbatim, user question during the listening trials, about the syllable method): "How were the syllable sounds created? With "Slabika:" as previous_text:? If yes: I want it to be regenerated (as another trial) also without any "previous_text", just with "next_text"."

Prompt (verbatim, listening-trial follow-up): "And, instead of trimming: generate also variants with fade out: start untouched and end being shortened to standardized 100ms and 150ms with fadeout"

Prompt (verbatim, listening-trial follow-up): "tr, zr, hr, br use directly from variant 2 without trimming. Ad trimming: create yet variants with longer trimming and the former trimmed variants without trimming the starts at all (also the longer trimming variants shall not have the start trimmed at all)."

Prompt (verbatim, listening feedback): ""tr", "zr", "hr" sound better in variant 2, everything else sounds better in variant 3. But all variants 3 have "long empty end", or long fade out end ... could you appoint a subagent to make it shorter (by some postprocessing)? E.g. to imply faster fadeout to the already fading out part of the sound?"

Prompt (verbatim, decision after the no-previous_text trial and the post-processing trials): "The variants without "Slabika:" are clearly better. Let's go that way. For everything except hr, br, tr, zr the single "_take2" variant is the best. No further modification of that is needed (no fade out or trimming)."

Note (not a user prompt): decision implemented 2026-10-04: syllables (except the 16 vowel-less ones, whose recipe the user chooses later; their files stay untouched) and the six `*_long` pronunciation files are regenerated raw with text `"<syllable>."` (trailing period), next_text `"jako ve slově <carrier>"`, NO previous_text, language cs, no trim / fade / post-processing; flagged files (cut-off / near-silent / very short) got up to 3 retake attempts. Letter names (previous_text `"Písmeno:"`) and words are unchanged. Scripts: task folder `scripts/regen_noprev.py`, results `noprev_results.json`.

### Vowel-less syllables: final recipe (follow-up, 2026-10-04)
Context: the user listened to the 32 trial variants in `ListenSamples/VowelLess` (hr, br, tr, zr; slash-IPA vs plain letters, period vs comma, 2 takes each) and chose.

User decision (verbatim): "Use for all the _plain_comma_t2 variant (for all hr, br, tr and similar) as it is."

Note (not a user prompt): implemented for all 16 vowel-less syllables (bl, br, chl, cvr, fr, gr, hr, mr, prs, prst, srd, tr, vlk, vr, zmrz, zr): plain letters (no slash-IPA), text `"<syllable>,"` (trailing comma), next_text `"jako ve slově <carrier>"`, no previous_text, language cs, raw. hr/br/tr/zr = the existing `_plain_comma_t2` trial files copied byte-identically; the other 12 generated (script `vowelless_final.py`, results `vowelless_final_results.json` in the task folder). Syllable files exist only in LetterTraining; recorded here too for consistency.


### *_long vowel files = copies of the vowel letter files (follow-up, 2026-10-04)
Context: after the regeneration, the user listened to the apps; the `*_long.mp3` vowel files (a_long, e_long, i_long, i_soft_long, o_long, u_long; made with text "á."/"é."/... + next_text "jako ve slově <word>") sounded odd.

Prompt (verbatim): 'Ad a_long and e_long: they sound weird. I want them (and analogous ones) to be created exactly as the "a.mp3" and "e.mp3". I also want the skill text-to-speech to be updated in this way (so that sounds like a_long and e_long are never more created). This holds only for vowels.'

Prompt (verbatim, correction): 'Not forbiding long vowel form, but generating it in the same way as "a.mp3"'

Clarification question asked by the master (verbatim as relayed, abbreviated by "..." in the relay): 'What exactly differs between how a.mp3 was made and how a_long was made? ... Which part should a_long take from a.mp3?'

User answer (verbatim): "Nothing differs between them (the sound and the creation). The only difference is that "a.mp3" corresponds to vowel "a" and "a_long.mp3" corresponds to vowel "á". But they are pronounced exactly the same and shall be created in the same way (and since a.mp3 is already created: we can create a_long.mp3 as copy of a.mp3)."

Note (not a user prompt): implemented as byte copies in `assets/audio/letters`: a_long = a.mp3, e_long = e.mp3, i_long = i_soft_long = i.mp3, o_long = o.mp3, u_long = u.mp3 (file names unchanged; code/tests unchanged). Task scripts: `build_jobs.py` (`LONG_COPY`), `gen_audio_texts.py`.


### Misread syllables: only the slash-IPA (V2) files are right (follow-up, 2026-10-04)
Context: the user listened to the Misread trial (`ListenSamples/Misread`: sy, lec, xy, pid, cvr, xo, uk, xi in variants V1-V6) and to the installed syllables.

Prompt (verbatim, earlier feedback): "all lec, xy, sy, pid and cvr are wrong. E.g. "sy" is pronounced as "es ypsilon", the "lec" is pronounced as "el é cé", etc."

Prompt (verbatim, feedback on the trial): "Ad cvr: only the cvr_V2_ipa_t1 and cvr_V2_ipa_t2 files have it right. And the same for everything else."

Note (not a user prompt): interpreted as: for every syllable of the trial (sy, lec, xy, pid, cvr, xo, uk, xi) only the V2 slash-IPA files are right. Implemented 2026-10-04: `<syl>_V2_ipa_t1.mp3` installed as a byte copy over `assets/audio/syllables/<syl>.mp3` (LetterTraining only; the LetterPexeso app has no syllable files). Other scan suspects (hvěz, naut, ap, mat, nec, min, qe, rov, tec, svíč, špend) got slash-IPA samples in `ListenSamples/Misread2` (not installed, awaiting the user's listening). Scripts: `misread2.py`, `gen_audio_texts.py`.


### IpaSlashContext / IpaCut feedback: Q4 recipe for ap, mat, uk (follow-up, 2026-10-04)
Context: the user listened to the IpaCut trial (cut variants) and the IpaSlashContext trial (`ListenSamples/IpaSlashContext`: ap, mat, uk, sy, xy in recipes Q1-Q6, slashes in previous_text/next_text).

Prompt (verbatim): "Ad IpaCut: none is right. Ad IpaSlashContext: Q1, Q4, Q5, Q6 are correct for ap, mat, uk. All QX are correct for sy and xy."

Note (not a user prompt): implemented 2026-10-04: `ap_Q4_t1.mp3`, `mat_Q4_t1.mp3`, `uk_Q4_t1.mp3` installed as byte copies over `assets/audio/syllables/{ap,mat,uk}.mp3` (LetterTraining only; the LetterPexeso app has no syllable files). Q4 request: text `"<syl>,"`, previous_text `"/"`, next_text `"/ jako ve slově <carrier>"`, model eleven_v4, language_code cs. sy and xy stay as the installed V2 slash-IPA files. Q4-recipe samples for the other suspects (hvěz, naut, nec, min, qe, rov, tec, svíč, špend) are in `ListenSamples/Q4Suspects` (not installed). Scripts: `q4_install_and_suspects.py`, `gen_audio_texts.py`.

Prompt (verbatim, feedback on the Q4Suspects trial): "Ad Q4Suspects: all are pronounced correctly"

Note (not a user prompt): implemented 2026-10-04: `<f>_Q4_t1.mp3` for hvěz, naut, nec, min, qe, rov, tec, svíč, špend (`hvexz`, `naut`, `nec`, `min`, `qe`, `rov`, `tec`, `sviicx`, `sxpend`) from `ListenSamples/Q4Suspects` installed as byte copies over `assets/audio/syllables/<f>.mp3` (LetterTraining only; LetterPexeso has no syllable files). Q4 recipe as above (rendered text = IPA/Czech letters followed by a comma, previous_text `"/"`, next_text `"/ jako ve slově <carrier>"`). Scripts: `q4_install_suspects.py`, `gen_audio_texts.py`.

Agent note (not a user prompt, record correction 2026-10-04): (1) the 11 syllables pe, to, a, ho, ki, hi, ché (file chee), qu, nú (nuu), ďu (dxu), ut are NOT plain regenerations but byte copies of the user-approved `ListenSamples/NoPrevious/<item>_N1_noprev_period_take2.mp3` trial files (same plain recipe: text `"<syl>."` + next_text, no previous_text; the user chose these takes); LetterPexeso has no syllable files, the syllables belong to LetterTraining. (2) The letter name ú (file uu.mp3) was regenerated with text `"ú s čárkou."` + previous_text `"Písmeno:"` (ú revert at the user's request).

### QuCandidates listening feedback: qu = "kvu" (follow-up, 2026-10-04)

Context: after listening to `ListenSamples/QuCandidates/` (15 request variants x 2 takes of qu candidates + old qu files), the user answered:

User feedback (verbatim): "Ad QuCandidates: ku both correct; kv: only kv_Q4_kviz_t2.mp3 is fully correct (kv_Q4_kviz_t1.mp3 is not correct; the three kv_V2_nextquad_t1.mp3, kv_V2_nextquad_t2.mp3 and kv_V2_nocontext_t1.mp3 would have the sound right, but it is inside "lomítko" word); kvu: correct everywhere; old_00_INSTALLED_now_qu.mp3 is very incorrect (sounds like "g"); all old_ are incorrect."

Question: which sound should 'qu' have? User answer (verbatim): "kvu (correct everywhere)"

Question: wider fix? User answer (verbatim): "Fix qu, you check a random sample first"

Result: `LetterTraining/assets/audio/syllables/qu.mp3` = byte copy of `ListenSamples/QuCandidates/kvu_Q4_quad_t1.mp3` (Q4 recipe: text "kvu," + previous_text "/" + next_text "/ jako ve slově quad"); a random sample of installed plain-recipe syllables was prepared in `ListenSamples/RandomInstalled/` for the user to listen to.

Note: LetterPexeso has no syllable files; the qu change concerns LetterTraining only.

### RandomInstalled listening feedback and Q4 regeneration of all syllables (follow-up, 2026-10-04)

Context: after the "Fix qu, you check a random sample first" decision the master took a random sample (seed 20261004) of 40 installed plain-recipe syllable files (`ListenSamples/RandomInstalled/`) and the user listened to it; the user also commented on the earlier list of saa, butx, sxek, zxo, oz, uon and nen.

User feedback (verbatim, RandomInstalled): "Ad RandomInstalled: all correct except: eep__eep.mp3 says full "epizoda", had__had.mp3 says "hed" instead of correct czech "had", mra__mra.mp3 is with sigh and very feeble "mrh" sound, oos__oos.mp3 sounds like "ús" - not as correct "ós", qa__qa.mp3 is spelled separatelly and as in english ("kju: ei") - was there czech language specified? Or was the word used as example czech enough?, quu__quu.mp3 sounds like "ú", uum__uum.mp3 sounds like nasal "nnn". Everything else in RandomInstalled is correct."

User feedback (verbatim, follow-up): "Ad "saa, butx, sxek, zxo, oz, uon and ne": the saa, butx, sxek, zxo: all are correct in Q4Historical folder; oz is correct in folder RandomInstalled (I did not find it anywhere else); I cannot find uon and nen anywhere in ListenSamples."

Earlier agreement (see the previous section): answer 'Fix qu, you check a random sample first': "If you find problems there, we regenerate everything with Q4".

Result (agent note, not a user prompt): 7 of 40 plain-recipe files were wrong, so all syllables of SYLLABLE_AUDIO (829) were regenerated with recipe Q4 (text `"<syl>,"`, previous_text `"/"`, next_text `"/ jako ve slově <carrier>"`, eleven_v4, language_code cs, raw) EXCEPT the keep-set: the 33 sampled files the user confirmed correct, the 10 approved take2 files, qu, the 16 vowel-less ones, the 7 slash-IPA V2 ones, the 12 approved Q4 ones, and the 7 wrong ones (eep, had, mra, oos, qa, quu, uum; variants made by another job, current files untouched). `language_code` cs was sent in every request (it is in the request body of `q4_historical.py`, `q4_install_suspects.py` and this run). Details: task folder `AGENTS/Tasks/20261004_063630_RegenerateLetterAppsSoundsElevenLabs/` (`q4_regen_results.json`, `q4_regen_install_manifest.json`, `ListenSamples/RandomInstalled2/`).

### SevenWrong listening feedback and installed takes (follow-up, 2026-10-04)

Context: the user listened to `AGENTS/Tasks/20261004_063630_RegenerateLetterAppsSoundsElevenLabs/ListenSamples/SevenWrong` (variants A-D per syllable, qa also E-H; A = Czech letters + original carrier, B = IPA letters + original carrier, C = Czech letters + new Czech carrier, D = IPA letters + new Czech carrier).

User feedback (verbatim): "Ad SevenWrong: eep: all correct; had: A is almost correct, but sounds more like with english accent, had in B,C,D is fully correct; mra: correct everywhere; oos: correct everywhere; qa: A,C,E-H not correct (sounds like "ka"), B and D correct; quu: A,C not correct (sounds like "ků"), B and D correct; úm: correct everywhere".

Result (agent note, not a user prompt): per syllable one user-approved take was installed as a byte copy, chosen by measurement (cleanest among the approved variants): eep = eep_D_era_t2, had = had_D_hadice_t2, mra = mra_D_mrak_t2, oos = oos_A_oda_t2, qa = qa_D_Katar_t2, quu = quu_B_quad_t2 (1.12 s, the only B/D takes with a trailing silence >= 0.1 s are longer than 1.0 s), uum = uum_B_umysl_t1. Texts/carriers are in `assets/audio/audio_texts.md` (EXCEPTION 5); `scripts/seven_wrong_install.py`, `seven_wrong_install_report.json` in the task folder.

### KveXu listening feedback, installed takes, gong/loud status (follow-up, 2026-10-04)

Context: the user listened to `AGENTS/Tasks/20261004_063630_RegenerateLetterAppsSoundsElevenLabs/ListenSamples/KveXu` (kvě variants A0-A3 = Czech letters "kvě" with carriers květina/květák/květ/kvést, B1-B2 = IPA kvjɛ with carriers květen/květina, C1 = Czech letters "kve" with carrier květák; xú variants I1-I3 = IPA ksuː with carriers boxů/luxus/Xu, G1 = IPA ɡzuː, R0 = Czech letters "xú"; Q4 recipe: previous_text "/", next_text "/ jako ve slově <carrier>").

User feedback (verbatim): "Ad KveXu folder: kve: all A0-A3 are saying "květen", all B1-B2 correct "kvě" (if it should have been softened), both C1 are saying "kve"; xuu is correct in I1-I3 (pronounced as "ksú", everywhere else incorrect)".

Result (agent note, not a user prompt): kvex.mp3 = byte copy of kve_B1_kveten_t2.mp3 (text "kvjɛ,", carrier květen; 0.72 s, one voiced segment 0.50 s, trailing silence 0.19 s, last-10ms level -81.6 dB; B1 t1 is flagged cut-off, B2 takes were 0.64 s with 0.11-0.13 s trailing silence; B1 t2 has the most trailing margin), xuu.mp3 = byte copy of xuu_I1_boxu_t2.mp3 (text "ksuː,", carrier boxů; 1.12 s, one segment 0.61 s, trailing silence 0.47 s, the shortest tail and the loudest peak -4.8 dBFS among I1-I3; all I takes are >1.0 s only because of trailing silence). gong.mp3 and loud.mp3 keep the files of the first ElevenLabs regeneration (the Q4 takes were unusable: gong best take 0.16 s near silent, loud four takes of 0.08 s); variants for the user to pick (2 takes each, not installed) are in `ListenSamples/GongLoud/`. Texts/carriers in `assets/audio/audio_texts.md` (EXCEPTION 6, 7); `scripts/kvex_xuu_install.py`, `kvex_xuu_install_report.json`, `scripts/gong_loud.py` in the task folder.
