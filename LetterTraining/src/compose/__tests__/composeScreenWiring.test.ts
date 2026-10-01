// Source-level wiring checks of app/compose.tsx (modeled on src/train/__tests__/trainScreenWiring.test.ts) -
// `_LetterTraining_PROMPTS.md` / "## Follow-up prompt 11", "## Q&A 11", "## Q&A 5".
//
// The screen needs Reanimated, Gesture Handler, expo-router and expo-audio; the decisions are pure helpers tested in
// logic.test.ts, and THIS file only checks (deliberately simple, text-based - brittle on refactors, update it with them)
// that the screen actually wires them. Device-visual behaviour (slide look, ✓ timing feel, shade look) stays unverified.

declare const __dirname: string;
const fileSystem = jest.requireActual('fs') as { readFileSync(path: string, encoding: 'utf8'): string };
const paths = jest.requireActual('path') as { join(...parts: string[]): string };

const source = fileSystem.readFileSync(paths.join(__dirname, '..', '..', '..', 'app', 'compose.tsx'), 'utf8');

function count(pattern: RegExp): number {
  return (source.match(pattern) ?? []).length;
}

test('every withTiming opts out of the system Reduce Motion', () => {
  const timings = count(/withTiming\(/g);
  expect(timings).toBeGreaterThan(0);
  expect(count(/reduceMotion: NEVER_REDUCED/g)).toBe(timings);
  expect(source).toContain('const NEVER_REDUCED = ReduceMotion.Never;');
});

test('release wiring: resolveDrop -> composeSelectionOutcome; the wrong path records a wrong drop (Q&A 11 "Wrong tap counts too")', () => {
  expect(source).toContain('const directHitSlot = resolveDrop(currentRound, filledRef.current, tileId, tileRectangle, slotRectangles);');
  expect(source).toContain('composeSelectionOutcome(currentRound, filledRef.current, tileId, directHitSlot, !completed)');
  const wrongBranch = source.match(/if \(outcome\.kind === 'wrong'\) \{([\s\S]*?)return null;/);
  expect(wrongBranch).not.toBeNull();
  expect(wrongBranch![1]).toContain('recordWrongDrop(progressRef.current)');
  expect(wrongBranch![1]).toContain('setProgress(next)');
  expect(wrongBranch![1]).toContain('composeShadesAfterWrongSelection(');
  // recordWrongDrop is used only in that branch.
  expect(count(/recordWrongDrop\(/g)).toBe(1);
  expect(source).toContain('composeShadesAfterPlacement(previous, tileId, currentRound, nextFilled)');
});

test('completion starts when the last tile lands (repair M1), not at release', () => {
  expect(source).toContain('const PLACE_MILLISECONDS = ATTACH_MILLISECONDS;');
  expect(source).toContain('const COMPLETION_START_AFTER_RELEASE_MILLISECONDS = PLACE_MILLISECONDS;');
  expect(source).toContain('const FEEDBACK_DURATION_MILLISECONDS = 500;');
  expect(source).toContain('timers.current.push(setTimeout(landed, COMPLETION_START_AFTER_RELEASE_MILLISECONDS));');
  // startCompletion is only called from the landing callback (no direct call at release).
  expect(count(/startCompletion\(\);/g)).toBe(1);
  expect(source).toMatch(/const landed = \(\) => \{\s*pendingCompletion\.current = null;\s*startCompletion\(\);/);
  // Leaving the screen mid-slide must still complete the round (cleanup runs the pending completion),
  // otherwise all boxes end up filled with the round never marked complete - stuck for good.
  expect(source).toContain('landingCompletion?.();');
  expect(source).toContain('|| landingCompletion !== null');
  // Every placement (direct hit or auto-place) slides with PLACE_MILLISECONDS.
  expect(count(/duration: PLACE_MILLISECONDS/g)).toBe(2);
});

test('shades reset on a new round and on a new play (repair test gap d)', () => {
  // restart() and the completion advance() both reset the shades.
  expect(count(/setShades\(NO_COMPOSE_SHADES\);/g)).toBe(2);
  expect(source).toMatch(/const restart = useCallback\(\(\) => \{[\s\S]*?setShades\(NO_COMPOSE_SHADES\);[\s\S]*?\}, \[/);
  expect(source).toMatch(/const advance = \(\) => \{[\s\S]*?setShades\(NO_COMPOSE_SHADES\);[\s\S]*?\};/);
});

test('tap OR drag: a pure tap (no move) selects via a raced Tap; sound at touch-down ("## Bug report 13")', () => {
  // A Pan activates only on a move (RNPanHandler.m interactionsMoved), so a tap without move needs the Tap gesture.
  expect(source).toContain('const drag = configureWagonPan(Gesture.Pan(), enabled)');
  expect(source).toContain('const tap = configureSelectTap(Gesture.Tap(), enabled).onEnd(');
  expect(source).toContain('return Gesture.Race(drag, tap);');
  expect(source).toMatch(/const tap = [\s\S]*?if \(success\) \{\s*release\(true, 1\);/);
  // The tile sound starts at touch-down (onBegin fires for a tap AND a drag), not at pan activation.
  expect(source).toMatch(/\.onBegin\(\(\) => \{[\s\S]*?callbacks\.current\.onDragStart\(tileId\);/);
  expect(count(/onDragStart\(tileId\)/g)).toBe(1);
  // Both the drag release and the tap go through the one release path (-> handleRelease, wrong-tap counting).
  expect(source).toContain('.onEnd((_event, success) => release(success, DRAG_SCALE))');
  expect(count(/current\.onRelease\(tileId, rectangle\)/g)).toBe(1);
});
