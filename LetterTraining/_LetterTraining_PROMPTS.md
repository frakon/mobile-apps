# LetterTraining — user prompts and Q&A (verbatim)

## Initial request (2026-10-01)

Create a new expo go application: LetterTraining.
Its purpose will be to train letters by tasks/games of different levels: from simple to more complex ones.
It shall train czech alphabet and be in czech.
It shall have a disambigulation intro page where we choose the task/quest/game/training.
Also: every data which are needed in the next rounds of current training shall be pre-fetched 2 rounds in advance (this shall work the same as in TreninkPorozumeni app).
The trainings to implement (there will be more of them, initially just the following):
* Pexeso: the same game as is already implemented in LetterPexeso shall be nested under this app
* Word starts training:
   * General notes: 
      * every play will have 10 rounds, then results page will be shown with offer to play again or to go to the disambigulation intro page
      * every picture shall be created using image-generation skill and follow the blind testing rules and other rules used in TreninkPorozumeni app (explore the rules there and print them into .md file in this app (for me to review)) 
      * the behaviour when correct or wrong answer is selected shall be the same as in the TreninkPorozumeni app: for correct answer the image/letter gets slighly green and a green checkmark shows for 0.5 second and then the next round show. If wrong answer is selected: the option gets reddish and a very brief sound/speech explaining why it is wrong answer shall be played
      * prepare pictures for at least 500 words
   * Level 1 (variant 1):  picture expressing a word will be shown and a sound/speech with the word will be played (next to the picture will be also a button for "play" or "play again": which will replay the word). Below the picture 3 letters will be shown. One of the letters will be the correct one on which the word begins and other letter options will be wrong options. If a wrong letter is pressed the sound with the letter name shall played (for child to learn which letter is the correct one; no more explanation is needed for the wrong answer). For the right answer also play the sound of the letter and go to the next round.
   * Level 2 (variant 2): The first syllable of the word on the picture are shown as options to choose from. The words on pictures are at least 2 syllable ones. The options to choose from shall be 4: 2 starting on the same letter as the word, other 2 starting on another one letter
   * Level 3 (variant 3): analogous to variant 2, but the word shall end on that syllable (not start with that).

## Q&A (2026-10-01)
- Q: mobile-apps2 is 6 commits behind origin; git pull? A: Yes, pull (Recommended)
- Q: Blind test strictness for 500+ images? A: Full 5+1 per image (5 fresh opus blind evaluators + 1 independent verifier per image, per image-generation skill picture-blind-test.md)
- Q: Voice? A: Same as TreninkPorozumeni (edge-tts cs-CZ-VlastaNeural, rate -10%, pre-generated bundled mp3)
- Q: L2/L3 wrong-tap sound? A: Say the tapped syllable (like Level 1)

## Follow-up prompt 1 (verbatim)
For the words of the Level 1,2,3: use words from the top 5000 most frequent czech words. Let them start with multiple different letters (so that every letter of Czech alphabet is trained). Among 500 words for every czech letter (even for the rare ones) there shall be at least 3 words starting on that letter.

## Q&A 2 (verbatim answers)
- Q: Top-5000 vs 500 words? A: "Create for sure 500 word pictures. Prefer children's-vocabulary list, and then relax to 20-30k frequency limit. For letter "Y" you do not have to create words beginning with that (there is almost no czech word with that), but for sure create words that have Y in the first syllable (so that the children train it too: the letter is not completely omitted). Decrease the blind test to 3 opus subagents (from 5; for this task it is enough). The letters X and Q and W can have also very few occurances ... they are almost not used in czech. But try to use them at least in some words. The F,G letters may have less occurances than the other letters (e.g. half of the occurances). The rest of czech letters shall be represented evenly: the words shall start on them in equal counts."
- Q: Letters with <3 words in Level 1? A: Only wrong options (Recommended) — never the correct answer, still shown as wrong options.
## Follow-up prompt 2 (verbatim)
Ad syllable splits: do it according to czech split rules: instead of "ko-čka" do the splits like koč-ka, liš-ka, kos-tel, mýd-lo, roh-lík. Always use the correct czech grammar and rules (do not default to english rules: we are teaching czech and must keep its rules properly; if unsure: launch exploration with web permission to find out correct official language rules).
Ad the pictures that can be confused: e.g. "pero" or "propiska" is a fine picture for the first letter: because the both words have the same letter P. The important part is that the answer is clear (not ambigous). But the picture with "propiska" or "pero" would not be possible to use for the first and last syllable excercise, because the syllables already differ (though the first letter is the same)

## Q&A 3 (pilot)
- Q: Ambiguity fail rule? A: Per-level rule (Recommended): fail only if >=2 evaluators raise the same plausible alternative AND it changes the answer for that level (first letter L1; first/last syllable L2/L3), or a concrete defect is reported; otherwise record in alternativeNames.
- Q: xylofon (only X word) failed 3 rounds on fixable defects? A: "Allow 3 extra rounds and then take the picture which have had the best performance in tests (even despite it maybe did not fulfil the requirements fully)"

## Follow-up prompt 3 (verbatim)
For syllable variants (variant 2 and variant 3): try to record different mp3s: for first syllable record .mp3 where the first syllable will be emphasized (so that child hears what is important: KOČ-ka, JA-blko ...). For the excercise with the last syllable: try to create .mp3 with the last syllable emphasized: koč-KA.

## Code references (real dataset, 2026-10-01)
- "## Follow-up prompt 3 (verbatim)": `src/wordStarts/logic.ts` `roundWordAudio` (L2 first-emphasized, L3 last-emphasized, L1 plain), `collectRoundAssetModules` (prefetch of the audio actually played), `app/words.tsx` `playWord`, `src/wordStarts/types.ts` `audioFirst`/`audioLast`, generator `endgame2/AGENTS/Tasks/20261001_090718_LetterTraining/scripts/gen_words_ts.py`.
- "## Q&A 2 (verbatim answers)" (letters with < 3 words only wrong options) and "## Follow-up prompt 2 (verbatim)" / "## Q&A 3 (pilot)" (per-level exclusion): `src/wordStarts/logic.ts` `eligibleWords`, `correctAnswer` (dataset `firstLetter`).
- "## Initial request (2026-10-01)" Level 2/3 (2 options on the word's/syllable's first letter, 2 on one other letter): `src/wordStarts/logic.ts` `buildSyllableOptions` (real dataset syllables preferred, never an option equal to the correct one).
- Tests: `src/wordStarts/__tests__/logic.test.ts`, `src/wordStarts/__tests__/dataset.test.ts`.

## Follow-up prompt 4 — new game "Skládání slov" (verbatim)
Meanwhile implement another game/excercise/training called "Skládání slov". It shall have its own "game" option on disambigulation screen, but it is similar to the previous excercise "První písmenko/první slabika/poslední slabika":
* a picture is shown and speech says its name (the same as in the "první písmenko" excercise)
* all letters of the words are below the picture, but in shuffled order
* below the letters there are decent "boxes" or frames: one for each letter.
* the goal of the child is to drag a letter to its proper box: it shall put together the whole word
* from the letter on which the word begins to its first box (the first box in row; the first letter of the word may not be first in the line of letter, because they are shuffled) shall be displayed a decent arrow. This arrow shall disappear after the first-letter-of-the-word is dragged to its correct box/frame. Other letters shall not have arrows.
* every letter that is dragged (no matter how much it was dragged or whether it ended up correct or wrong: shall be pronounced)
* when the letter is placed to the correct location: it stays in the box. We count as correctly placed when the placeholder box and the dragged letter with surrounding moving box have any intersection (WHY: to accept also imprecise shifts; we do not want a child to stop using its app because it is unfriendly: that it returns back the letter when it does not fit perfectly)
* when the letter box intersects the right placeholder box and child releases it: the logic centers the letter to the placeholder box and leaves it there
* when the letter box is relased by the child and it does not intersect its right box: move it back to its original location by sliding animation which shall last 0.5 seconds
* if some word contains two same letters (like "k" in "kočka"), make the same letters interchangeable (that even the "k" from which the arrow points to the first placeholder box can be used in the fourth placeholder box)
* at the end when the word is correctly composed (every letter is in its correct placeholder box): show a green checkmark next to the composed word for 0.5 seconds and go to the next round (next word).

There shall be also another variant of this game available: the variant with syllables: that syllables are dragged to the correct location (to correct placeholder box).

Evaluate this new game by a fresh subagent and let him ask through you repeated clarification questions if needed

## Q&A 4 — Skládání slov round 1
- Q: Letter audio on drag? A: Letter name (Recommended) — same as Level 1 ("bé", "chá", "dlouhé á"), existing audio.
- Q: Word length (letter variant)? A: 3–8 letters, portrait (Recommended) — one row; longer words only in the syllable variant.
- Q: Rounds/scoring? A: 10 rounds + results (Recommended) — "Správně: X/10", round correct only if no wrong drop.
- Q: When spoken? A: At drag start (Recommended) — once when picked up.

## Q&A 5 — Skládání slov round 2
- Q: Tiles lowercase or uppercase? A: "Chooseable in settings of the game (CAPITALS, lower_case)"
- Q: Next round after completed word? A: 500 ms or sound end (Recommended) — whichever later, same as Začátky slov.
- Evaluator defaults (not objected): straight arrow with arrowhead; both variants play plain word audio; syllable variant uses 2–5 syllable words, skipping disputed splits (e.g. ob-raz); duplicate letters/syllables interchangeable, tile overlapping two eligible boxes goes to the one with larger overlap.

## Code references (Skládání slov, 2026-10-01)
- "## Follow-up prompt 4 — new game "Skládání slov" (verbatim)": `app/compose.tsx` (screen, drag & drop, arrow, ✓), `src/compose/logic.ts` (tiles, eligibility, `resolveDrop`, layout, scoring), `src/trainings.ts` (two intro entries), `app/_layout.tsx` (GestureHandlerRootView).
- "## Q&A 4 — Skládání slov round 1": `src/compose/logic.ts` (3–8 letter tiles, `tileAudio` letter names, 10 rounds, `recordWrongDrop`/`completeRound`), `app/compose.tsx` `handleDragStart`.
- "## Q&A 5 — Skládání slov round 2": `src/compose/settings.ts` + `app/compose-settings.tsx` (tile case), `app/compose.tsx` `startCompletion` (max(500 ms, sound end)); evaluator defaults in `src/compose/logic.ts` `composeEligibleWords`, `resolveDrop`.
- Tests: `src/compose/__tests__/logic.test.ts`.

## Follow-up prompt 5 — new game "Abecedový vlak" (verbatim)
Add yet another excercise/game: "Abecedový vlak" (it shall be again listed on the disambigulation page):
* the whole point of this excercise is to connect the letters alphabetically. Every letter sits inside its wagon and shall be dragged in the right order behind the previous letter (the letter 'A' shall be dragged right after the train machine, because there is no letter yet to come after that)
* at the beginning there is a train machine (the train vehicle with engine: displayed as steam engine train machine vehicle) and below it are displayed 4-8 wagons with the next letters: randomly shuffled. Everytime a letter is dragged: its name is pronounced. 
* In settings of this game there shall be two alphabets to choose from: Czech alphabet (with "háčky", but without "čárky" or "kroužky") and the English alphabet, default is czech. They shall be displayed with czech flag and english flag. In settings there shall be also an option whether to show capitals or lower letters.
* when a correct letter is dragged right behind the previous (and it again does not have to be precise: even touch of the correct train wagon (with the correct letter) and releasing it places the correct wagon behind the previous wagon letter
* wrong letter (not in order) is possible to be dragged but when released it returns to its original position
* the wagons with letters are slightly floating: slowly moving left and right and up and down a few pixels randomly
* when a wagon was placed correctly, two things will happen:
    * the train moves by distance of 1 wagon to the left (the wagons at the beginning and the train engine will get out of sight). The move is continuous and lasts from 90% 1 second: it quickly accelerates then slows down and the last 10% of the way it goes the next 10 seconds, unless another letter (another correct wagon) was added to the end: in that case it would again quite quickly but with continuous acceleration and deceleration go its 90% of the distance in 1 second and then slowly keep moving for the rest of 10 seconds to the proper position.
    * a new train wagon with the next letter appears in random position among the other wagons: they quickly (but again continuously: keep in mind that every move in this game is continuous: with continuous acceleration and deceleration) make space for the new wagon/letter and the new wagon letter appears there by growing effect: it will quickly grow from a point in the place from which other nearby wagons retreated.
* at the very end, when the last letter was placed, the train goes off the screen in 1 last second.
* create the images of the train engine and of its wagons nicely by image-generation skill, let them be again children illustraions, create 10 different train engines and 10 different wagon pictures specifically for this excercise by ai image generator. The wagons shall not be long: they shall have sides in ratio of about 3:2 (3: length, 2: height), the train engine can be larger with various length ratio (from 3:2 to 3:1).

Record the instructions to the prompts file and pass them to a fresh subagent to examine them and to suggest repeated clarification questions

## Q&A 6 — Abecedový vlak round 1
- Q: Alphabet letters + English audio? A: 35 letters + EN voice (Recommended): A B C Č D Ď E F G H CH I J K L M N Ň O P Q R Ř S Š T Ť U V W X Y Z Ž (no Ě, no čárka/kroužek letters); 26 new English letter-name recordings with an English voice.
- Q: Play length / waiting wagons? A: Setting 4–8 — whole alphabet per play; number of waiting wagons chosen in settings (4–8).
- Q: Layout? A: Landscape, big drop zone (Recommended): train across top, its end ~60% of width; waiting wagons in one row below; placed if released over a large zone around the train's end.
- Q: End? A: Hotovo screen (Recommended): train leaves in 1 s, then "Hotovo" with "Znovu"/"Zpět"; wrong attempts not counted.

## Q&A 7 — Abecedový vlak round 2
- Q: Default waiting wagons? A: 6, remembered (Recommended).
- Q: When spoken? A: At drag start (Recommended) — also on tap of a waiting wagon.
- Q: Wrong drop? A: "Slide back + train wiggle. The train shakes slightly. WHY not the soft sound: because the sound/speech of the letter shall not be interupted by "nope" sound."
- Q: Flags/images? A: "Drawn flags + auto cut-out. Small drawn CZ/UK flags (emoji flags don't show on some Android devices). White background removed automatically, images trimmed, wheel heights aligned." (Note: user omitted the "2 samples shown before generating all 20" part of the option — no approval stop needed.)

## Code references (Abecedový vlak, 2026-10-01)
- `app/train.tsx` (game screen), `app/train-settings.tsx` (settings), `src/train/logic.ts` (alphabets, pool sequence,
  insertion, drop zone), `src/train/motion.ts` (shift easing + retarget), `src/train/settings.ts`, `src/train/Flags.tsx`,
  `src/train/Vehicles.tsx`, generated `src/train/assets.ts` (by `endgame2/AGENTS/Tasks/20261001_090718_LetterTraining/scripts/gen_train_ts.py`).
- Note: Q&A 6 says "35 letters" but its explicit list has 34 letters; the explicit list is implemented.

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
