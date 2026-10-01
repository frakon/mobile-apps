// Tests of the train shift easing / retarget math - `_LetterTraining_PROMPTS.md` / "## Follow-up prompt 5" (90 % in 1 s,
// last 10 % over 10 s, continuous incl. acceleration; retarget on a new placement).

import {
  ATTACH_MILLISECONDS,
  EXIT_ACCELERATION_FRACTION,
  EXIT_MILLISECONDS,
  FLOAT_REST,
  FLOAT_STEP_GLIDE_MILLISECONDS,
  FLOAT_STEP_PAUSE_MINIMUM_MILLISECONDS,
  FloatState,
  SHIFT_FAST_MILLISECONDS,
  SHIFT_TOTAL_MILLISECONDS,
  ShiftMotion,
  easeInOutCubic,
  exitEasing,
  finishTimeline,
  floatStepInterval,
  floatStepPause,
  nextFloatStep,
  nextFloatTarget,
  planFloatSteps,
  retargetShift,
  sampleShift,
  shiftSlowDistance,
} from '../motion';

const motion: ShiftMotion = { from: 0, to: -100, startVelocity: 0, startAcceleration: 0 };

describe('sampleShift', () => {
  test('starts at rest, 90 % after 1 s, done after 11 s', () => {
    expect(sampleShift(motion, 0)).toEqual({ position: 0, velocity: 0, acceleration: 0 });
    expect(sampleShift(motion, 1000).position).toBeCloseTo(-90, 6);
    expect(sampleShift(motion, SHIFT_TOTAL_MILLISECONDS)).toEqual({ position: -100, velocity: 0, acceleration: 0 });
    expect(sampleShift(motion, 99999).position).toBe(-100);
  });

  test('position, velocity and acceleration are continuous at the phase boundary and at the end', () => {
    for (const boundary of [1000, SHIFT_TOTAL_MILLISECONDS]) {
      const before = sampleShift(motion, boundary - 1e-6);
      const after = sampleShift(motion, boundary + 1e-6);
      expect(after.position).toBeCloseTo(before.position, 4);
      expect(after.velocity).toBeCloseTo(before.velocity, 8);
      expect(after.acceleration).toBeCloseTo(before.acceleration, 10);
    }
  });

  test('smooth start: acceleration starts at 0 and grows gradually', () => {
    expect(sampleShift(motion, 0).acceleration).toBe(0);
    expect(Math.abs(sampleShift(motion, 10).acceleration)).toBeLessThan(Math.abs(sampleShift(motion, 100).acceleration));
  });

  test('monotonic, accelerates then decelerates (no overshoot)', () => {
    let previous = 0;
    let maxSpeedTime = 0;
    let maxSpeed = 0;
    for (let time = 0; time <= SHIFT_TOTAL_MILLISECONDS; time += 10) {
      const sample = sampleShift(motion, time);
      expect(sample.position).toBeLessThanOrEqual(previous + 1e-9);
      expect(sample.position).toBeGreaterThanOrEqual(-100 - 1e-9);
      previous = sample.position;
      if (-sample.velocity > maxSpeed) {
        maxSpeed = -sample.velocity;
        maxSpeedTime = time;
      }
    }
    expect(maxSpeedTime).toBeGreaterThan(0);
    expect(maxSpeedTime).toBeLessThan(1000);
  });

  test('numeric derivative matches the reported velocity', () => {
    for (const time of [100, 500, 900, 3000, 9000]) {
      const step = 0.01;
      const numeric = (sampleShift(motion, time + step).position - sampleShift(motion, time - step).position) / (2 * step);
      expect(sampleShift(motion, time).velocity).toBeCloseTo(numeric, 5);
      const numericAcceleration = (sampleShift(motion, time + step).velocity - sampleShift(motion, time - step).velocity) / (2 * step);
      expect(sampleShift(motion, time).acceleration).toBeCloseTo(numericAcceleration, 7);
    }
  });
});

describe('retargetShift', () => {
  test('continues from the current position, velocity and acceleration (no jump)', () => {
    for (const elapsed of [300, 950, 4000]) {
      const before = sampleShift(motion, elapsed);
      const next = retargetShift(motion, elapsed, -200);
      const start = sampleShift(next, 0);
      expect(start.position).toBeCloseTo(before.position, 9);
      expect(start.velocity).toBeCloseTo(before.velocity, 9);
      expect(start.acceleration).toBeCloseTo(before.acceleration, 12);
      expect(sampleShift(next, 1000).position).toBeCloseTo(before.position + 0.9 * (-200 - before.position), 6);
      expect(sampleShift(next, SHIFT_TOTAL_MILLISECONDS).position).toBe(-200);
      // no overshoot past the new target
      for (let time = 0; time <= SHIFT_TOTAL_MILLISECONDS; time += 25) {
        expect(sampleShift(next, time).position).toBeGreaterThanOrEqual(-200 - 1e-9);
      }
    }
  });

  test('a series of quick placements: monotonic, never backwards, ends at the last target', () => {
    let current: ShiftMotion = motion;
    let currentStart = 0;
    let target = -100;
    const placements = [150, 300, 450, 600, 700, 2000, 2100];
    let previous = 0;
    for (let time = 0; time <= 2100 + SHIFT_TOTAL_MILLISECONDS; time += 1) {
      if (placements.includes(time)) {
        target -= 100;
        current = retargetShift(current, time - currentStart, target);
        currentStart = time;
      }
      const sample = sampleShift(current, time - currentStart);
      expect(sample.position).toBeLessThanOrEqual(previous + 1e-9);
      expect(sample.position).toBeGreaterThanOrEqual(target - 1e-9);
      previous = sample.position;
    }
    expect(previous).toBe(-800);
  });
});

test('easeInOutCubic', () => {
  expect(easeInOutCubic(0)).toBe(0);
  expect(easeInOutCubic(0.5)).toBeCloseTo(0.5);
  expect(easeInOutCubic(1)).toBe(1);
  expect(easeInOutCubic(2)).toBe(1);
});

// "## Follow-up prompt 10": 1 px float steps with >= 0.5 s pauses; regular-speed exit.
describe('float steps', () => {
  test('a 4 px move is four 1 px steps, in both directions', () => {
    expect(planFloatSteps(0, 4)).toEqual([1, 2, 3, 4]);
    expect(planFloatSteps(2, -2)).toEqual([1, 0, -1, -2]);
    expect(planFloatSteps(3, 3)).toEqual([]);
  });

  test('every step is exactly 1 px', () => {
    for (let from = -4; from <= 4; from++) {
      for (let to = -4; to <= 4; to++) {
        let previous = from;
        for (const position of planFloatSteps(from, to)) {
          expect(Math.abs(position - previous)).toBe(1);
          previous = position;
        }
        expect(previous).toBe(to);
      }
    }
  });

  test('targets are integers within the amplitude and differ from the current position', () => {
    for (const r of [0, 0.1, 0.5, 0.99, 0.999999]) {
      const target = nextFloatTarget(0, 4, () => r);
      expect(Number.isInteger(target)).toBe(true);
      expect(Math.abs(target)).toBeLessThanOrEqual(4);
    }
    expect(nextFloatTarget(0, 4, () => 0.5)).not.toBe(0);
  });

  test('pause between steps is at least 0.5 s', () => {
    expect(FLOAT_STEP_PAUSE_MINIMUM_MILLISECONDS).toBeGreaterThanOrEqual(500);
    expect(floatStepPause(() => 0)).toBeGreaterThanOrEqual(500);
    expect(floatStepPause(() => 0.999)).toBeGreaterThanOrEqual(500);
  });
});

describe('exitEasing', () => {
  test('starts at rest, reaches the end, no slow-down after the acceleration phase', () => {
    expect(exitEasing(0)).toBe(0);
    expect(exitEasing(1)).toBeCloseTo(1, 10);
    const h = 1e-4;
    const speedAt = (t: number) => (exitEasing(t + h) - exitEasing(t - h)) / (2 * h);
    const cruise = speedAt(0.9);
    expect(speedAt(EXIT_ACCELERATION_FRACTION + 0.05)).toBeCloseTo(cruise, 6);
    expect(speedAt(0.999 - h)).toBeCloseTo(cruise, 6);
    // Continuous velocity at the end of the acceleration phase, increasing before it.
    expect(speedAt(EXIT_ACCELERATION_FRACTION - 1e-3)).toBeCloseTo(cruise, 2);
    expect(speedAt(0.1)).toBeLessThan(speedAt(0.2));
  });

  test('velocity never decreases (no slow-down before leaving the screen)', () => {
    const h = 1e-4;
    let previous = -Infinity;
    for (let t = h; t <= 1 - h; t += 0.01) {
      const speed = (exitEasing(t + h) - exitEasing(t - h)) / (2 * h);
      expect(speed).toBeGreaterThanOrEqual(previous - 1e-6);
      previous = speed;
    }
  });
});

describe('single float scheduler (repair M1)', () => {
  function seededRandom(seed: number): () => number {
    let value = seed;
    return () => {
      value = (value * 1103515245 + 12345) % 2147483648;
      return value / 2147483648;
    };
  }

  test('every step moves exactly ONE axis by exactly 1 px, whole pixels within ±4 px', () => {
    for (const seed of [1, 7, 42, 999]) {
      const random = seededRandom(seed);
      let state: FloatState = FLOAT_REST;
      let xSteps = 0;
      let ySteps = 0;
      for (let index = 0; index < 2000; index++) {
        const step = nextFloatStep(state, 4, random);
        const dx = Math.abs(step.state.x - state.x);
        const dy = Math.abs(step.state.y - state.y);
        expect(dx + dy).toBe(1);
        expect(step.axis === 'x' ? dx : dy).toBe(1);
        expect(step.position).toBe(step.axis === 'x' ? step.state.x : step.state.y);
        for (const value of [step.state.x, step.state.y]) {
          expect(Number.isInteger(value)).toBe(true);
          expect(Math.abs(value)).toBeLessThanOrEqual(4);
        }
        xSteps += step.axis === 'x' ? 1 : 0;
        ySteps += step.axis === 'y' ? 1 : 0;
        state = step.state;
      }
      // Both axes float.
      expect(xSteps).toBeGreaterThan(200);
      expect(ySteps).toBeGreaterThan(200);
    }
  });

  test('consecutive steps of a wagon (either axis) start >= glide + 0.5 s apart, so they never overlap', () => {
    for (const r of [0, 0.5, 0.999999]) {
      expect(floatStepInterval(() => r)).toBeGreaterThanOrEqual(FLOAT_STEP_GLIDE_MILLISECONDS + 500);
    }
  });
});

describe('shift 1 s part = 90 % of the wagon width (repair L3)', () => {
  test('one-wagon shift: after 1 s the train travelled 0.9 * wagon width, the rest of the pitch over 10 s', () => {
    const wagonWidth = 100;
    const pitch = 103;
    const shift: ShiftMotion = { from: 0, to: -pitch, startVelocity: 0, startAcceleration: 0, slowDistance: shiftSlowDistance(pitch, wagonWidth) };
    expect(sampleShift(shift, SHIFT_FAST_MILLISECONDS).position).toBeCloseTo(-90, 6);
    expect(sampleShift(shift, SHIFT_TOTAL_MILLISECONDS).position).toBe(-pitch);
    const before = sampleShift(shift, SHIFT_FAST_MILLISECONDS - 1e-6);
    const after = sampleShift(shift, SHIFT_FAST_MILLISECONDS + 1e-6);
    expect(after.velocity).toBeCloseTo(before.velocity, 8);
  });

  test('retarget keeps the slow distance as given', () => {
    const first: ShiftMotion = { from: 0, to: -103, startVelocity: 0, startAcceleration: 0, slowDistance: 13 };
    const next = retargetShift(first, 400, -206, 13);
    expect(next.slowDistance).toBe(13);
    expect(sampleShift(next, SHIFT_FAST_MILLISECONDS).position).toBeCloseTo(-193, 6);
  });
});

describe('finish timeline (repair M3)', () => {
  test('exit starts after the 0.5 s attach slide; "Hotovo" only after the 1 s exit ended (+150 ms)', () => {
    const timeline = finishTimeline();
    expect(timeline.exitStartMilliseconds).toBe(ATTACH_MILLISECONDS);
    expect(ATTACH_MILLISECONDS).toBe(500);
    expect(EXIT_MILLISECONDS).toBe(1000);
    expect(timeline.doneAfterExitStartMilliseconds).toBe(EXIT_MILLISECONDS + 150);
  });
});
