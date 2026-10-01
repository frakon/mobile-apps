// Timing plans of the themed start animations — `_LetterTraining_PROMPTS.md` / "### Phase D — start animations".
// SHARED FILE: kept byte-identical in LetterTraining and LetterPexeso (src/startAnimation/__tests__/).
// The visual look itself is NOT tested here (device-unverified).

import {
  COMPOSE_PLAN,
  PEXESO_CARD_SHAPES,
  PEXESO_DEAL_LIMIT_MS,
  PEXESO_MATCH_PAIR,
  PEXESO_MISMATCH_PAIR,
  PEXESO_PLAN,
  START_ANIMATION_MAX_MS,
  StartAnimationScene,
  TRAIN_PLAN,
  WORDS_PLAN,
  allTracks,
  sceneDurationMs,
  toInterpolation,
  valueAt,
} from '../startAnimationLogic';

const SCENES: StartAnimationScene[] = ['words', 'compose', 'train', 'pexeso'];

test.each(SCENES)('%s: lasts at most 5 s and every track settles by the end (fixed end screen)', (scene) => {
  const duration = sceneDurationMs(scene);
  expect(duration).toBeGreaterThan(0);
  expect(duration).toBeLessThanOrEqual(START_ANIMATION_MAX_MS);
  for (const keys of allTracks(scene)) {
    expect(keys.length).toBeGreaterThan(0);
    expect(keys[keys.length - 1][0]).toBeLessThanOrEqual(duration);
    const { inputRange } = toInterpolation(keys);
    expect(inputRange.length).toBeGreaterThanOrEqual(2);
    for (let index = 1; index < inputRange.length; index++) {
      expect(inputRange[index]).toBeGreaterThanOrEqual(inputRange[index - 1]);
    }
  }
});

test('words: picture first, then speaker pulse, then the options, then the right one lights up', () => {
  expect(valueAt(WORDS_PLAN.picture, WORDS_PLAN.durationMs)).toBe(1);
  expect(WORDS_PLAN.speaker[0][0]).toBeGreaterThanOrEqual(WORDS_PLAN.picture[WORDS_PLAN.picture.length - 1][0]);
  for (const option of WORDS_PLAN.options) {
    expect(valueAt(option, 0)).toBe(0);
    expect(valueAt(option, WORDS_PLAN.durationMs)).toBe(1);
  }
  expect(WORDS_PLAN.correctHighlight[0][0]).toBeGreaterThanOrEqual(WORDS_PLAN.options[2][2][0]);
  expect(valueAt(WORDS_PLAN.correctHighlight, WORDS_PLAN.durationMs)).toBe(1);
});

test('compose: tiles arrive one after another and all sit in their boxes at the end', () => {
  COMPOSE_PLAN.tiles.forEach((tile, index) => {
    expect(valueAt(tile, 0)).toBe(0);
    expect(valueAt(tile, COMPOSE_PLAN.durationMs)).toBe(1);
    if (index > 0) {
      expect(tile[0][0]).toBeGreaterThanOrEqual(COMPOSE_PLAN.tiles[index - 1][1][0]);
    }
  });
  expect(COMPOSE_PLAN.done[0][0]).toBeGreaterThanOrEqual(COMPOSE_PLAN.tiles[COMPOSE_PLAN.tiles.length - 1][1][0]);
});

test('train: engine first, wagons hook on in order', () => {
  expect(TRAIN_PLAN.wagons[0][0][0]).toBeGreaterThanOrEqual(TRAIN_PLAN.engine[1][0]);
  TRAIN_PLAN.wagons.forEach((wagon, index) => {
    expect(valueAt(wagon, TRAIN_PLAN.durationMs)).toBe(1);
    if (index > 0) {
      expect(wagon[0][0]).toBeGreaterThanOrEqual(TRAIN_PLAN.wagons[index - 1][1][0]);
    }
  });
});

test('pexeso: all cards land within 1 s, matching pair vanishes, different pair turns back', () => {
  for (const deal of PEXESO_PLAN.deal) {
    expect(deal[deal.length - 1][0]).toBeLessThanOrEqual(PEXESO_DEAL_LIMIT_MS);
  }
  const [firstMatch, secondMatch] = PEXESO_MATCH_PAIR;
  expect(PEXESO_CARD_SHAPES[firstMatch]).toBe(PEXESO_CARD_SHAPES[secondMatch]);
  const [firstMismatch, secondMismatch] = PEXESO_MISMATCH_PAIR;
  expect(PEXESO_CARD_SHAPES[firstMismatch]).not.toBe(PEXESO_CARD_SHAPES[secondMismatch]);

  const end = PEXESO_PLAN.durationMs;
  // Matched pair: face shown, then the card disappears before the end.
  expect(valueAt(PEXESO_PLAN.face[firstMatch], end)).toBe(1);
  expect(valueAt(PEXESO_PLAN.matchedPresence, end)).toBe(0);
  expect(PEXESO_PLAN.matchedPresence[0][0]).toBeGreaterThan(PEXESO_PLAN.flipScale[firstMatch][2][0]);
  // Mismatched pair: face shown in the middle, hidden again (face-down, full width) at the end.
  expect(valueAt(PEXESO_PLAN.face[firstMismatch], 3400)).toBe(1);
  expect(valueAt(PEXESO_PLAN.face[firstMismatch], end)).toBe(0);
  expect(valueAt(PEXESO_PLAN.flipScale[firstMismatch], end)).toBe(1);
  // Untouched cards stay face-down.
  const pairCards: number[] = [...PEXESO_MATCH_PAIR, ...PEXESO_MISMATCH_PAIR];
  PEXESO_CARD_SHAPES.forEach((_, index) => {
    if (!pairCards.includes(index)) {
      expect(valueAt(PEXESO_PLAN.face[index], end)).toBe(0);
      expect(valueAt(PEXESO_PLAN.flipScale[index], end)).toBe(1);
    }
  });
});
