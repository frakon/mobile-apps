// Round-plan building per field and regime (see _TreninkPorozumeni_SPEC.md, section "Rounds"
// and _TreninkPorozumeni_Fields123_PROMPTS.md for the 2-image/4-image regime request):
// filter examples by field, shuffle, one round per example; each round shows the target
// plus the grammatical distractor (2-image regime) or plus all three distractors (4-image regime)
// in random positions.

import { AudioSource } from 'expo-audio';
import { ComprehensionExample, comprehensionExamples, FieldId } from './items';
import { ImageSourcePropType } from 'react-native';

export type Regime = 2 | 4;

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
  // Slots in display order (length 2 or 4); the correct (target) image is at correctIndex.
  slots: RoundSlot[];
  correctIndex: number;
}

// Explanation (text + optional audio) for a tapped wrong slot; null for the target slot.
export function explanationForSlot(
  example: ComprehensionExample,
  kind: SlotKind
): { text: string; audio: AudioSource | null } | null {
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

// Asset prefetching support (see _TreninkPorozumeni_Fields123_PROMPTS.md, section
// "User follow-up request 16 — prefetch upcoming rounds' assets"): collect the Metro module
// ids of EXACTLY the assets this round can use in the regime it was built for — the slot
// images (2 or 4, the slots already reflect the regime) plus the sentence audio and the
// explanation audio of each NON-target slot present (2-image regime → only gram_why; the
// lexa/lexb pictures and their explanations are unreachable there and are skipped).
// Static `require('...png')` returns a number (the Metro module id) — anything else
// (e.g. a null explanation audio) is not prefetchable and is ignored.
export function collectRoundAssetModules(round: GameRound): number[] {
  const moduleIds: number[] = [];
  const addModule = (source: unknown) => {
    if (typeof source === 'number') {
      moduleIds.push(source);
    }
  };
  addModule(round.example.audio);
  for (const slot of round.slots) {
    addModule(slot.image);
    const explanation = explanationForSlot(round.example, slot.kind);
    if (explanation !== null) {
      addModule(explanation.audio);
    }
  }
  return moduleIds;
}

function shuffled<T>(source: readonly T[]): T[] {
  const result = [...source];
  for (let index = result.length - 1; index > 0; index--) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [result[index], result[swapIndex]] = [result[swapIndex], result[index]];
  }
  return result;
}

function buildRound(example: ComprehensionExample, regime: Regime): GameRound {
  const distractors: RoundSlot[] =
    regime === 2
      ? [{ image: example.grammaticalDistractorImage, kind: 'grammatical' }]
      : [
          { image: example.grammaticalDistractorImage, kind: 'grammatical' },
          { image: example.lexicalDistractorAImage, kind: 'lexicalA' },
          { image: example.lexicalDistractorBImage, kind: 'lexicalB' },
        ];
  const slots = shuffled<RoundSlot>([{ image: example.targetImage, kind: 'target' }, ...distractors]);
  return {
    example,
    slots,
    // By kind, not by image identity — robust even if an example ever reuses an asset.
    correctIndex: slots.findIndex((slot) => slot.kind === 'target'),
  };
}

export function buildRoundPlan(field: FieldId, regime: Regime): GameRound[] {
  const fieldExamples = comprehensionExamples.filter((example) => example.field === field);
  return shuffled(fieldExamples).map((example) => buildRound(example, regime));
}
