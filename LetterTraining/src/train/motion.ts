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
  const fastEnd = motion.from + SHIFT_FAST_FRACTION * distance;
  const rest = (1 - SHIFT_FAST_FRACTION) * distance;
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
export function retargetShift(current: ShiftMotion, elapsedMilliseconds: number, newTarget: number): ShiftMotion {
  'worklet';
  const sample = sampleShift(current, elapsedMilliseconds);
  return { from: sample.position, to: newTarget, startVelocity: sample.velocity, startAcceleration: sample.acceleration };
}

// Smooth ease-in-out (cubic) used for slide-back, neighbour spacing and the grow-in: zero velocity at both ends.
export function easeInOutCubic(progress: number): number {
  'worklet';
  const t = Math.min(1, Math.max(0, progress));
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}
