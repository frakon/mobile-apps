// App-specific glue of the pexeso (the ONLY pexeso file that differs between LetterTraining and LetterPexeso; every other
// pexeso file is kept identical). LetterTraining variant: words + letter audio from the generated src/words.ts.
// Image cards use Level-1-eligible words only - `_LetterPexeso_PROMPTS.md` / "Follow-up prompt 6 — Pexeso improvements
// (standalone LetterPexeso + integrated in LetterTraining) (verbatim)" + "Q&A 8 — Pexeso improvements round 1".

import type { LetterAudioMap } from '../wordStarts/types';
import { LETTER_AUDIO, WORDS } from '../words';
import type { PexesoWord } from './game/pexesoLogic';

export { playAudio, stopAllAudio, stopAudioIfOwnedBy } from '../audioController';

export const PEXESO_WORDS: readonly PexesoWord[] = WORDS.filter((entry) => !entry.excludeLevel1).map((entry) => ({
  id: entry.id,
  word: entry.word,
  firstLetter: entry.firstLetter,
  image: entry.image,
  audio: entry.audio,
}));

export const PEXESO_LETTER_AUDIO: LetterAudioMap = LETTER_AUDIO;

// One identical ear-with-sound picture on every sound card - "Q&A 9 — Pexeso improvements round 2".
export const EAR_IMAGE: number = require('../../assets/images/pexeso_ear.png');
