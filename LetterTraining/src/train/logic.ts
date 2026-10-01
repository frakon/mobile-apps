// Pure logic of "Abecedový vlak" (alphabet train) - `_LetterTraining_PROMPTS.md` /
// "## Follow-up prompt 5 — new game "Abecedový vlak" (verbatim)", "## Q&A 6 — Abecedový vlak round 1",
// "## Q&A 7 — Abecedový vlak round 2".

export type TrainAlphabet = 'cz' | 'en';
export type TrainLetterCase = 'upper' | 'lower';

// "## Q&A 6": 34 letters incl. CH, with háčky but without čárky / kroužky and without Ě.
export const CZ_ALPHABET: readonly string[] = [
  'a', 'b', 'c', 'č', 'd', 'ď', 'e', 'f', 'g', 'h', 'ch', 'i', 'j', 'k', 'l', 'm', 'n', 'ň',
  'o', 'p', 'q', 'r', 'ř', 's', 'š', 't', 'ť', 'u', 'v', 'w', 'x', 'y', 'z', 'ž',
];
export const EN_ALPHABET: readonly string[] = 'abcdefghijklmnopqrstuvwxyz'.split('');

export const MINIMUM_WAITING_WAGONS = 4;
export const MAXIMUM_WAITING_WAGONS = 8;
// "## Q&A 7": default 6, remembered.
export const DEFAULT_WAITING_WAGONS = 6;

export function alphabetLetters(alphabet: TrainAlphabet): readonly string[] {
  return alphabet === 'en' ? EN_ALPHABET : CZ_ALPHABET;
}

export function letterLabel(letter: string, letterCase: TrainLetterCase): string {
  if (letterCase === 'lower') {
    return letter;
  }
  return letter === 'ch' ? 'CH' : letter.toLocaleUpperCase('cs-CZ');
}

export function clampWaitingWagons(value: number): number {
  if (!Number.isFinite(value)) {
    return DEFAULT_WAITING_WAGONS;
  }
  return Math.min(MAXIMUM_WAITING_WAGONS, Math.max(MINIMUM_WAITING_WAGONS, Math.round(value)));
}

export type RandomSource = () => number;

export function randomInt(maximumExclusive: number, random: RandomSource): number {
  return Math.min(maximumExclusive - 1, Math.floor(random() * maximumExclusive));
}

export function shuffle<T>(items: readonly T[], random: RandomSource): T[] {
  const result = [...items];
  for (let index = result.length - 1; index > 0; index--) {
    const other = randomInt(index + 1, random);
    [result[index], result[other]] = [result[other], result[index]];
  }
  return result;
}

export interface TrainGameState {
  readonly letters: readonly string[];
  // Number of letters already attached to the train (= index of the letter expected next).
  readonly placedCount: number;
  // Waiting wagons (letters) in display order, left to right.
  readonly pool: readonly string[];
  // Index (into letters) of the next letter not yet in the pool.
  readonly nextToAdd: number;
}

// "4-8 wagons with the next letters: randomly shuffled".
export function createTrainGame(letters: readonly string[], waitingWagons: number, random: RandomSource): TrainGameState {
  const count = Math.min(letters.length, clampWaitingWagons(waitingWagons));
  return { letters, placedCount: 0, pool: shuffle(letters.slice(0, count), random), nextToAdd: count };
}

export function expectedLetter(state: TrainGameState): string | null {
  return state.placedCount < state.letters.length ? state.letters[state.placedCount] : null;
}

export function isGameFinished(state: TrainGameState): boolean {
  return state.placedCount >= state.letters.length;
}

export interface PlacementResult {
  readonly state: TrainGameState;
  // Pool index where the next letter was inserted, or null when no letter was left to add.
  readonly insertedIndex: number | null;
  readonly insertedLetter: string | null;
}

// Correct letter -> attached; the next letter appears "in random position among the other wagons".
// Wrong letter (not the expected one) -> null (the wagon returns to its place).
export function placeLetter(state: TrainGameState, letter: string, random: RandomSource): PlacementResult | null {
  if (letter !== expectedLetter(state)) {
    return null;
  }
  const remaining = state.pool.filter((item) => item !== letter);
  let insertedIndex: number | null = null;
  let insertedLetter: string | null = null;
  let nextToAdd = state.nextToAdd;
  if (nextToAdd < state.letters.length) {
    insertedLetter = state.letters[nextToAdd];
    insertedIndex = randomInt(remaining.length + 1, random);
    remaining.splice(insertedIndex, 0, insertedLetter);
    nextToAdd += 1;
  }
  return { state: { letters: state.letters, placedCount: state.placedCount + 1, pool: remaining, nextToAdd }, insertedIndex, insertedLetter };
}

// Random wagon image per letter ("random wagon image per letter", evaluation Final decisions).
export function assignWagonImages(letters: readonly string[], imageCount: number, random: RandomSource): Record<string, number> {
  const result: Record<string, number> = {};
  for (const letter of letters) {
    result[letter] = imageCount > 0 ? randomInt(imageCount, random) : 0;
  }
  return result;
}

export interface Rectangle {
  x: number;
  y: number;
  width: number;
  height: number;
}

export function intersects(first: Rectangle, second: Rectangle): boolean {
  return first.x < second.x + second.width && second.x < first.x + first.width && first.y < second.y + second.height && second.y < first.y + first.height;
}

// "## Q&A 6": "placed if released over a large zone around the train's end".
// DECISION (not user-specified): the zone spans 1 wagon width left of the tail to 1.5 wagon widths right of it, and
// from 0.4 wagon height above the train top down to 0.6 wagon height below the train bottom.
export function dropZone(tailX: number, trainTop: number, trainHeight: number, wagonWidth: number, wagonHeight: number): Rectangle {
  return {
    x: tailX - wagonWidth,
    y: trainTop - wagonHeight * DROP_ZONE_ABOVE_FRACTION,
    width: wagonWidth * 2.5,
    height: trainHeight + wagonHeight * (DROP_ZONE_ABOVE_FRACTION + DROP_ZONE_BELOW_FRACTION),
  };
}

const DROP_ZONE_ABOVE_FRACTION = 0.4;
const DROP_ZONE_BELOW_FRACTION = 0.6;

// "even touch of the correct train wagon ... and releasing it places" - any overlap counts.
export function isDropHit(wagonRectangle: Rectangle, zone: Rectangle): boolean {
  return intersects(wagonRectangle, zone);
}

// Verification round 2 H1: a portrait-shaped board size is skipped only while the landscape lock is still pending;
// once it settled (applied, rejected or the grace period ran out) every size is laid out (portrait fallback).
export function shouldDeferBoardSize(width: number, height: number, lockSettled: boolean): boolean {
  return !lockSettled && width <= height;
}

export interface PoolLayout {
  readonly wagonWidth: number;
  readonly wagonHeight: number;
  readonly slotX: readonly number[];
  readonly rowY: number;
}

// Waiting wagons in one centred row ("## Q&A 6": "waiting wagons in one row below").
export function poolSlotPositions(boardWidth: number, count: number, wagonWidth: number, gap: number): number[] {
  const total = count * wagonWidth + Math.max(0, count - 1) * gap;
  const left = (boardWidth - total) / 2;
  return Array.from({ length: count }, (_, index) => left + index * (wagonWidth + gap));
}

// Wagon width that fits `maximumCount` wagons into the row and stays below the height limit.
export function wagonSize(boardWidth: number, boardHeight: number, maximumCount: number, gap: number, aspect: number): { width: number; height: number } {
  const byWidth = (boardWidth - 2 * gap - (maximumCount - 1) * gap) / maximumCount;
  const byHeight = boardHeight * 0.3 * aspect;
  const width = Math.max(40, Math.min(byWidth, byHeight));
  return { width, height: width / aspect };
}

export interface VehicleShape {
  // width / height
  readonly aspect: number;
  // wheel baseline as a fraction of the height from the top
  readonly baseline: number;
}

export interface TrainLayout {
  width: number;
  height: number;
  wagonWidth: number;
  // Height of the TALLEST real wagon at wagonWidth (drop zone + drop outline; individual wagons use their own aspect).
  wagonHeight: number;
  gap: number;
  engineWidth: number;
  engineHeight: number;
  trainTop: number;
  trainRail: number;
  poolRail: number;
  pitch: number;
}

export interface TrainLayoutOptions {
  // Aspect the engine height is derived from (engine art is 1.2x the 300 px wagon art height, manifest "_doc").
  readonly referenceWagonAspect: number;
  readonly couplingGap: number;
  // Wagon scale while dragged and floating amplitude: the dragged rectangle can reach this much higher.
  readonly dragScale: number;
  readonly floatAmplitude: number;
  // Guaranteed vertical gap between the drop zone bottom and the top of any waiting wagon at rest.
  readonly minimumPoolGap: number;
}

// Board layout (pure). The wagon width is additionally limited so that the drop zone never reaches the pool row
// (verification round 1 H1: a tap must never attach a wagon) - computed with the REAL wagon shapes.
export function computeTrainLayout(
  width: number,
  height: number,
  waitingWagons: number,
  engine: VehicleShape,
  wagonShapes: readonly VehicleShape[],
  options: TrainLayoutOptions
): TrainLayout {
  // Verification round 3 M1: on a narrow (portrait fallback) board the gap shrinks (min 4 px) so the pool row fits.
  const preferredGap = Math.max(10, width * 0.015);
  const gap = Math.max(4, Math.min(preferredGap, (width - waitingWagons * 30) / (waitingWagons + 1)));
  const shapes = wagonShapes.length > 0 ? wagonShapes : [{ aspect: options.referenceWagonAspect, baseline: 1 }];
  const tallestPerWidth = Math.max(...shapes.map((shape) => 1 / shape.aspect));
  // Rest top of a waiting wagon (incl. drag scale) lies (baseline + (scale - 1) / 2) * height above the pool rail.
  const poolReachPerWidth = Math.max(...shapes.map((shape) => (shape.baseline + (options.dragScale - 1) / 2) / shape.aspect));
  const enginePerWidth = 1.2 / options.referenceWagonAspect;
  const trainTop = height * 0.05;
  const poolRail = height - Math.max(16, height * 0.1);
  const maximumByGap =
    (poolRail - trainTop - options.floatAmplitude - options.minimumPoolGap) /
    (enginePerWidth + DROP_ZONE_BELOW_FRACTION * tallestPerWidth + poolReachPerWidth);
  const size = wagonSize(width, height, waitingWagons, gap, options.referenceWagonAspect);
  // The row (incl. a side gap) never exceeds the board width - wagonSize clamps to >= 40 px (verification round 3 M1).
  const maximumByRow = (width - (waitingWagons + 1) * gap) / waitingWagons;
  const wagonWidth = Math.min(size.width, maximumByGap, maximumByRow);
  const engineHeight = wagonWidth * enginePerWidth;
  return {
    width,
    height,
    wagonWidth,
    wagonHeight: wagonWidth * tallestPerWidth,
    gap,
    engineWidth: engineHeight * engine.aspect,
    engineHeight,
    trainTop,
    trainRail: trainTop + engineHeight * engine.baseline,
    poolRail,
    pitch: wagonWidth + options.couplingGap,
  };
}

// "## Follow-up prompt 10": shades around waiting wagons. A wrong selection (tap, touch or drag-and-release) flashes a
// reddish shade around that wagon (fades out over 2 s - the serial restarts the fade) and at the same time a green
// shade appears around the correct wagon, permanent until that wagon gets connected.
export const RED_SHADE_FADE_MILLISECONDS = 2000;

export interface ShadeState {
  // Letter of the waiting wagon with the permanent green shade, or null.
  readonly green: string | null;
  // Latest wrong selection; `serial` grows with every wrong selection (also of the same wagon).
  readonly red: { readonly letter: string; readonly serial: number } | null;
}

export const NO_SHADES: ShadeState = { green: null, red: null };

export function shadesAfterWrongSelection(shades: ShadeState, wrongLetter: string, expected: string | null): ShadeState {
  return { green: expected, red: { letter: wrongLetter, serial: (shades.red?.serial ?? 0) + 1 } };
}

export function shadesAfterConnect(shades: ShadeState, connectedLetter: string): ShadeState {
  return { green: shades.green === connectedLetter ? null : shades.green, red: shades.red?.letter === connectedLetter ? null : shades.red };
}

export type SelectionOutcome = 'connect' | 'wrong' | 'ignored';

// "## Follow-up prompt 10": "the correct wagon ... does not need to be dragged to the target area: it is completely
// enough when it is touched (pressed and released or tapped)" - any release of the expected letter connects it,
// wherever it was released; any release of another letter is a wrong selection.
export function selectionOutcome(state: TrainGameState, letter: string, playing: boolean): SelectionOutcome {
  if (!playing || isGameFinished(state)) {
    return 'ignored';
  }
  return letter === expectedLetter(state) ? 'connect' : 'wrong';
}

// What the train does after a release (repair M3: the wiring decisions of train.tsx handleRelease, testable).
// - wrong: wiggle ONLY when released in the drop zone (DECISION, "## Q&A 7"), the wagon slides back;
// - connect, not the last letter: the train shifts one wagon left;
// - connect, the last letter: NO shift - the exit starts after the attach slide (finishTimeline in motion.ts).
export type TrainReaction = { readonly wiggle: boolean; readonly follow: 'none' | 'shift' | 'exit' };

export function releaseReaction(outcome: SelectionOutcome, releasedInDropZone: boolean, finishedAfterConnect: boolean): TrainReaction {
  if (outcome === 'wrong') {
    return { wiggle: releasedInDropZone, follow: 'none' };
  }
  if (outcome === 'connect') {
    return { wiggle: false, follow: finishedAfterConnect ? 'exit' : 'shift' };
  }
  return { wiggle: false, follow: 'none' };
}

// Pan configuration of a waiting wagon (repair M3: testable without the gesture handler). minDistance(0) makes the
// pan activate on a mere touch, so a tap reaches onEnd as a successful release ("## Follow-up prompt 10": touch /
// tap selects); maxPointers(1): one finger per wagon.
export interface WagonPanConfigurable<T> {
  runOnJS(value: boolean): T;
  enabled(value: boolean): T;
  minDistance(value: number): T;
  maxPointers(value: number): T;
}

export function configureWagonPan<T extends WagonPanConfigurable<T>>(gesture: T, enabled: boolean): T {
  return gesture.runOnJS(true).enabled(enabled).minDistance(0).maxPointers(1);
}
