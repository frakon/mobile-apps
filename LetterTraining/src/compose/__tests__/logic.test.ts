// Unit tests of the pure "Skládání slov" logic - `_LetterTraining_PROMPTS.md` /
// "## Follow-up prompt 4 — new game "Skládání slov" (verbatim)", "## Q&A 4 — Skládání slov round 1",
// "## Q&A 5 — Skládání slov round 2", "## Follow-up prompt 11" / "## Q&A 11" (tap-to-place).
import { LETTER_AUDIO, REAL_SYLLABLES, SYLLABLE_AUDIO, WORDS } from '../../words';
import { WordEntry, WordStartsDataset } from '../../wordStarts/types';
import {
  COMPOSE_ROUNDS_PER_PLAY,
  ComposeRound,
  INITIAL_COMPOSE_PROGRESS,
  buildComposePlan,
  buildComposeRound,
  collectComposeArchives,
  collectComposePreloadArchives,
  completeRound,
  composeEligibleWords,
  arrowSourceTileId,
  computeLayout,
  eligibleSlots,
  intersectionArea,
  isWordComplete,
  NO_COMPOSE_SHADES,
  composeSelectionOutcome,
  composeShadesAfterPlacement,
  composeShadesAfterWrongSelection,
  correctTileId,
  firstEmptySlotIndex,
  recordWrongDrop,
  resolveDrop,
  scaleRectangle,
  shuffleTiles,
  slotValues,
  splitLetters,
  tileAudioResource,
  tileLabel,
} from '../logic';

function word(id: string, text: string, syllables: string[], extra: Partial<WordEntry> = {}): WordEntry {
  return {
    id,
    word: text,
    syllables,
    firstLetter: text[0],
    alternativeNames: [],
    excludeLevel1: false,
    excludeLevel2: false,
    excludeLevel3: false,
    ...extra,
  };
}

// Deterministic pseudo-random source.
function seeded(seed: number): () => number {
  let state = seed;
  return () => {
    state = (state * 1103515245 + 12345) % 2147483648;
    return state / 2147483648;
  };
}

const KOCKA = word('kocka', 'kočka', ['koč', 'ka']);
const CHALUPA = word('chalupa', 'chalupa', ['cha', 'lu', 'pa']);

// A round with a fixed tiles order (for drop tests).
function fixedRound(target: WordEntry, tileValues: string[]): ComposeRound {
  const slots = slotValues(target, 'letters');
  const tiles = tileValues.map((value, id) => ({ id, value }));
  return { variant: 'letters', word: target, slots, tiles, arrowTileId: tiles.find((tile) => tile.value === slots[0])!.id };
}

describe('tiles', () => {
  test('ch is one letter tile, diacritics kept', () => {
    expect(splitLetters('chalupa')).toEqual(['ch', 'a', 'l', 'u', 'p', 'a']);
    expect(splitLetters('kočka')).toEqual(['k', 'o', 'č', 'k', 'a']);
    expect(splitLetters('Střecha')).toEqual(['s', 't', 'ř', 'e', 'ch', 'a']);
    expect(slotValues(CHALUPA, 'syllables')).toEqual(['cha', 'lu', 'pa']);
  });

  test('shuffle keeps the multiset and differs from the word order', () => {
    const values = splitLetters('kočka');
    for (let seed = 1; seed < 50; seed++) {
      const result = shuffleTiles(values, seeded(seed));
      expect([...result].sort()).toEqual([...values].sort());
      expect(result).not.toEqual(values);
    }
    // Always-identity random -> fallback rotation still differs.
    expect(shuffleTiles(['a', 'b'], () => 0.999)).toEqual(['b', 'a']);
    expect(shuffleTiles(['a', 'a'])).toEqual(['a', 'a']);
  });

  test('round: tiles ids are positions, arrow tile carries the first value', () => {
    const round = buildComposeRound(KOCKA, 'letters', seeded(3));
    round.tiles.forEach((tile, index) => expect(tile.id).toBe(index));
    expect(round.tiles[round.arrowTileId].value).toBe('k');
    const syllableRound = buildComposeRound(CHALUPA, 'syllables', seeded(3));
    expect(syllableRound.tiles[syllableRound.arrowTileId].value).toBe('cha');
  });

  test('tile case CAPITALS / lower_case (Q&A 5)', () => {
    expect(tileLabel('ch', 'upper')).toBe('CH');
    expect(tileLabel('koč', 'upper')).toBe('KOČ');
    expect(tileLabel('ř', 'lower')).toBe('ř');
  });
});

describe('eligible words', () => {
  const words = [
    word('pes', 'pes', ['pes']),
    word('les', 'le', ['le']), // 2 letters -> too short
    KOCKA,
    CHALUPA,
    word('lokomotiva', 'lokomotiva', ['lo', 'ko', 'mo', 'ti', 'va']), // 10 letters, 5 syllables
    word('obraz', 'obraz', ['ob', 'raz'], { excludeLevel2: true }),
    word('chameleonek', 'chameleonek', ['cha', 'me', 'le', 'o', 'nek', 'x']),
  ];

  test('letters: 3-8 tiles (ch counts once)', () => {
    const ids = composeEligibleWords(words, 'letters').map((entry) => entry.id);
    expect(ids).toEqual(['pes', 'kocka', 'chalupa', 'obraz']);
    expect(composeEligibleWords([word('chchch', 'chchchch', ['x'])], 'letters')).toHaveLength(1); // 4 tiles
  });

  test('syllables: 2-5 syllables spelling the word, disputed splits skipped', () => {
    const ids = composeEligibleWords(words, 'syllables').map((entry) => entry.id);
    expect(ids).toEqual(['kocka', 'chalupa', 'lokomotiva']);
  });

  test('plan has 10 rounds, no immediate repeats, empty pool -> []', () => {
    const plan = buildComposePlan([KOCKA, CHALUPA], 'letters', seeded(7));
    expect(plan).toHaveLength(COMPOSE_ROUNDS_PER_PLAY);
    for (let index = 1; index < plan.length; index++) {
      expect(plan[index].word.id).not.toBe(plan[index - 1].word.id);
    }
    expect(buildComposePlan([word('pes', 'pes', ['pes'])], 'syllables')).toEqual([]);
  });
});

describe('drop resolution', () => {
  const box = (x: number) => ({ x, y: 100, width: 50, height: 50 });
  const slotRectangles = [0, 60, 120, 180, 240].map(box);
  // kočka: slots k o č k a; tiles row: a k č o k
  const round = fixedRound(KOCKA, ['a', 'k', 'č', 'o', 'k']);
  const empty = [null, null, null, null, null];

  test('intersection area, touching edges are no intersection', () => {
    expect(intersectionArea({ x: 0, y: 0, width: 10, height: 10 }, { x: 5, y: 5, width: 10, height: 10 })).toBe(25);
    expect(intersectionArea({ x: 0, y: 0, width: 10, height: 10 }, { x: 10, y: 0, width: 10, height: 10 })).toBe(0);
  });

  test('eligible = empty boxes with the same value (duplicates interchangeable)', () => {
    expect(eligibleSlots(round, empty, 1)).toEqual([0, 3]);
    expect(eligibleSlots(round, empty, 4)).toEqual([0, 3]);
    expect(eligibleSlots(round, [1, null, null, null, null], 4)).toEqual([3]);
    expect(eligibleSlots(round, empty, 0)).toEqual([4]);
  });

  test('any small intersection with an eligible box snaps', () => {
    expect(resolveDrop(round, empty, 3, { x: 105, y: 145, width: 50, height: 50 }, slotRectangles)).toBe(1); // 5 px corner
  });

  test('no intersection or wrong box -> null', () => {
    expect(resolveDrop(round, empty, 3, { x: 0, y: 0, width: 50, height: 50 }, slotRectangles)).toBeNull();
    expect(resolveDrop(round, empty, 3, { x: 120, y: 100, width: 50, height: 50 }, slotRectangles)).toBeNull(); // on "č"
  });

  test('the arrow "k" may go to the fourth box; filled box ignored', () => {
    expect(resolveDrop(round, empty, round.arrowTileId, box(180), slotRectangles)).toBe(3);
    expect(resolveDrop(round, [null, null, null, 1, null], 4, box(180), slotRectangles)).toBeNull();
  });

  test('tile overlapping two eligible boxes: the first empty box wins (repair L1), otherwise the larger overlap', () => {
    const aa = fixedRound(word('aa', 'aaa', ['a']), ['a', 'a', 'a']);
    const rectangles = [0, 50, 100].map(box); // adjacent boxes
    // Overlaps first-empty box 0 (20) and box 1 (30): box 0 although its overlap is smaller (Q&A 11 refinement).
    expect(resolveDrop(aa, [null, null, null], 0, { x: 30, y: 100, width: 50, height: 50 }, rectangles)).toBe(0);
    expect(resolveDrop(aa, [null, null, null], 0, { x: 20, y: 100, width: 50, height: 50 }, rectangles)).toBe(0);
    // Box 0 filled -> first empty is box 1; a release over boxes 1 (20) and 2 (30) goes to box 1.
    expect(resolveDrop(aa, [1, null, null], 0, { x: 80, y: 100, width: 50, height: 50 }, rectangles)).toBe(1);
    // Neither overlapped box is the first empty one -> the larger overlap wins (box 0 empty, release over boxes 1 and 2).
    expect(resolveDrop(aa, [null, null, null], 0, { x: 80, y: 100, width: 50, height: 50 }, rectangles)).toBe(2); // 20 vs 30
    expect(resolveDrop(aa, [null, null, null], 0, { x: 70, y: 100, width: 50, height: 50 }, rectangles)).toBe(1); // 30 vs 20
  });

  test('completion', () => {
    expect(isWordComplete([0, 1, null])).toBe(false);
    expect(isWordComplete([0, 1, 2])).toBe(true);
    expect(isWordComplete([])).toBe(false);
  });
});

test('round archives: the word zip + syllable-group zips (letters variant: letter audio is bundled)', () => {
  const dataset: WordStartsDataset = {
    words: [KOCKA],
    letterAudio: { k: 1, o: 2, č: 3, a: 4 },
    syllableAudio: { koč: 'kocx.mp3', ka: 'ka.mp3' },
  };
  // Letters variant: tile sounds are bundled letter names -> only the word archive is needed.
  expect(collectComposeArchives(buildComposeRound(KOCKA, 'letters', seeded(1)), dataset)).toEqual(['words/kocka.zip']);
  expect(tileAudioResource('letters', 'k', dataset)).toEqual({ kind: 'bundled', module: 1 });
  // Syllables variant: the tiles' syllable-group zips are added (koč + ka both fold into the k group -> deduplicated).
  expect(collectComposeArchives(buildComposeRound(KOCKA, 'syllables', seeded(1)), dataset)).toEqual(['words/kocka.zip', 'syllables/k.zip']);
  expect(tileAudioResource('syllables', 'koč', dataset)).toEqual({ kind: 'archive', archivePath: 'syllables/k.zip', fileName: 'kocx.mp3' });
  expect(tileAudioResource('syllables', 'xx', dataset)).toBeUndefined();
});

test('preload window: current + next 5 rounds, deduplicated (5-round preload, Follow-up prompt 9)', () => {
  const dataset: WordStartsDataset = { words: [], letterAudio: {}, syllableAudio: {} };
  const plan = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'].map((letter) =>
    buildComposeRound(word(`w${letter}`, `${letter}ko`, [`${letter}ko`]), 'letters', seeded(1))
  );
  expect(collectComposePreloadArchives(plan, 0, dataset)).toEqual(['wa', 'wb', 'wc', 'wd', 'we', 'wf'].map((id) => `words/${id}.zip`));
  expect(collectComposePreloadArchives(plan, 3, dataset)).toEqual(['wd', 'we', 'wf', 'wg', 'wh'].map((id) => `words/${id}.zip`));
});

describe('scoring and layout', () => {
  test('round correct only without a wrong drop (Q&A 4)', () => {
    let progress = completeRound(INITIAL_COMPOSE_PROGRESS);
    expect(progress).toEqual({ roundIndex: 1, wrongDropInRound: false, correctRounds: 1 });
    progress = completeRound(recordWrongDrop(progress));
    expect(progress).toEqual({ roundIndex: 2, wrongDropInRound: false, correctRounds: 1 });
  });

  test('layout fits 8 letter tiles into a 343 pt wide portrait board', () => {
    const layout = computeLayout(343, 8, 'letters');
    expect(layout.columnX[7] + layout.tileWidth).toBeLessThanOrEqual(343);
    expect(layout.tileWidth).toBeGreaterThan(30);
    expect(layout.slotsRowY).toBeGreaterThan(layout.tilesRowY + layout.tileHeight);
  });
});

describe('verification compose R1 fixes', () => {
  test('arrow source follows placements: first unplaced tile with box 1 value, null once box 1 is filled', () => {
    const round = fixedRound(KOCKA, ['a', 'k', 'o', 'č', 'k']); // slots k o č k a
    expect(arrowSourceTileId(round, [null, null, null, null, null])).toBe(1);
    expect(arrowSourceTileId(round, [null, null, null, 1, null])).toBe(4); // arrow k went to box 4
    expect(arrowSourceTileId(round, [4, null, null, null, null])).toBeNull();
  });

  test('checkmark sits in the empty arrow gap above the last box; no width reserved, boxes centred (R2 N1)', () => {
    for (const width of [296, 351, 406]) {
      for (const [count, variant] of [[3, 'letters'], [5, 'letters'], [7, 'letters'], [8, 'letters'], [2, 'syllables'], [5, 'syllables']] as const) {
        const layout = computeLayout(width, count, variant);
        const rowEnd = layout.columnX[count - 1] + layout.tileWidth;
        expect(layout.columnX[0]).toBeGreaterThanOrEqual(10);
        expect(rowEnd).toBeLessThanOrEqual(width - 10 + 1e-9);
        expect(Math.abs(layout.columnX[0] - (width - rowEnd))).toBeLessThan(1e-9); // centred
        // ✓ between the tiles row and the boxes row, horizontally over the last box, inside the board
        expect(layout.checkmarkY).toBeGreaterThanOrEqual(layout.tilesRowY + layout.tileHeight);
        expect(layout.checkmarkY + 44).toBeLessThanOrEqual(layout.slotsRowY);
        expect(layout.checkmarkX + 22).toBeGreaterThanOrEqual(layout.columnX[count - 1]);
        expect(layout.checkmarkX + 22).toBeLessThanOrEqual(rowEnd);
        expect(layout.checkmarkX + 44).toBeLessThanOrEqual(width);
        expect(layout.totalHeight).toBe(layout.slotsRowY + layout.tileHeight + 8);
      }
    }
  });

  test('tile width does not shrink with fewer letters (no ✓ reservation)', () => {
    for (const width of [296, 351]) {
      for (let count = 3; count < 8; count++) {
        expect(computeLayout(width, count, 'letters').tileWidth).toBeGreaterThanOrEqual(computeLayout(width, count + 1, 'letters').tileWidth);
      }
    }
  });

  test('arrow skips the tile being dragged: re-anchors to another matching tile or hides (R2 N4)', () => {
    const round = fixedRound(KOCKA, ['a', 'k', 'o', 'č', 'k']); // slots k o č k a
    expect(arrowSourceTileId(round, [null, null, null, null, null], 1)).toBe(4);
    expect(arrowSourceTileId(round, [null, null, null, 1, null], 4)).toBeNull();
    expect(arrowSourceTileId(round, [null, null, null, null, null], 0)).toBe(1);
  });

  test('scaled rectangle grows around its centre', () => {
    expect(scaleRectangle({ x: 10, y: 10, width: 100, height: 50 }, 2)).toEqual({ x: -40, y: -15, width: 200, height: 100 });
  });

  // The old "release mostly on own home spot is not a wrong drop" test was removed with isReleasedOnHome:
  // superseded by "## Q&A 11" "Wrong tap counts too".
});

// "## Follow-up prompt 11" / "## Q&A 11": tap-to-place, out-of-order direct drops, wrong taps, train-style shades.
describe('tap-to-place selection (Follow-up prompt 11)', () => {
  const MAMA = word('mama', 'mama', ['ma', 'ma']);
  const empty = [null, null, null, null];

  test('first empty box value placed by tap / release anywhere, duplicates interchangeable (MAMA)', () => {
    const round = fixedRound(MAMA, ['a', 'm', 'a', 'm']); // slots m a m a
    expect(composeSelectionOutcome(round, empty, 1, null, true)).toEqual({ kind: 'place', slotIndex: 0, directHit: false });
    expect(composeSelectionOutcome(round, empty, 3, null, true)).toEqual({ kind: 'place', slotIndex: 0, directHit: false });
    expect(composeSelectionOutcome(round, [3, null, null, null], 0, null, true)).toEqual({ kind: 'place', slotIndex: 1, directHit: false });
    expect(composeSelectionOutcome(round, [3, 0, null, null], 1, null, true)).toEqual({ kind: 'place', slotIndex: 2, directHit: false });
  });

  test('wrong tile tapped or released anywhere is a wrong selection', () => {
    const round = fixedRound(MAMA, ['a', 'm', 'a', 'm']);
    expect(composeSelectionOutcome(round, empty, 0, null, true)).toEqual({ kind: 'wrong' });
    expect(composeSelectionOutcome(round, [1, null, null, null], 3, null, true)).toEqual({ kind: 'wrong' });
  });

  test('precise direct drop onto a matching LATER empty box fills that box (Keep out-of-order direct drops)', () => {
    const round = fixedRound(KOCKA, ['a', 'k', 'o', 'č', 'k']); // slots k o č k a
    const filled = [null, null, null, null, null];
    // 'a' directly onto box 4 (later box) - placed there, not wrong.
    expect(composeSelectionOutcome(round, filled, 0, 4, true)).toEqual({ kind: 'place', slotIndex: 4, directHit: true });
    // 'k' directly onto box 3 (later duplicate) stays in box 3.
    expect(composeSelectionOutcome(round, filled, 1, 3, true)).toEqual({ kind: 'place', slotIndex: 3, directHit: true });
    // A non-eligible direct-hit slot is ignored as a hit: 'a' onto box 1 ('o') -> wrong.
    expect(composeSelectionOutcome(round, filled, 0, 1, true)).toEqual({ kind: 'wrong' });
  });

  test('ignored when inactive, already placed or word complete', () => {
    const round = fixedRound(MAMA, ['a', 'm', 'a', 'm']);
    expect(composeSelectionOutcome(round, empty, 1, null, false)).toEqual({ kind: 'ignored' });
    expect(composeSelectionOutcome(round, [1, null, null, null], 1, null, true)).toEqual({ kind: 'ignored' });
    expect(composeSelectionOutcome(round, [1, 0, 3, 2], 1, null, true)).toEqual({ kind: 'ignored' });
    expect(firstEmptySlotIndex([1, 0, 3, 2])).toBeNull();
    expect(firstEmptySlotIndex([1, null, 3, null])).toBe(1);
  });

  // The screen wiring (wrong outcome -> recordWrongDrop) is pinned in composeScreenWiring.test.ts (repair test gap a).

  test('resolveDrop + composeSelectionOutcome end-to-end with constructed rectangles (repair L1)', () => {
    const box = (x: number) => ({ x, y: 100, width: 50, height: 50 });
    const rectangles = [0, 50, 100, 150].map(box); // adjacent boxes: A N N A
    const anna = fixedRound(word('anna', 'anna', ['an', 'na']), ['n', 'a', 'n', 'a']); // slots a n n a
    const release = (filled: readonly (number | null)[], tileId: number, x: number) =>
      composeSelectionOutcome(anna, filled, tileId, resolveDrop(anna, filled, tileId, { x, y: 100, width: 50, height: 50 }, rectangles), true);
    const none = [null, null, null, null];
    // 'n' sloppily over box 1 (first empty after A) and box 2: box 1.
    expect(release([1, null, null, null], 0, 80)).toEqual({ kind: 'place', slotIndex: 1, directHit: true });
    // 'n' precisely on box 2 only (box 1 not overlapped): out-of-order direct drop kept.
    expect(release([1, null, null, null], 0, 100)).toEqual({ kind: 'place', slotIndex: 2, directHit: true });
    // 'a' over box 0 (first empty) and nothing else: box 0; 'a' precisely on box 3: box 3.
    expect(release(none, 1, 10)).toEqual({ kind: 'place', slotIndex: 0, directHit: true });
    expect(release(none, 1, 150)).toEqual({ kind: 'place', slotIndex: 3, directHit: true });
    // 'n' released over box 0 ('a', not eligible) only: no direct hit and 'n' is not box 0's value -> wrong.
    expect(release(none, 0, 0)).toEqual({ kind: 'wrong' });
    // 'a' released far away -> auto-placed into the first empty box.
    expect(release(none, 3, 400)).toEqual({ kind: 'place', slotIndex: 0, directHit: false });
  });

  test('shades: wrong selection -> red serial + green on the correct tile; cleared on placement', () => {
    const round = fixedRound(KOCKA, ['a', 'k', 'o', 'č', 'k']); // slots k o č k a
    const filled = [null, null, null, null, null];
    expect(correctTileId(round, filled)).toBe(1);
    let shades = composeShadesAfterWrongSelection(NO_COMPOSE_SHADES, 0, round, filled);
    expect(shades).toEqual({ green: 1, red: { tileId: 0, serial: 1 } });
    shades = composeShadesAfterWrongSelection(shades, 0, round, filled);
    expect(shades.red).toEqual({ tileId: 0, serial: 2 });
    // Out-of-order direct drop of 'a' (tile 0) into box 4: red of tile 0 cleared, green on tile 1 stays (still correct).
    const afterDirect = [null, null, null, null, 0];
    shades = composeShadesAfterPlacement(shades, 0, round, afterDirect);
    expect(shades).toEqual({ green: 1, red: null });
    // The green tile placed -> green cleared.
    expect(composeShadesAfterPlacement(shades, 1, round, [1, null, null, null, 0])).toEqual(NO_COMPOSE_SHADES);
  });

  test('shades: a duplicate filling the first box clears the green of the other duplicate (MAMA)', () => {
    const round = fixedRound(MAMA, ['a', 'm', 'a', 'm']); // slots m a m a
    const shades = composeShadesAfterWrongSelection(NO_COMPOSE_SHADES, 0, round, empty);
    expect(shades.green).toBe(1);
    // Tile 3 ('m') fills box 0; next expected 'a' -> tile 1 is no longer the correct one.
    expect(composeShadesAfterPlacement(shades, 3, round, [3, null, null, null])).toEqual({ green: null, red: { tileId: 0, serial: 1 } });
    expect(correctTileId(round, [3, null, null, null])).toBe(0);
  });

  test('shades: the green tile dropped into a LATER box -> green moves to the other duplicate (repair L2)', () => {
    const round = fixedRound(MAMA, ['a', 'm', 'a', 'm']); // slots m a m a
    let shades = composeShadesAfterWrongSelection(NO_COMPOSE_SHADES, 0, round, empty);
    expect(shades).toEqual({ green: 1, red: { tileId: 0, serial: 1 } });
    // Green tile 1 ('m') directly into box 2: box 0 still needs 'm' -> green on tile 3.
    shades = composeShadesAfterPlacement(shades, 1, round, [null, null, 1, null]);
    expect(shades).toEqual({ green: 3, red: { tileId: 0, serial: 1 } });
    // A non-green tile ('a', tile 2) into later box 3: green stays on tile 3.
    shades = composeShadesAfterPlacement(shades, 2, round, [null, null, 1, 2]);
    expect(shades.green).toBe(3);
    // Box 0 gets its value -> green cleared (red of tile 0 untouched until tile 0 is placed).
    shades = composeShadesAfterPlacement(shades, 3, round, [3, null, 1, 2]);
    expect(shades).toEqual({ green: null, red: { tileId: 0, serial: 1 } });
    expect(composeShadesAfterPlacement(shades, 0, round, [3, 0, 1, 2])).toEqual(NO_COMPOSE_SHADES);
    // No wrong selection in the round -> placements never create a green shade.
    expect(composeShadesAfterPlacement(NO_COMPOSE_SHADES, 1, round, [null, null, 1, null])).toEqual(NO_COMPOSE_SHADES);
  });
});

describe('real dataset', () => {
  const dataset: WordStartsDataset = { words: WORDS, letterAudio: LETTER_AUDIO, syllableAudio: SYLLABLE_AUDIO, realSyllables: REAL_SYLLABLES };

  test('both variants have words and every tile has audio', () => {
    for (const variant of ['letters', 'syllables'] as const) {
      const eligible = composeEligibleWords(WORDS, variant);
      expect(eligible.length).toBeGreaterThan(0);
      for (const entry of eligible) {
        const round = buildComposeRound(entry, variant);
        for (const tile of round.tiles) {
          expect(tileAudioResource(variant, tile.value, dataset)).toBeDefined();
        }
      }
    }
  });
});
