// Tests of the train shift easing / retarget math - `_LetterTraining_PROMPTS.md` / "## Follow-up prompt 5" (90 % in 1 s,
// last 10 % over 10 s, continuous incl. acceleration; retarget on a new placement).

import { SHIFT_TOTAL_MILLISECONDS, ShiftMotion, easeInOutCubic, retargetShift, sampleShift } from '../motion';

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
