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
