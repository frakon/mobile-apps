// Pure timing plans of the themed exercise start animations (mobile-apps-preferences skill, "Exercise start animation";
// `_LetterTraining_PROMPTS.md` / "## Follow-up prompt 9" decision 4 "One themed animation per game", Phase D note).
// Each scene runs on ONE master clock (0 → durationMs, linear) and every element is a keyframe track over that clock.
// After durationMs the clock stays at the end → the last frame is the permanent fixed screen that stays until the
// resources are loaded. The cut-on-ready itself is done by the screens' preload gates: once ready they render the game
// instead of <StartAnimation>, which unmounts (and stops) it immediately, whatever beat it is in.
//
// SHARED FILE: kept byte-identical in LetterTraining (src/startAnimation/) and LetterPexeso (src/startAnimation/).

export const START_ANIMATION_MAX_MS = 5000;
// Skill example: pexeso cards fly onto the table "all placed within 1 second".
export const PEXESO_DEAL_LIMIT_MS = 1000;

export type StartAnimationScene = 'words' | 'compose' | 'train' | 'pexeso';

// [timeMs, value] pairs; times non-decreasing, values held before the first / after the last key.
export type Keyframes = readonly (readonly [number, number])[];

export interface Interpolation {
  readonly inputRange: number[];
  readonly outputRange: number[];
}

// Converts keyframes to an Animated interpolation over the master clock (clamped outside the keys).
// A single-key (constant) track is widened to two keys — Animated needs at least two.
export function toInterpolation(keys: Keyframes): Interpolation {
  const widened: Keyframes = keys.length === 1 ? [keys[0], [keys[0][0] + 1, keys[0][1]]] : keys;
  return { inputRange: widened.map(([time]) => time), outputRange: widened.map(([, value]) => value) };
}

// Value of a keyframe track at the given time (same semantics as the clamped Animated interpolation) — used by tests.
export function valueAt(keys: Keyframes, timeMs: number): number {
  if (timeMs <= keys[0][0]) {
    return keys[0][1];
  }
  for (let index = 1; index < keys.length; index++) {
    const [time, value] = keys[index];
    if (timeMs <= time) {
      const [previousTime, previousValue] = keys[index - 1];
      if (time === previousTime) {
        return value;
      }
      return previousValue + ((value - previousValue) * (timeMs - previousTime)) / (time - previousTime);
    }
  }
  return keys[keys.length - 1][1];
}

// 0 → 1 appearance ("pop") from `startMs` taking `durationMs`, with a small overshoot for a friendly bounce.
export function popIn(startMs: number, durationMs: number): Keyframes {
  return [
    [startMs, 0],
    [startMs + durationMs * 0.7, 1.15],
    [startMs + durationMs, 1],
  ];
}

// Linear move/fade from `from` to `to` during [startMs, startMs + durationMs].
export function slide(startMs: number, durationMs: number, from: number, to: number): Keyframes {
  return [
    [startMs, from],
    [startMs + durationMs, to],
  ];
}

// Card-flip width factor (1 → 0 → 1) around a face change at the midpoint.
export function flip(startMs: number, durationMs: number): Keyframes {
  return [
    [startMs, 1],
    [startMs + durationMs / 2, 0],
    [startMs + durationMs, 1],
  ];
}

// Opacity of a card face shown between the midpoints of an opening flip and an optional closing flip.
export function faceVisible(openStartMs: number, flipMs: number, closeStartMs?: number): Keyframes {
  const shown = openStartMs + flipMs / 2;
  if (closeStartMs === undefined) {
    return [
      [shown, 0],
      [shown, 1],
    ];
  }
  const hidden = closeStartMs + flipMs / 2;
  return [
    [shown, 0],
    [shown, 1],
    [hidden, 1],
    [hidden, 0],
  ];
}

// ---- Začátky slov: picture card appears, the word "sounds" (speaker pulse), letter options pop in, right one lights.
export const WORDS_PLAN = {
  durationMs: 3200,
  picture: popIn(0, 500),
  speaker: [
    [500, 0],
    [600, 1],
    [850, 1.3],
    [1100, 1],
    [1350, 1.3],
    [1600, 1],
  ] as Keyframes,
  // Options in display order; index WORDS_CORRECT_INDEX is the right first letter (🍎 → "J" as "jablko").
  options: [popIn(1600, 300), popIn(1800, 300), popIn(2000, 300)],
  correctHighlight: slide(2600, 400, 0, 1),
} as const;
export const WORDS_PICTURE = '🍎';
export const WORDS_OPTIONS = ['M', 'J', 'S'] as const;
export const WORDS_CORRECT_INDEX = 1;

// ---- Skládání slov: letter tiles slide one by one into the word boxes, then the word lights up.
export const COMPOSE_WORD = ['P', 'E', 'S'] as const;
export const COMPOSE_PICTURE = '🐶';
export const COMPOSE_PLAN = {
  durationMs: 3500,
  picture: popIn(0, 400),
  boxes: slide(200, 300, 0, 1),
  // Progress 0 (tile in the pool) → 1 (tile in its box), tile i starts at 600 + i·800 ms.
  tiles: COMPOSE_WORD.map((_, index) => slide(600 + index * 800, 650, 0, 1)),
  done: slide(3000, 400, 0, 1),
} as const;

// ---- Abecedový vlak: the engine drives in, letter wagons hook on in alphabet order.
export const TRAIN_LETTERS = ['A', 'B', 'C'] as const;
export const TRAIN_PLAN = {
  durationMs: 3900,
  // Progress 0 (off-stage left) → 1 (engine at its stop).
  engine: slide(0, 1100, 0, 1),
  // Progress 0 (off-stage right) → 1 (hooked behind the previous car), wagon i starts at 1200 + i·750 ms.
  wagons: TRAIN_LETTERS.map((_, index) => slide(1200 + index * 750, 600, 0, 1)),
  // Small "toot" puff once the whole train is assembled.
  puff: [
    [3450, 0],
    [3600, 1],
    [3900, 0.6],
  ] as Keyframes,
} as const;

// ---- Pexeso (skill example): 6 cards fly onto the table (all within 1 s), a matching pair flips and disappears with a
// sparkle, a different pair flips and turns back. Card faces are simple geometric shapes.
export type PexesoShape = 'circle' | 'square' | 'diamond';
export const PEXESO_CARD_SHAPES: readonly PexesoShape[] = ['circle', 'square', 'diamond', 'circle', 'diamond', 'square'];
export const PEXESO_MATCH_PAIR = [0, 3] as const;
export const PEXESO_MISMATCH_PAIR = [1, 2] as const;
const PEXESO_FLIP_MS = 300;
const PEXESO_MATCH_OPEN_MS = 1300;
const PEXESO_MISMATCH_OPEN_MS = 2900;
const PEXESO_MISMATCH_CLOSE_MS = 3700;
export const PEXESO_PLAN = {
  durationMs: 4200,
  // Progress 0 (deck above the table) → 1 (card on its place); card i starts at i·130 ms, lands 300 ms later.
  deal: PEXESO_CARD_SHAPES.map((_, index) => slide(index * 130, 300, 0, 1)),
  // Per card: width factor of the flip animation (cards not in a pair never flip).
  flipScale: PEXESO_CARD_SHAPES.map((_, index): Keyframes => {
    if ((PEXESO_MATCH_PAIR as readonly number[]).includes(index)) {
      return flip(PEXESO_MATCH_OPEN_MS, PEXESO_FLIP_MS);
    }
    if ((PEXESO_MISMATCH_PAIR as readonly number[]).includes(index)) {
      return [
        ...flip(PEXESO_MISMATCH_OPEN_MS, PEXESO_FLIP_MS),
        ...flip(PEXESO_MISMATCH_CLOSE_MS, PEXESO_FLIP_MS),
      ];
    }
    return [[0, 1]];
  }),
  // Per card: opacity of the face side (shape) over the back side.
  face: PEXESO_CARD_SHAPES.map((_, index): Keyframes => {
    if ((PEXESO_MATCH_PAIR as readonly number[]).includes(index)) {
      return faceVisible(PEXESO_MATCH_OPEN_MS, PEXESO_FLIP_MS);
    }
    if ((PEXESO_MISMATCH_PAIR as readonly number[]).includes(index)) {
      return faceVisible(PEXESO_MISMATCH_OPEN_MS, PEXESO_FLIP_MS, PEXESO_MISMATCH_CLOSE_MS);
    }
    return [[0, 0]];
  }),
  // The matched pair shrinks away (1 → 0) after being shown; other cards stay.
  matchedPresence: slide(2100, 450, 1, 0),
  sparkle: [
    [2050, 0],
    [2250, 1],
    [2550, 1],
    [2750, 0],
  ] as Keyframes,
} as const;

// Every keyframe track of a scene (for validation in tests).
export function allTracks(scene: StartAnimationScene): Keyframes[] {
  switch (scene) {
    case 'words':
      return [WORDS_PLAN.picture, WORDS_PLAN.speaker, ...WORDS_PLAN.options, WORDS_PLAN.correctHighlight];
    case 'compose':
      return [COMPOSE_PLAN.picture, COMPOSE_PLAN.boxes, ...COMPOSE_PLAN.tiles, COMPOSE_PLAN.done];
    case 'train':
      return [TRAIN_PLAN.engine, ...TRAIN_PLAN.wagons, TRAIN_PLAN.puff];
    case 'pexeso':
      return [...PEXESO_PLAN.deal, ...PEXESO_PLAN.flipScale, ...PEXESO_PLAN.face, PEXESO_PLAN.matchedPresence, PEXESO_PLAN.sparkle];
  }
}

export function sceneDurationMs(scene: StartAnimationScene): number {
  switch (scene) {
    case 'words':
      return WORDS_PLAN.durationMs;
    case 'compose':
      return COMPOSE_PLAN.durationMs;
    case 'train':
      return TRAIN_PLAN.durationMs;
    case 'pexeso':
      return PEXESO_PLAN.durationMs;
  }
}
