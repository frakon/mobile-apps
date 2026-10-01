// Tests of `_LetterTraining_PROMPTS.md` / "## Follow-up prompt 19" + "### Q&A 19": word-length range of the
// "Skládání slov" settings (bounds from the available words, range filtering, word count, knot logic) and the
// arrow shown only for the first tile of round 1 of a play. Pure logic + text-based wiring checks of the screens.
import { WORDS } from '../../words';
import { WordEntry } from '../../wordStarts/types';
import {
  COMPOSE_ROUNDS_PER_PLAY,
  buildComposePlan,
  clampComposeLengthRange,
  completeRound,
  composeEligibleWords,
  composeLengthBounds,
  composeUnitCount,
  countComposeWordsInRange,
  INITIAL_COMPOSE_PROGRESS,
  isPlacementArrowShown,
  moveRangeKnot,
  nearestRangeKnot,
  resolveDragKnot,
  czechWordCountLabel,
  rangePositionOfValue,
  rangeValueAtPosition,
} from '../logic';

declare const __dirname: string;
const fileSystem = jest.requireActual('fs') as { readFileSync(path: string, encoding: 'utf8'): string };
const paths = jest.requireActual('path') as { join(...parts: string[]): string };

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

function seeded(seed: number): () => number {
  let state = seed;
  return () => {
    state = (state * 1103515245 + 12345) % 2147483648;
    return state / 2147483648;
  };
}

const PES = word('pes', 'pes', ['pes']); // 3 letters, 1 syllable
const KOCKA = word('kocka', 'kočka', ['koč', 'ka']); // 5 letters, 2 syllables
const CHALUPA = word('chalupa', 'chalupa', ['cha', 'lu', 'pa']); // 6 letters (ch = 1), 3 syllables
const LOKOMOTIVA = word('lokomotiva', 'lokomotiva', ['lo', 'ko', 'mo', 'ti', 'va']); // 10 letters, 5 syllables
const OBRAZ = word('obraz', 'obraz', ['ob', 'raz'], { excludeLevel2: true }); // 5 letters; disputed syllables
const SAMPLE = [PES, KOCKA, CHALUPA, LOKOMOTIVA, OBRAZ];

describe('length bounds from the available words', () => {
  test('unit count: letters (ch = 1) / syllables', () => {
    expect(composeUnitCount(CHALUPA, 'letters')).toBe(6);
    expect(composeUnitCount(CHALUPA, 'syllables')).toBe(3);
  });

  test('bounds = shortest / longest ELIGIBLE word per variant', () => {
    expect(composeLengthBounds(SAMPLE, 'letters')).toEqual({ min: 3, max: 10 });
    // pes (1 syllable) and obraz (excludeLevel2) are not eligible for syllables.
    expect(composeLengthBounds(SAMPLE, 'syllables')).toEqual({ min: 2, max: 5 });
    expect(composeLengthBounds([PES], 'syllables')).toBeNull();
  });

  test('real dataset bounds (not the old fixed 3-8 / 2-5)', () => {
    const letters = composeLengthBounds(WORDS, 'letters')!;
    const syllables = composeLengthBounds(WORDS, 'syllables')!;
    const letterCounts = composeEligibleWords(WORDS, 'letters').map((entry) => composeUnitCount(entry, 'letters'));
    const syllableCounts = composeEligibleWords(WORDS, 'syllables').map((entry) => composeUnitCount(entry, 'syllables'));
    expect(letters).toEqual({ min: Math.min(...letterCounts), max: Math.max(...letterCounts) });
    expect(syllables).toEqual({ min: Math.min(...syllableCounts), max: Math.max(...syllableCounts) });
    // Snapshot of the current word list (update when src/words.ts changes the extremes).
    expect(letters).toEqual({ min: 2, max: 11 });
    expect(syllables).toEqual({ min: 2, max: 5 });
    // Full range = every eligible word.
    expect(countComposeWordsInRange(WORDS, 'letters', letters)).toBe(composeEligibleWords(WORDS, 'letters').length);
    // Snapshot of the totals (dataset drift guard).
    expect(countComposeWordsInRange(WORDS, 'letters', letters)).toBe(513);
    expect(countComposeWordsInRange(WORDS, 'syllables', syllables)).toBe(390);
  });
});

describe('range filtering and word count', () => {
  test('eligible words / count respect the inclusive range', () => {
    expect(composeEligibleWords(SAMPLE, 'letters', { min: 5, max: 6 }).map((entry) => entry.id)).toEqual(['kocka', 'chalupa', 'obraz']);
    expect(countComposeWordsInRange(SAMPLE, 'letters', { min: 5, max: 6 })).toBe(3);
    expect(countComposeWordsInRange(SAMPLE, 'letters', { min: 10, max: 10 })).toBe(1);
    expect(countComposeWordsInRange(SAMPLE, 'letters', { min: 7, max: 9 })).toBe(0);
    expect(countComposeWordsInRange(SAMPLE, 'syllables', { min: 2, max: 3 })).toBe(2);
  });

  test('plan uses only words in the range; small pool keeps 10 rounds with repeats; empty range -> []', () => {
    const plan = buildComposePlan(SAMPLE, 'letters', seeded(3), COMPOSE_ROUNDS_PER_PLAY, { min: 5, max: 6 });
    expect(plan).toHaveLength(COMPOSE_ROUNDS_PER_PLAY);
    for (const round of plan) {
      expect(['kocka', 'chalupa', 'obraz']).toContain(round.word.id);
    }
    const single = buildComposePlan(SAMPLE, 'letters', seeded(3), COMPOSE_ROUNDS_PER_PLAY, { min: 10, max: 10 });
    expect(single.map((round) => round.word.id)).toEqual(Array(COMPOSE_ROUNDS_PER_PLAY).fill('lokomotiva'));
    expect(buildComposePlan(SAMPLE, 'letters', seeded(3), COMPOSE_ROUNDS_PER_PLAY, { min: 7, max: 9 })).toEqual([]);
  });

  test('stored range clamped into the bounds; null / invalid -> full range', () => {
    const bounds = { min: 2, max: 11 };
    expect(clampComposeLengthRange(null, bounds)).toEqual(bounds);
    expect(clampComposeLengthRange({ min: 0, max: 20 }, bounds)).toEqual(bounds);
    expect(clampComposeLengthRange({ min: 4, max: 6 }, bounds)).toEqual({ min: 4, max: 6 });
    expect(clampComposeLengthRange({ min: 7, max: 4 }, bounds)).toEqual(bounds);
    expect(clampComposeLengthRange({ min: Number.NaN, max: 4 }, bounds)).toEqual(bounds);
  });
});

describe('range bar knots', () => {
  const bounds = { min: 2, max: 11 }; // 9 steps
  test('position <-> value, snapped to integers and clamped', () => {
    expect(rangeValueAtPosition(0, 90, bounds)).toBe(2);
    expect(rangeValueAtPosition(90, 90, bounds)).toBe(11);
    expect(rangeValueAtPosition(24, 90, bounds)).toBe(4); // 2.4 steps -> 2
    expect(rangeValueAtPosition(26, 90, bounds)).toBe(5); // 2.6 steps -> 3
    expect(rangeValueAtPosition(-50, 90, bounds)).toBe(2);
    expect(rangeValueAtPosition(500, 90, bounds)).toBe(11);
    expect(rangePositionOfValue(5, 90, bounds)).toBe(30);
    expect(rangeValueAtPosition(40, 90, { min: 4, max: 4 })).toBe(4);
  });

  test('knots never cross; nearer knot grabbed', () => {
    expect(moveRangeKnot({ min: 3, max: 6 }, 'min', 8)).toEqual({ min: 6, max: 6 });
    expect(moveRangeKnot({ min: 3, max: 6 }, 'max', 1)).toEqual({ min: 3, max: 3 });
    expect(moveRangeKnot({ min: 3, max: 6 }, 'max', 9)).toEqual({ min: 3, max: 9 });
    expect(nearestRangeKnot({ min: 3, max: 9 }, 4)).toBe('min');
    expect(nearestRangeKnot({ min: 3, max: 9 }, 8)).toBe('max');
    expect(nearestRangeKnot({ min: 5, max: 5 }, 3)).toBe('min');
    expect(nearestRangeKnot({ min: 5, max: 5 }, 7)).toBe('max');
  });

  test('coincident knots: drag direction decides the moved knot, no crossing', () => {
    const coincident = { min: 5, max: 5 };
    const grabbed = nearestRangeKnot(coincident, 5); // touch exactly on both knots
    expect(resolveDragKnot(coincident, grabbed, 5)).toBe(grabbed); // no move yet
    expect(resolveDragKnot(coincident, grabbed, 7)).toBe('max');
    expect(moveRangeKnot(coincident, resolveDragKnot(coincident, grabbed, 7), 7)).toEqual({ min: 5, max: 7 });
    expect(resolveDragKnot(coincident, 'max', 3)).toBe('min');
    expect(moveRangeKnot(coincident, resolveDragKnot(coincident, 'max', 3), 3)).toEqual({ min: 3, max: 5 });
    expect(resolveDragKnot({ min: 3, max: 6 }, 'min', 8)).toBe('min'); // distinct knots: grabbed knot kept
    expect(moveRangeKnot({ min: 3, max: 6 }, resolveDragKnot({ min: 3, max: 6 }, 'min', 8), 8)).toEqual({ min: 6, max: 6 });
  });

  test('Czech plural of the word count label', () => {
    expect([0, 1, 2, 4, 5, 22, 513].map(czechWordCountLabel)).toEqual(['slov', 'slovo', 'slova', 'slova', 'slov', 'slov', 'slov']);
  });
});

describe('arrow only for the first tile of round 1 ("### Q&A 19")', () => {
  test('shown only in round 1 before any placement; again after a new play', () => {
    expect(isPlacementArrowShown(0, [null, null, null])).toBe(true);
    expect(isPlacementArrowShown(0, [1, null, null])).toBe(false); // second letter of word 1
    expect(isPlacementArrowShown(0, [null, null, 2])).toBe(false); // out-of-order first placement counts too
    let progress = completeRound(INITIAL_COMPOSE_PROGRESS);
    expect(isPlacementArrowShown(progress.roundIndex, [null, null, null])).toBe(false); // word 2
    progress = completeRound(progress);
    expect(isPlacementArrowShown(progress.roundIndex, [null, null])).toBe(false);
    expect(isPlacementArrowShown(INITIAL_COMPOSE_PROGRESS.roundIndex, [null, null])).toBe(true); // "Hrát znovu"
  });
});

describe('screen wiring (text-based)', () => {
  const read = (...parts: string[]) => fileSystem.readFileSync(paths.join(__dirname, '..', '..', '..', ...parts), 'utf8');
  const compose = read('app', 'compose.tsx');
  const settings = read('app', 'compose-settings.tsx');

  test('compose: arrow gated by isPlacementArrowShown; plan built with the stored range; settings opened per variant', () => {
    expect(compose).toContain('const arrowTileId = isPlacementArrowShown(progress.roundIndex, filledSlots)');
    expect(compose).toContain('? arrowSourceTileId(currentRound, filledSlots, draggedTileId)');
    expect((compose.match(/buildComposePlan\(WORDS, variant, Math\.random, COMPOSE_ROUNDS_PER_PLAY, planRangeRef\.current\)/g) ?? []).length).toBe(2);
    expect(compose).toContain('loadComposeLengthRange(variant)');
    expect(compose).toContain('router.push(`/compose-settings?variant=${variant}`)');
  });

  test('settings: range bar with bounds from the words, live count, persisted per variant', () => {
    expect(settings).toContain('composeLengthBounds(WORDS, variant)');
    expect(settings).toContain('<RangeBar bounds={bounds} value={lengthRange} onChange={changeRange} onCommit={commitRange} />');
    expect(settings).toContain('countComposeWordsInRange(WORDS, variant, lengthRange)');
    expect(settings).toContain('saveComposeLengthRange(variant, range)');
    expect(settings).toContain('clampComposeLengthRange(stored, bounds)');
  });
});
