# TreninkPorozumeni — game specification

Czech listening-comprehension training app for children (Expo / React Native, iPad-first landscape-friendly, iPhone-capable).

## Game 1 — "two pictures, one sentence"

- Each round shows two selectable pictures side by side; a Czech sentence audio plays automatically when the round starts; a replay icon button replays it.
- Exactly one picture matches the sentence.
- Wrong picture tapped: slight red tint for 500 ms; the round continues until the correct picture is tapped. The round is scored wrong on the first mistake.
- Correct picture tapped: slight green tint + green checkmark overlay for 500 ms, then the next round.
- The correct picture's position (left/right) is randomized each round.

## Rounds

- 11 items, each with sentence variant A and variant B (role-swapped / minimal pair).
- Shuffled pass A (each item once, random variant), then shuffled pass B with the opposite variants → 22 rounds.
- End of run: score screen (Správně / Špatně counts) with a restart button that reshuffles.

## Items (id / sentence A / sentence B)

1. `kosa` / „Jel s kosou." / „Jel s kozou."
2. `honi` / „Bratr honí sestru." / „Sestra honí bratra."
3. `tlaci` / „Medvěd tlačí lva." / „Lev tlačí medvěda."
4. `vysetruje` / „Doktor vyšetřuje pacienta." / „Pacient vyšetřuje doktora."
5. `cese` / „Holčička češe maminku." / „Maminka češe holčičku."
6. `preskakuje` / „Kůň přeskakuje krávu." / „Kráva přeskakuje koně."
7. `fotografuje` / „Kluk fotografuje dědečka." / „Dědeček fotografuje kluka."
8. `skrabe` / „Kočka škrábe psa." / „Pes škrábe kočku."
9. `vede` / „Policista vede zloděje." / „Zloděj vede policistu."
10. `zachranuje` / „Princ zachraňuje princeznu." / „Princezna zachraňuje prince."
11. `chvali` / „Učitel chválí žáka." / „Žák chválí učitele."

## Assets (strict naming contract)

- Audio: `assets/audio/<id>_a.mp3`, `assets/audio/<id>_b.mp3` (Edge TTS, cs-CZ neural voice).
- Images: `assets/images/<id>_a.png`, `assets/images/<id>_b.png` — image `<id>_a` depicts sentence A literally, `<id>_b` the reversed sentence. Children-friendly painted fairy-tale-book style, only the described situation, no background/extras.
- Correct image for variant A is `<id>_a`; for variant B it is `<id>_b`.

## Technical notes

- Audio library: `expo-audio` (current Expo SDK recommendation; `expo-av` is deprecated).
- Data model: `src/items.ts` (static `require()` asset references), round plan in `src/rounds.ts`.
