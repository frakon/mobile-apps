// Pure logic of the "Skládání slov" (word composing) game - `_LetterTraining_PROMPTS.md` /
// "## Follow-up prompt 4 — new game "Skládání slov" (verbatim)", "## Q&A 4 — Skládání slov round 1" and
// "## Q&A 5 — Skládání slov round 2". No React / native imports so everything is unit-testable with jest.

import { AudioResource, PRELOAD_ROUNDS_AHEAD, RandomSource, shuffled, syllableAudioResource, wordArchivePath } from '../wordStarts/logic';
import { WordEntry, WordStartsDataset } from '../wordStarts/types';

export type ComposeVariant = 'letters' | 'syllables';

// "## Q&A 5": tile case chooseable in the game settings (CAPITALS, lower_case).
export type TileCase = 'upper' | 'lower';

// "## Q&A 4": 10 rounds + results page.
export const COMPOSE_ROUNDS_PER_PLAY = 10;

// "## Q&A 4": letter variant 3–8 letters (one row, portrait). Evaluator default (Q&A 5, not objected): syllable
// variant 2–5 syllables.
export const MIN_LETTER_TILES = 3;
export const MAX_LETTER_TILES = 8;
export const MIN_SYLLABLE_TILES = 2;
export const MAX_SYLLABLE_TILES = 5;

export interface ComposeTile {
  // Index in the shuffled tiles row (stable identity of the tile within a round).
  readonly id: number;
  // Lowercase letter ("ch" is one letter) or syllable.
  readonly value: string;
}

export interface ComposeRound {
  readonly variant: ComposeVariant;
  readonly word: WordEntry;
  // Expected value of each placeholder box, in word order.
  readonly slots: readonly string[];
  // Tiles in their (shuffled) display order; tiles[i].id === i.
  readonly tiles: readonly ComposeTile[];
  // Initial arrow tile (the screen uses arrowSourceTileId, which follows placements): a tile whose value is the word's first letter/syllable ("## Follow-up prompt 4": arrow
  // from the letter on which the word begins to the first box).
  readonly arrowTileId: number;
}

// Czech letters of a word, "ch" as ONE letter (Czech alphabet). Lowercase NFC.
export function splitLetters(word: string): string[] {
  const characters = Array.from(word.normalize('NFC').toLocaleLowerCase('cs-CZ'));
  const letters: string[] = [];
  for (let index = 0; index < characters.length; index++) {
    if (characters[index] === 'c' && characters[index + 1] === 'h') {
      letters.push('ch');
      index++;
    } else {
      letters.push(characters[index]);
    }
  }
  return letters;
}

// Values of the placeholder boxes for a word in a variant.
export function slotValues(word: WordEntry, variant: ComposeVariant): string[] {
  return variant === 'letters' ? splitLetters(word.word) : word.syllables.map((syllable) => syllable.toLocaleLowerCase('cs-CZ'));
}

// Words usable by a variant: letters 3–8 tiles; syllables 2–5 syllables, the syllables must spell the word, and words
// with a disputed syllabification (excludeLevel2, e.g. ob-raz) are skipped (evaluator default in "## Q&A 5").
// Only words of src/words.ts are used = only words with an ACCEPTED picture.
export function composeEligibleWords(words: readonly WordEntry[], variant: ComposeVariant): WordEntry[] {
  if (variant === 'letters') {
    return words.filter((entry) => {
      const count = splitLetters(entry.word).length;
      return count >= MIN_LETTER_TILES && count <= MAX_LETTER_TILES;
    });
  }
  return words.filter(
    (entry) =>
      !entry.excludeLevel2 &&
      entry.syllables.length >= MIN_SYLLABLE_TILES &&
      entry.syllables.length <= MAX_SYLLABLE_TILES &&
      entry.syllables.join('').toLocaleLowerCase('cs-CZ') === entry.word.toLocaleLowerCase('cs-CZ')
  );
}

// Shuffled tiles; the shuffled order differs from the word order whenever possible (otherwise the word would already
// be spelled in the tiles row). Up to 20 reshuffles, then a rotation by one as the fallback.
export function shuffleTiles(values: readonly string[], random: RandomSource = Math.random): string[] {
  const isWordOrder = (candidate: readonly string[]) => candidate.every((value, index) => value === values[index]);
  if (new Set(values).size < 2) {
    return [...values]; // every order looks the same
  }
  for (let attempt = 0; attempt < 20; attempt++) {
    const candidate = shuffled(values, random);
    if (!isWordOrder(candidate)) {
      return candidate;
    }
  }
  return [...values.slice(1), values[0]];
}

export function buildComposeRound(word: WordEntry, variant: ComposeVariant, random: RandomSource = Math.random): ComposeRound {
  const slots = slotValues(word, variant);
  const tiles = shuffleTiles(slots, random).map((value, id) => ({ id, value }));
  const arrowTileId = tiles.find((tile) => tile.value === slots[0])!.id;
  return { variant, word, slots, tiles, arrowTileId };
}

// 10 rounds of eligible words in random order (repeats only when there are fewer eligible words than rounds; never
// the same word twice in a row when avoidable). Empty -> [].
export function buildComposePlan(
  words: readonly WordEntry[],
  variant: ComposeVariant,
  random: RandomSource = Math.random,
  roundCount: number = COMPOSE_ROUNDS_PER_PLAY
): ComposeRound[] {
  const eligible = composeEligibleWords(words, variant);
  if (eligible.length === 0) {
    return [];
  }
  const sequence: WordEntry[] = [];
  while (sequence.length < roundCount) {
    const batch = shuffled(eligible, random);
    if (batch.length > 1 && sequence.length > 0 && sequence[sequence.length - 1].id === batch[0].id) {
      [batch[0], batch[batch.length - 1]] = [batch[batch.length - 1], batch[0]];
    }
    sequence.push(...batch);
  }
  return sequence.slice(0, roundCount).map((word) => buildComposeRound(word, variant, random));
}

// "## Q&A 5": CAPITALS ("CH", "KOČ") or lower_case ("ch", "koč").
export function tileLabel(value: string, tileCase: TileCase): string {
  return tileCase === 'upper' ? value.toLocaleUpperCase('cs-CZ') : value.toLocaleLowerCase('cs-CZ');
}

// Sound of a tile, spoken once at drag start ("## Q&A 4"): letter NAME (as Level 1, bundled) / the syllable (backend
// archive) — archive model of `_LetterTraining_PROMPTS.md` / "## Follow-up prompt 9 — mobile-apps-preferences".
export function tileAudioResource(variant: ComposeVariant, value: string, dataset: WordStartsDataset): AudioResource | undefined {
  if (variant === 'letters') {
    const module = dataset.letterAudio[value];
    return module === undefined ? undefined : { kind: 'bundled', module };
  }
  return syllableAudioResource(value, dataset);
}

// EXACTLY the backend archives a round can use: the word's zip (picture + plain word audio — evaluator default (Q&A 5):
// both variants play the plain word) and, for the syllables variant, the syllable-group zips of every tile.
export function collectComposeArchives(round: ComposeRound, dataset: WordStartsDataset): string[] {
  const archives: string[] = [wordArchivePath(round.word)];
  for (const tile of round.tiles) {
    const resource = tileAudioResource(round.variant, tile.value, dataset);
    if (resource !== undefined && resource.kind === 'archive' && !archives.includes(resource.archivePath)) {
      archives.push(resource.archivePath);
    }
  }
  return archives;
}

// Preload window (preferences skill: current round + next 5 rounds hot in memory) — compose equivalent of
// wordStarts/logic.ts collectPreloadWindowArchives.
export function collectComposePreloadArchives(
  plan: readonly ComposeRound[],
  roundIndex: number,
  dataset: WordStartsDataset,
  ahead: number = PRELOAD_ROUNDS_AHEAD
): string[] {
  const archives: string[] = [];
  for (let index = roundIndex; index <= roundIndex + ahead && index < plan.length; index++) {
    for (const archivePath of collectComposeArchives(plan[index], dataset)) {
      if (!archives.includes(archivePath)) {
        archives.push(archivePath);
      }
    }
  }
  return archives;
}

// ---- Drop resolution ("## Follow-up prompt 4": any intersection counts; duplicates interchangeable) ----

export interface Rectangle {
  readonly x: number;
  readonly y: number;
  readonly width: number;
  readonly height: number;
}

export function intersectionArea(first: Rectangle, second: Rectangle): number {
  const width = Math.min(first.x + first.width, second.x + second.width) - Math.max(first.x, second.x);
  const height = Math.min(first.y + first.height, second.y + second.height) - Math.max(first.y, second.y);
  return width > 0 && height > 0 ? width * height : 0;
}

// filledSlots[i] = id of the tile placed in box i, or null when empty.
// A box is eligible for a tile when it is still empty and expects the tile's value (same letters/syllables are
// interchangeable - "make the same letters interchangeable").
export function eligibleSlots(round: ComposeRound, filledSlots: readonly (number | null)[], tileId: number): number[] {
  const value = round.tiles[tileId].value;
  const result: number[] = [];
  round.slots.forEach((slotValue, index) => {
    if (filledSlots[index] === null && slotValue === value) {
      result.push(index);
    }
  });
  return result;
}

// The box a released tile snaps into: among the eligible boxes with ANY (positive-area) intersection, the one with the
// largest overlap (evaluator default in "## Q&A 5"); null = slide back.
export function resolveDrop(
  round: ComposeRound,
  filledSlots: readonly (number | null)[],
  tileId: number,
  tileRectangle: Rectangle,
  slotRectangles: readonly Rectangle[]
): number | null {
  let best: number | null = null;
  let bestArea = 0;
  for (const slotIndex of eligibleSlots(round, filledSlots, tileId)) {
    const area = intersectionArea(tileRectangle, slotRectangles[slotIndex]);
    if (area > bestArea) {
      bestArea = area;
      best = slotIndex;
    }
  }
  return best;
}

export function isWordComplete(filledSlots: readonly (number | null)[]): boolean {
  return filledSlots.length > 0 && filledSlots.every((tileId) => tileId !== null);
}

// ---- Layout (one row of tiles, one row of boxes, same x positions) ----

export interface ComposeLayout {
  readonly tileWidth: number;
  readonly tileHeight: number;
  readonly gap: number;
  // Left x of tile / box column i.
  readonly columnX: readonly number[];
  readonly tilesRowY: number;
  readonly slotsRowY: number;
  // Top-left of the ✓ shown when the word is complete: directly above the LAST box, in the arrow gap between the
  // tiles row and the boxes row - that area is empty at completion (all tiles are in the boxes, the arrow is hidden once
  // box 1 is filled), so no width is reserved and tiles keep full size (verification compose R2 N1/N3).
  readonly checkmarkX: number;
  readonly checkmarkY: number;
  readonly totalHeight: number;
}

// Size of the ✓ glyph box.
export const CHECKMARK_SIZE = 44;
// Minimum distance of the leftmost / rightmost tile from the board edge (verification compose R1 LOW).
export const BOARD_SIDE_MARGIN = 10;
const MIN_TILE_WIDTH = 24;
// Vertical room between the tiles row and the boxes row (arrow; at completion the ✓).
const ARROW_GAP = 64;

export function computeLayout(containerWidth: number, count: number, variant: ComposeVariant): ComposeLayout {
  const gap = variant === 'letters' ? 8 : 10;
  const maximumWidth = variant === 'letters' ? 64 : 110;
  const safeCount = Math.max(1, count);
  const tileWidth = Math.max(
    MIN_TILE_WIDTH,
    Math.min(maximumWidth, (containerWidth - 2 * BOARD_SIDE_MARGIN - gap * (safeCount - 1)) / safeCount)
  );
  const tileHeight = variant === 'letters' ? Math.min(72, tileWidth * 1.15) : 64;
  const rowWidth = count * tileWidth + (count - 1) * gap;
  const left = Math.max(BOARD_SIDE_MARGIN, (containerWidth - rowWidth) / 2); // boxes centred
  const columnX = Array.from({ length: count }, (_, index) => left + index * (tileWidth + gap));
  const tilesRowY = 4;
  const slotsRowY = tilesRowY + tileHeight + ARROW_GAP;
  const lastColumnCenter = left + (count - 1) * (tileWidth + gap) + tileWidth / 2;
  const checkmarkX = Math.min(containerWidth - CHECKMARK_SIZE, Math.max(0, lastColumnCenter - CHECKMARK_SIZE / 2));
  const checkmarkY = slotsRowY - CHECKMARK_SIZE - (ARROW_GAP - CHECKMARK_SIZE) / 2;
  const totalHeight = slotsRowY + tileHeight + 8;
  return { tileWidth, tileHeight, gap, columnX, tilesRowY, slotsRowY, checkmarkX, checkmarkY, totalHeight };
}

// Arrow source (verification compose R1 M1): the first NOT yet placed tile whose value equals box 1's value; null when
// box 1 is already filled (arrow hidden) or no such tile is left. `draggedTileId` (verification compose R2 N4): the tile
// being dragged is skipped, so the arrow re-anchors to another matching unplaced tile or is hidden during the drag.
export function arrowSourceTileId(
  round: ComposeRound,
  filledSlots: readonly (number | null)[],
  draggedTileId: number | null = null
): number | null {
  if (filledSlots[0] !== null && filledSlots[0] !== undefined) {
    return null;
  }
  const tile = round.tiles.find(
    (candidate) => candidate.value === round.slots[0] && candidate.id !== draggedTileId && !filledSlots.includes(candidate.id)
  );
  return tile === undefined ? null : tile.id;
}

// The rectangle as drawn with a centred `scale` transform (verification compose R1 LOW: hit-test the visible tile).
export function scaleRectangle(rectangle: Rectangle, scale: number): Rectangle {
  const width = rectangle.width * scale;
  const height = rectangle.height * scale;
  return { x: rectangle.x - (width - rectangle.width) / 2, y: rectangle.y - (height - rectangle.height) / 2, width, height };
}

// A failed release lying mostly (> 50 % of the tile) on its own home spot is not a wrong drop (verification compose R1 LOW).
export function isReleasedOnHome(tileRectangle: Rectangle, homeRectangle: Rectangle): boolean {
  return intersectionArea(tileRectangle, homeRectangle) > 0.5 * homeRectangle.width * homeRectangle.height;
}

// ---- Scoring ("## Q&A 4": round correct only if there was no wrong drop) ----

export interface ComposeProgress {
  readonly roundIndex: number;
  readonly wrongDropInRound: boolean;
  readonly correctRounds: number;
}

export const INITIAL_COMPOSE_PROGRESS: ComposeProgress = { roundIndex: 0, wrongDropInRound: false, correctRounds: 0 };

export function recordWrongDrop(progress: ComposeProgress): ComposeProgress {
  return { ...progress, wrongDropInRound: true };
}

// Word completed: count the round when it had no wrong drop, move to the next round.
export function completeRound(progress: ComposeProgress): ComposeProgress {
  return {
    roundIndex: progress.roundIndex + 1,
    wrongDropInRound: false,
    correctRounds: progress.correctRounds + (progress.wrongDropInRound ? 0 : 1),
  };
}
