// Source-level wiring checks of app/train.tsx - `_LetterTraining_PROMPTS.md` / "## Follow-up prompt 10" (repair M3).
//
// The screen needs Reanimated, Gesture Handler, expo-router, expo-audio and the archive preloader; rendering it with
// react-test-renderer would mostly test mocks. The decisions are therefore pure helpers tested elsewhere
// (logic.test.ts: releaseReaction, configureWagonPan, selectionOutcome, shades; motion.test.ts: nextFloatStep,
// finishTimeline, exitEasing, shiftSlowDistance), and THIS file only checks (deliberately simple, text-based - brittle
// on refactors, update it with them) that the screen actually USES those helpers and the Reduce Motion opt-out.
//
// Remaining VISUAL-ONLY behaviours (not testable here, device-unverified): the real smoothness of the 1 px glides,
// the shade look (iOS glow / Android tint), the 0.5 s attach slide path, the 1 s shift feel, the exit leaving the
// screen, and whether a tap on the device really reaches onEnd with success (Gesture Handler runtime).

// The project has no Node type definitions (Expo app tsconfig) - minimal local typings for the jest (Node) runtime.
declare const __dirname: string;
const fileSystem = jest.requireActual('fs') as { readFileSync(path: string, encoding: 'utf8'): string };
const paths = jest.requireActual('path') as { join(...parts: string[]): string };

const source = fileSystem.readFileSync(paths.join(__dirname, '..', '..', '..', 'app', 'train.tsx'), 'utf8');

function count(pattern: RegExp): number {
  return (source.match(pattern) ?? []).length;
}

test('every withTiming opts out of the system Reduce Motion, and so do withDelay / withSequence', () => {
  const timings = count(/withTiming\(/g);
  expect(timings).toBeGreaterThan(0);
  expect(count(/reduceMotion: NEVER_REDUCED/g)).toBe(timings);
  // NEVER_REDUCED must itself be the real opt-out - with ReduceMotion.System the counts above would still pass.
  expect(source).toContain('const NEVER_REDUCED = ReduceMotion.Never;');
  expect(source).toMatch(/withSequence\(\s*NEVER_REDUCED,/);
  expect(source).toMatch(/withDelay\([\s\S]*?\),\s*NEVER_REDUCED\s*\)/);
});

test('the screen uses the tested helpers', () => {
  expect(source).toContain('configureWagonPan(Gesture.Pan(), enabled)');
  expect(source).toContain('releaseReaction(outcome, isDropHit(rectangle, zone), false).wiggle');
  expect(source).toContain("releaseReaction(outcome, false, isGameFinished(result.state)).follow === 'exit'");
  expect(source).toContain('finishTimeline().exitStartMilliseconds');
  expect(source).toContain('finishTimeline().doneAfterExitStartMilliseconds');
  expect(source).toContain('shiftSlowDistance(current.pitch, current.wagonWidth)');
  expect(source).toContain('nextFloatStep(state, FLOAT_AMPLITUDE_PIXELS, Math.random)');
  expect(source).toContain('floatStepInterval(Math.random)');
  // Pool wagons remount per play (shades reset instantly, repair L4).
  expect(source).toContain('key={`${play.id}:${letter}`}');
});
