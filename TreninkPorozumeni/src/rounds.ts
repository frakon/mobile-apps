// Round-plan building per field and regime (see _TreninkPorozumeni_SPEC.md, section "Rounds"
// and _TreninkPorozumeni_Fields123_PROMPTS.md for the 2-image/4-image regime request):
// filter examples by field, split into sub-test parts of 10 ("User follow-up request 21"),
// shuffle within the part, one round per example; each round shows the target
// plus the grammatical distractor (2-image regime) or plus all three distractors (4-image regime)
// in random positions.

import { AudioSource } from 'expo-audio';
import { ComprehensionExample, comprehensionExamples, FieldId, SwappedVariant } from './items';
import { ImageSourcePropType } from 'react-native';

export type Regime = 2 | 4;

// Test group (test set) of 10 ("User follow-up request 21", generalised by "User request 25"
// in _TreninkPorozumeni_Fields123_PROMPTS.md: up to 100 items per type, groups 1–10 … 91–100):
// each field's examples are split DETERMINISTICALLY by their src/items.ts order into
// group 1 = examples 1–10, group 2 = 11–20, …; shuffling happens only WITHIN a group.
// A group number is 1-based; the number of groups is derived from the item count.
export type TestPart = number;

export const EXAMPLES_PER_TEST_PART = 10;
export const MAX_TEST_PARTS = 10;

// Extra category (_TreninkPorozumeni_Fields123_PROMPTS.md, "User request 27" — never delete good items,
// put them to an Extra category behind 1–10 … 91–100 — and "User request 28" Q1–Q5): items flagged
// `extra: true` are NOT part of the regular 1–100; they are played as Extra groups of 10, reached via ONE
// "Extra" tile + sub-screen (Q1), shown only for types that have extras (Q2), exempt from the ratio rules
// (Q3), in a SEEDED shuffle order (Q4), and tracked like any other part incl. pause/resume (Q5).
// Extra group g (1-based) is encoded as part number EXTRA_PART_OFFSET + g (11, 12, …), so the plain
// numeric TestPart of the paused/resume state works unchanged.
export const EXTRA_PART_OFFSET = MAX_TEST_PARTS;

function examplesForField(field: FieldId): ComprehensionExample[] {
  return comprehensionExamples.filter((example) => example.field === field);
}

// Regular items 1–100 of a field (Extra items excluded), in items.ts order.
function regularExamplesForField(field: FieldId): ComprehensionExample[] {
  return examplesForField(field)
    .filter((example) => example.extra !== true)
    .slice(0, MAX_TEST_PARTS * EXAMPLES_PER_TEST_PART);
}

// Seeded, STABLE Extra order (Q4; coordinator decision R2-A): every Extra item gets a sort key = FNV-1a hash of
// "<field id>:<item id>" mixed by one mulberry32 step; items are ordered by that key (ties by id). The order
// is identical on every app start, and adding an item only inserts it — the relative order of the existing
// Extra items never changes (a Fisher-Yates over the whole list would reshuffle all groups on every addition).
function extraSortKey(field: FieldId, id: string): number {
  const key = `${field}:${id}`;
  let hash = 0x811c9dc5;
  for (let index = 0; index < key.length; index++) {
    hash = Math.imul(hash ^ key.charCodeAt(index), 0x01000193) >>> 0;
  }
  let value = (hash + 0x6d2b79f5) >>> 0;
  value = Math.imul(value ^ (value >>> 15), value | 1);
  value ^= value + Math.imul(value ^ (value >>> 7), value | 61);
  return (value ^ (value >>> 14)) >>> 0;
}

// Extra items of a field in their seeded stable order (empty when the type has no extras).
export function extraExamplesForField(field: FieldId): ComprehensionExample[] {
  return examplesForField(field)
    .filter((example) => example.extra === true)
    .map((example) => ({ example, key: extraSortKey(field, example.id) }))
    .sort((a, b) => a.key - b.key || (a.example.id < b.example.id ? -1 : a.example.id > b.example.id ? 1 : 0))
    .map((entry) => entry.example);
}

// Number of existing regular groups of a field (0 = empty type), capped at 10 (items 1–100).
export function testPartCount(field: FieldId): number {
  return Math.ceil(regularExamplesForField(field).length / EXAMPLES_PER_TEST_PART);
}

// Number of Extra groups of 10 (0 = no Extra tile, Q2).
export function extraTestPartCount(field: FieldId): number {
  return Math.ceil(extraExamplesForField(field).length / EXAMPLES_PER_TEST_PART);
}

export function isExtraTestPart(part: TestPart): boolean {
  return part > EXTRA_PART_OFFSET;
}

// Part numbers of the Extra sub-screen (11, 12, …).
export function extraTestParts(field: FieldId): TestPart[] {
  return Array.from({ length: extraTestPartCount(field) }, (_, index) => EXTRA_PART_OFFSET + index + 1);
}

// A regular group 1..testPartCount or an Extra group 11..10+extraTestPartCount.
export function isValidTestPart(field: FieldId, part: TestPart): boolean {
  if (!Number.isInteger(part) || part < 1) {
    return false;
  }
  return isExtraTestPart(part) ? part - EXTRA_PART_OFFSET <= extraTestPartCount(field) : part <= testPartCount(field);
}

// "1–10", "11–20", … ; Extra groups "Extra 1–10", "Extra 11–20", … — the last group shows its real end when it is not full.
export function testPartRangeLabel(field: FieldId, part: TestPart): string {
  const groupIndex = isExtraTestPart(part) ? part - EXTRA_PART_OFFSET : part;
  const first = (groupIndex - 1) * EXAMPLES_PER_TEST_PART + 1;
  const last = first - 1 + examplesForTestPart(field, part).length;
  return `${isExtraTestPart(part) ? 'Extra ' : ''}${first}–${last}`;
}

// The examples of one sub-test (field + part), pre-shuffle: regular groups in the fixed items.ts order,
// Extra groups in the seeded Extra order.
export function examplesForTestPart(field: FieldId, part: TestPart): ComprehensionExample[] {
  if (!isValidTestPart(field, part)) {
    return [];
  }
  const extra = isExtraTestPart(part);
  const startIndex = ((extra ? part - EXTRA_PART_OFFSET : part) - 1) * EXAMPLES_PER_TEST_PART;
  const source = extra ? extraExamplesForField(field) : regularExamplesForField(field);
  return source.slice(startIndex, startIndex + EXAMPLES_PER_TEST_PART);
}

// Variant chosen for one play of an example ("User request 25"): 1 = the base fields,
// 2 = example.swappedVariant (target and grammatical-distractor PICTURES exchanged).
export type VariantNumber = 1 | 2;

// 50/50 per example among the variants it has; `random` injectable for sanity checks.
export function pickVariant(example: ComprehensionExample, random: () => number = Math.random): VariantNumber {
  if (example.swappedVariant === undefined) {
    return 1;
  }
  return random() < 0.5 ? 1 : 2;
}

// Which picture occupies a display slot — needed to map a tapped wrong picture to its
// "why it is wrong" explanation (see _TreninkPorozumeni_Fields123_PROMPTS.md, section
// "User follow-up request — spoken explanation of a wrong picture").
export type SlotKind = 'target' | 'grammatical' | 'lexicalA' | 'lexicalB';

export interface RoundSlot {
  image: ImageSourcePropType;
  kind: SlotKind;
}

export interface GameRound {
  example: ComprehensionExample;
  // Drawn once when the plan is built; stored in the plan so pause/resume keeps it.
  variant: VariantNumber;
  // Slots in display order (length 2 or 4); the correct (target) image is at correctIndex.
  slots: RoundSlot[];
  correctIndex: number;
}

// Sentence audio of the round's chosen variant ("User request 25").
export function sentenceAudioForRound(round: GameRound): AudioSource {
  return round.variant === 2 && round.example.swappedVariant !== undefined
    ? round.example.swappedVariant.audio
    : round.example.audio;
}

// Explanation (text + optional audio) for a tapped wrong slot of the round's chosen variant;
// null for the target slot. Slot kinds are relative to the variant (in variant 2 the
// 'grammatical' slot shows the base target picture and gets the variant-2 explanation).
export function explanationForSlot(
  round: GameRound,
  kind: SlotKind
): { text: string; audio: AudioSource | null } | null {
  const example: ComprehensionExample | SwappedVariant =
    round.variant === 2 && round.example.swappedVariant !== undefined ? round.example.swappedVariant : round.example;
  switch (kind) {
    case 'grammatical':
      return {
        text: example.grammaticalDistractorExplanation,
        audio: example.grammaticalDistractorExplanationAudio,
      };
    case 'lexicalA':
      return {
        text: example.lexicalDistractorAExplanation,
        audio: example.lexicalDistractorAExplanationAudio,
      };
    case 'lexicalB':
      return {
        text: example.lexicalDistractorBExplanation,
        audio: example.lexicalDistractorBExplanationAudio,
      };
    case 'target':
      return null;
  }
}

// Per-round resources come from the ResourceBackend per-item archives (src/itemResources.ts; the Metro
// prefetch of "User follow-up request 16" was replaced by the 5-round archive preload of
// _TreninkPorozumeni_Fields123_PROMPTS.md — "User request 26", mobile-apps-preferences skill).

function shuffled<T>(source: readonly T[]): T[] {
  const result = [...source];
  for (let index = result.length - 1; index > 0; index--) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [result[index], result[swapIndex]] = [result[swapIndex], result[index]];
  }
  return result;
}

function buildRound(example: ComprehensionExample, regime: Regime, variant: VariantNumber): GameRound {
  // Variant 2 ("User request 25"): the base grammatical-distractor picture is the target and
  // the base target picture is the grammatical distractor; lexA/lexB pictures stay.
  const targetImage = variant === 2 ? example.grammaticalDistractorImage : example.targetImage;
  const grammaticalImage = variant === 2 ? example.targetImage : example.grammaticalDistractorImage;
  const distractors: RoundSlot[] =
    regime === 2
      ? [{ image: grammaticalImage, kind: 'grammatical' }]
      : [
          { image: grammaticalImage, kind: 'grammatical' },
          { image: example.lexicalDistractorAImage, kind: 'lexicalA' },
          { image: example.lexicalDistractorBImage, kind: 'lexicalB' },
        ];
  const slots = shuffled<RoundSlot>([{ image: targetImage, kind: 'target' }, ...distractors]);
  return {
    example,
    variant,
    slots,
    // By kind, not by image identity — robust even if an example ever reuses an asset.
    correctIndex: slots.findIndex((slot) => slot.kind === 'target'),
  };
}

// Called on every start AND restart of a test, so every play re-draws each example's variant
// independently ("User request 25"); a resumed game reuses the stored plan instead.
export function buildRoundPlan(
  field: FieldId,
  regime: Regime,
  part: TestPart,
  random: () => number = Math.random
): GameRound[] {
  return shuffled(examplesForTestPart(field, part)).map((example) =>
    buildRound(example, regime, pickVariant(example, random))
  );
}
