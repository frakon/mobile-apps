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

function examplesForField(field: FieldId): ComprehensionExample[] {
  return comprehensionExamples.filter((example) => example.field === field);
}

// Number of existing groups of a field (0 = empty type), capped at 10 (items 1–100).
export function testPartCount(field: FieldId): number {
  return Math.min(MAX_TEST_PARTS, Math.ceil(examplesForField(field).length / EXAMPLES_PER_TEST_PART));
}

// "1–10", "11–20", … — the last group shows its real end when it is not full.
export function testPartRangeLabel(field: FieldId, part: TestPart): string {
  const first = (part - 1) * EXAMPLES_PER_TEST_PART + 1;
  const last = first - 1 + examplesForTestPart(field, part).length;
  return `${first}–${last}`;
}

// The examples of one sub-test (field + part), in the fixed items.ts order (pre-shuffle).
export function examplesForTestPart(field: FieldId, part: TestPart): ComprehensionExample[] {
  if (!Number.isInteger(part) || part < 1 || part > MAX_TEST_PARTS) {
    return [];
  }
  const startIndex = (part - 1) * EXAMPLES_PER_TEST_PART;
  return examplesForField(field).slice(startIndex, startIndex + EXAMPLES_PER_TEST_PART);
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
