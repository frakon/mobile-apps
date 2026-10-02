// Backend-served per-example resources (pictures + sounds) — adapter between the round model and the
// per-item archives of ResourceBackend/packPorozumeni.js. Requested in _TreninkPorozumeni_Fields123_PROMPTS.md —
// "User request 26" (apply the mobile-apps-preferences skill: per-exercise resources from the backend, per-item
// archives, preload of the current + next 5 rounds, hot sounds as local files).
//
// The item definitions (src/items.ts, src/items/field5X.ts) are NOT edited: their `require('../assets/...')` calls
// are rewritten at bundle time by babel-plugin-backend-assets.js into plain marker strings, so the per-exercise
// files never enter the bundle. This module resolves a round's pictures/sounds by EXAMPLE ID + FIXED ENTRY NAME
// (the packer derives the same names from the same item fields), the marker values are only used to know whether
// an optional explanation audio exists (null = none).

import { AudioSource } from 'expo-audio';
import { ImageSourcePropType } from 'react-native';

import { ComprehensionExample } from './items';
import { UnpackedArchive } from './resources/types';
import { GameRound, SlotKind } from './rounds';

export function archivePathForExample(example: ComprehensionExample): string {
  return `items/${example.id}.zip`;
}

// Archives a round needs (one per round = its example).
export function archivePathsForRounds(rounds: readonly GameRound[]): string[] {
  return [...new Set(rounds.map((round) => archivePathForExample(round.example)))];
}

// Picture entry of a display slot. Variant 2 ("User request 25") swaps the target and grammatical pictures.
function imageEntryForSlot(round: GameRound, kind: SlotKind): string {
  const swapped = round.variant === 2;
  switch (kind) {
    case 'target':
      return swapped ? 'gram.png' : 'target.png';
    case 'grammatical':
      return swapped ? 'target.png' : 'gram.png';
    case 'lexicalA':
      return 'lexa.png';
    case 'lexicalB':
      return 'lexb.png';
  }
}

function variantPrefix(round: GameRound): string {
  return round.variant === 2 && round.example.swappedVariant !== undefined ? 'v2_' : '';
}

function audioSourceFromArchive(archive: UnpackedArchive | undefined, entryName: string): AudioSource | null {
  const file = archive?.files[entryName];
  if (file === undefined) {
    return null;
  }
  return { uri: file.fileUri ?? file.dataUri };
}

export function slotImageSource(
  round: GameRound,
  kind: SlotKind,
  archive: UnpackedArchive | undefined
): ImageSourcePropType | null {
  const file = archive?.files[imageEntryForSlot(round, kind)];
  return file === undefined ? null : { uri: file.dataUri };
}

export function sentenceAudioSource(round: GameRound, archive: UnpackedArchive | undefined): AudioSource | null {
  return audioSourceFromArchive(archive, `${variantPrefix(round)}sentence.mp3`);
}

// Explanation audio of a tapped wrong slot; null when the item has no such audio (its field is null) or the
// archive lacks it — the game then falls back to the plain red tint (unchanged request-22 behaviour).
export function explanationAudioSource(
  round: GameRound,
  kind: SlotKind,
  itemAudio: AudioSource | null,
  archive: UnpackedArchive | undefined
): AudioSource | null {
  if (itemAudio === null || kind === 'target') {
    return null;
  }
  const baseName = kind === 'grammatical' ? 'gram_why.mp3' : kind === 'lexicalA' ? 'lexa_why.mp3' : 'lexb_why.mp3';
  return audioSourceFromArchive(archive, `${variantPrefix(round)}${baseName}`);
}
