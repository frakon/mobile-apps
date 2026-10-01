// App-specific glue of the pexeso (the ONLY pexeso file that differs between LetterTraining and LetterPexeso; every other
// pexeso file is kept identical). LetterPexeso variant: generated src/pexesoWords.ts (Level-1-eligible words copied from
// LetterTraining by endgame2 AGENTS/Tasks/20261001_090718_LetterTraining/scripts/pexeso/gen_pexeso_words.py) -
// `_LetterPexeso_PROMPTS.md` / "Q&A 9 — Pexeso improvements round 2" (standalone: full feature set).

export { playAudio, stopAllAudio, stopAudioIfOwnedBy } from './audioController';
export { PEXESO_LETTER_AUDIO, PEXESO_WORDS } from './pexesoWords';

// One identical ear-with-sound picture on every sound card - "Q&A 9 — Pexeso improvements round 2".
export const EAR_IMAGE: number = require('../assets/pexeso_ear.png');
