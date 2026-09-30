// Round-plan building for the comprehension game (see _TreninkPorozumeni_SPEC.md, section "Rounds"):
// shuffled pass A (each item with a random variant), then shuffled pass B with the opposite variants → 22 rounds.

import { AudioSource } from 'expo-audio';
import { ImageSourcePropType } from 'react-native';
import { ComprehensionItem, comprehensionItems } from './items';

export type SentenceVariant = 'a' | 'b';

export interface GameRound {
  item: ComprehensionItem;
  variant: SentenceVariant;
  sentence: string;
  audio: AudioSource;
  correctImage: ImageSourcePropType;
  wrongImage: ImageSourcePropType;
  correctSide: 'left' | 'right';
}

function shuffled<T>(source: readonly T[]): T[] {
  const result = [...source];
  for (let index = result.length - 1; index > 0; index--) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [result[index], result[swapIndex]] = [result[swapIndex], result[index]];
  }
  return result;
}

function buildRound(item: ComprehensionItem, variant: SentenceVariant): GameRound {
  const isVariantA = variant === 'a';
  return {
    item,
    variant,
    sentence: isVariantA ? item.sentenceA : item.sentenceB,
    audio: isVariantA ? item.audioA : item.audioB,
    correctImage: isVariantA ? item.imageA : item.imageB,
    wrongImage: isVariantA ? item.imageB : item.imageA,
    correctSide: Math.random() < 0.5 ? 'left' : 'right', // correct picture randomly left/right each round
  };
}

export function buildRoundPlan(): GameRound[] {
  // Pass A: every item once, with a randomly chosen variant.
  const firstPassVariants = new Map<string, SentenceVariant>();
  for (const item of comprehensionItems) {
    firstPassVariants.set(item.id, Math.random() < 0.5 ? 'a' : 'b');
  }
  const firstPass = shuffled(comprehensionItems).map((item) =>
    buildRound(item, firstPassVariants.get(item.id) as SentenceVariant)
  );
  // Pass B: every item once more, with the opposite variant.
  const secondPass = shuffled(comprehensionItems).map((item) =>
    buildRound(item, firstPassVariants.get(item.id) === 'a' ? 'b' : 'a')
  );
  return [...firstPass, ...secondPass];
}
