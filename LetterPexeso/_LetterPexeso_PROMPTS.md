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
