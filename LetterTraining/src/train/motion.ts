// Continuous motion math of "Abecedový vlak" (pure worklet-compatible functions) - `_LetterTraining_PROMPTS.md` /
// "## Follow-up prompt 5 — new game "Abecedový vlak" (verbatim)": "The move is continuous and lasts from 90% 1 second:
// it quickly accelerates then slows down and the last 10% of the way it goes the next 10 seconds, unless another letter
// ... was added ...: in that case it would again ... go its 90% of the distance in 1 second and then slowly keep moving
// for the rest of 10 seconds" + "every move in this game is continuous: with continuous acceleration and deceleration".
//
// Model (C2: position, velocity AND acceleration continuous - "continuous acceleration and deceleration"):
// phase 1 (0..1 s) = quintic Hermite from (start position, velocity, acceleration) to 90 % of the way, arriving with
// the velocity + acceleration phase 2 starts with; phase 2 (1..11 s) = quartic ease-out 0.1 D (1 - (1 - s)^4) over the
// last 10 % (velocity and acceleration -> 0 at the end). A shift from rest starts with zero acceleration (smooth start)
// and a retarget (new placement) starts from the CURRENT position, velocity and acceleration (no jump, no velocity or
// acceleration step).

export const SHIFT_FAST_MILLISECONDS = 1000;
export const SHIFT_SLOW_MILLISECONDS = 10000;
export const SHIFT_TOTAL_MILLISECONDS = SHIFT_FAST_MILLISECONDS + SHIFT_SLOW_MILLISECONDS;
export const SHIFT_FAST_FRACTION = 0.9;

export interface ShiftMotion {
  readonly from: number;
  readonly to: number;
  // Velocity at the start, in units per millisecond.
  readonly startVelocity: number;
  // Acceleration at the start, in units per millisecond squared.
  readonly startAcceleration: number;
  // Distance (magnitude) left for the slow 10 s phase; undefined = (1 - SHIFT_FAST_FRACTION) of the whole distance.
  // "## Follow-up prompt 10" (repair L3): the spec says the 1 s part travels "only the 90% of width of the just
  // connected wagon" - the train screen passes pitch - 0.9 * wagonWidth here (pitch = wagon width + coupling gap).
  readonly slowDistance?: number;
}

// Slow-phase distance for a one-wagon shift: the 1 s part covers exactly SHIFT_FAST_FRACTION of the WAGON WIDTH.
export function shiftSlowDistance(pitch: number, wagonWidth: number): number {
  'worklet';
  return Math.max(0, pitch - SHIFT_FAST_FRACTION * wagonWidth);
}

export interface MotionSample {
  readonly position: number;
  // Units per millisecond.
  readonly velocity: number;
  // Units per millisecond squared.
  readonly acceleration: number;
}

export function sampleShift(motion: ShiftMotion, elapsedMilliseconds: number): MotionSample {
  'worklet';
  const distance = motion.to - motion.from;
  const rest =
    motion.slowDistance === undefined
      ? (1 - SHIFT_FAST_FRACTION) * distance
      : Math.sign(distance) * Math.min(Math.abs(motion.slowDistance), Math.abs(distance));
  const fastEnd = motion.to - rest;
  const slow = SHIFT_SLOW_MILLISECONDS;
  const time = Math.max(0, elapsedMilliseconds);
  if (time < SHIFT_FAST_MILLISECONDS) {
    // Quintic Hermite on s in [0, 1]; velocity scaled by the duration, acceleration by the duration squared.
    const duration = SHIFT_FAST_MILLISECONDS;
    const s = time / duration;
    const s2 = s * s;
    const s3 = s2 * s;
    const s4 = s3 * s;
    const s5 = s4 * s;
    const chord = fastEnd - motion.from;
    let v0 = motion.startVelocity * duration;
    // Overshoot guard (tangent <= 3x chord); with one-wagon shifts it never triggers.
    if (chord * v0 > 0 && Math.abs(v0) > 3 * Math.abs(chord)) {
      v0 = 3 * chord;
    }
    const a0 = motion.startAcceleration * duration * duration;
    // Start of phase 2 (d/ds of 0.1 D (1 - (1 - s)^4) at s = 0 is 0.4 D, the second derivative -1.2 D), rescaled.
    const v1 = ((4 * rest) / slow) * duration;
    const a1 = ((-12 * rest) / (slow * slow)) * duration * duration;
    const p0 = motion.from;
    const p1 = fastEnd;
    const position =
      (1 - 10 * s3 + 15 * s4 - 6 * s5) * p0 +
      (s - 6 * s3 + 8 * s4 - 3 * s5) * v0 +
      (0.5 * s2 - 1.5 * s3 + 1.5 * s4 - 0.5 * s5) * a0 +
      (0.5 * s3 - s4 + 0.5 * s5) * a1 +
      (-4 * s3 + 7 * s4 - 3 * s5) * v1 +
      (10 * s3 - 15 * s4 + 6 * s5) * p1;
    const first =
      (-30 * s2 + 60 * s3 - 30 * s4) * p0 +
      (1 - 18 * s2 + 32 * s3 - 15 * s4) * v0 +
      (s - 4.5 * s2 + 6 * s3 - 2.5 * s4) * a0 +
      (1.5 * s2 - 4 * s3 + 2.5 * s4) * a1 +
      (-12 * s2 + 28 * s3 - 15 * s4) * v1 +
      (30 * s2 - 60 * s3 + 30 * s4) * p1;
    const second =
      (-60 * s + 180 * s2 - 120 * s3) * p0 +
      (-36 * s + 96 * s2 - 60 * s3) * v0 +
      (1 - 9 * s + 18 * s2 - 10 * s3) * a0 +
      (3 * s - 12 * s2 + 10 * s3) * a1 +
      (-24 * s + 84 * s2 - 60 * s3) * v1 +
      (60 * s - 180 * s2 + 120 * s3) * p1;
    return { position, velocity: first / duration, acceleration: second / (duration * duration) };
  }
  if (time < SHIFT_TOTAL_MILLISECONDS) {
    const s = (time - SHIFT_FAST_MILLISECONDS) / slow;
    const oneMinus = 1 - s;
    const oneMinus2 = oneMinus * oneMinus;
    return {
      position: fastEnd + rest * (1 - oneMinus2 * oneMinus2),
      velocity: (4 * rest * oneMinus2 * oneMinus) / slow,
      acceleration: (-12 * rest * oneMinus2) / (slow * slow),
    };
  }
  return { position: motion.to, velocity: 0, acceleration: 0 };
}

// New placement while moving: continue from the current position, velocity and acceleration towards the new target.
export function retargetShift(current: ShiftMotion, elapsedMilliseconds: number, newTarget: number, slowDistance?: number): ShiftMotion {
  'worklet';
  const sample = sampleShift(current, elapsedMilliseconds);
  return { from: sample.position, to: newTarget, startVelocity: sample.velocity, startAcceleration: sample.acceleration, slowDistance };
}

// Smooth ease-in-out (cubic) used for slide-back, neighbour spacing and the grow-in: zero velocity at both ends.
export function easeInOutCubic(progress: number): number {
  'worklet';
  const t = Math.min(1, Math.max(0, progress));
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

// "## Follow-up prompt 10": "the random moves of wagons shall be always by 1px only: even if we want to move it by 4px,
// we do it in four 1px steps ... Put between every 1px movement at least 0.5second space".
export const FLOAT_STEP_PIXELS = 1;
// DECISION (not user-specified): each 1 px step itself glides (ease-in-out) over this time; the pause after it is
// random in [minimum, minimum + jitter] (>= 0.5 s as required).
export const FLOAT_STEP_GLIDE_MILLISECONDS = 350;
export const FLOAT_STEP_PAUSE_MINIMUM_MILLISECONDS = 500;
export const FLOAT_STEP_PAUSE_JITTER_MILLISECONDS = 700;

// Integer positions visited from `from` to `to`, each exactly 1 px from the previous (from itself excluded).
export function planFloatSteps(from: number, to: number): number[] {
  const start = Math.round(from);
  const end = Math.round(to);
  const direction = Math.sign(end - start);
  const steps: number[] = [];
  for (let position = start; position !== end; ) {
    position += direction * FLOAT_STEP_PIXELS;
    steps.push(position);
  }
  return steps;
}

// Random integer float target in [-amplitude, amplitude], different from `current` when possible.
export function nextFloatTarget(current: number, amplitude: number, random: () => number): number {
  const span = 2 * Math.round(amplitude) + 1;
  for (let attempt = 0; attempt < 8; attempt++) {
    const target = Math.min(span - 1, Math.floor(random() * span)) - Math.round(amplitude);
    if (target !== Math.round(current) || span === 1) {
      return target;
    }
  }
  return Math.round(current) === 0 ? 1 : 0;
}

// Pause after a 1 px step (>= FLOAT_STEP_PAUSE_MINIMUM_MILLISECONDS).
export function floatStepPause(random: () => number): number {
  return FLOAT_STEP_PAUSE_MINIMUM_MILLISECONDS + random() * FLOAT_STEP_PAUSE_JITTER_MILLISECONDS;
}

// Time from the start of one 1 px step of a wagon to the start of its next step (glide + pause >= 0.5 s).
export function floatStepInterval(random: () => number): number {
  return FLOAT_STEP_GLIDE_MILLISECONDS + floatStepPause(random);
}

// Repair M1 ("## Follow-up prompt 10": "between every 1px movement at least 0.5second space"): ONE scheduler per wagon
// moves ONE axis per step, so an X step and a Y step never overlap (no ~1.41 px diagonal move).
export interface FloatState {
  readonly x: number;
  readonly y: number;
  readonly targetX: number;
  readonly targetY: number;
}

export const FLOAT_REST: FloatState = { x: 0, y: 0, targetX: 0, targetY: 0 };

export interface FloatStep {
  readonly axis: 'x' | 'y';
  // New whole-pixel position of that axis.
  readonly position: number;
  readonly state: FloatState;
}

export function nextFloatStep(state: FloatState, amplitude: number, random: () => number): FloatStep {
  let current = state;
  if (current.x === current.targetX && current.y === current.targetY) {
    // Both axes arrived: new random targets (at least one differs from the current position).
    current = { ...current, targetX: nextFloatTarget(current.x, amplitude, random), targetY: nextFloatTarget(current.y, amplitude, random) };
  }
  const xPending = current.x !== current.targetX;
  const yPending = current.y !== current.targetY;
  // Both pending -> random axis (an organic, non-staircase path); otherwise the one still moving.
  const axis: 'x' | 'y' = xPending && yPending ? (random() < 0.5 ? 'x' : 'y') : xPending ? 'x' : 'y';
  if (axis === 'x') {
    const position = current.x + Math.sign(current.targetX - current.x) * FLOAT_STEP_PIXELS;
    return { axis, position, state: { ...current, x: position } };
  }
  const position = current.y + Math.sign(current.targetY - current.y) * FLOAT_STEP_PIXELS;
  return { axis, position, state: { ...current, y: position } };
}

// "## Follow-up prompt 10": "fast sliding animation (lasting 0.5 second) move behind the previous wagon".
export const ATTACH_MILLISECONDS = 500;
// "the train goes off the screen in 1 last second"; the "Hotovo" screen comes only after the train is fully gone
// (DECISION: + EXIT_DONE_EXTRA_MILLISECONDS).
export const EXIT_MILLISECONDS = 1000;
export const EXIT_DONE_EXTRA_MILLISECONDS = 150;

// Delay from the last connecting touch: the exit starts after the attach slide, "Hotovo" after the exit.
// exitStart: after the last touch; doneAfterExitStart: after the exit started.
export function finishTimeline(): { exitStartMilliseconds: number; doneAfterExitStartMilliseconds: number } {
  return { exitStartMilliseconds: ATTACH_MILLISECONDS, doneAfterExitStartMilliseconds: EXIT_MILLISECONDS + EXIT_DONE_EXTRA_MILLISECONDS };
}

// "## Follow-up prompt 10": "at the end the train does not leave in regular speed: it immediatelly disappeards" -
// drive-off easing: constant acceleration during the first EXIT_ACCELERATION_FRACTION of the time, then constant
// (regular) speed until off screen; velocity continuous, NO deceleration (the train leaves at full speed).
export const EXIT_ACCELERATION_FRACTION = 0.3;

export function exitEasing(progress: number): number {
  'worklet';
  const t = Math.min(1, Math.max(0, progress));
  const a = EXIT_ACCELERATION_FRACTION;
  const norm = 1 - a / 2;
  return t < a ? (t * t) / (2 * a) / norm : (t - a / 2) / norm;
}
