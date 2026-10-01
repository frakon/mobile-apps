// Data interface of the "Začátky slov" (word starts) trainings - `_LetterTraining_PROMPTS.md` /
// "## Initial request (2026-10-01)" (Level 1, 2, 3) and "## Q&A (2026-10-01)" (voice, wrong-tap sound).
// The dataset src/words.ts is GENERATED (endgame2 AGENTS/Tasks/20261001_090718_LetterTraining/scripts/gen_words_ts.py)
// from words.json and exports WORDS, LETTER_AUDIO, SYLLABLE_AUDIO and REAL_SYLLABLES with these types.

export interface WordEntry {
  // Stable unique id (e.g. the ASCII-folded word).
  readonly id: string;
  // The word in lowercase Czech (e.g. "kočka").
  readonly word: string;
  // Lowercase syllables in order; their concatenation should equal `word` (e.g. ["koč", "ka"]).
  readonly syllables: readonly string[];
  // Level-1 correct answer, lowercase ("ch" for ch-words, "d" for dž-words) - words.json `firstLetter`.
  readonly firstLetter: string;
  // Names a child might plausibly say instead (informational) - `_LetterTraining_PROMPTS.md` / "## Q&A 3 (pilot)".
  readonly alternativeNames: readonly string[];
  // The word must not be used in that level (ambiguous answer / no distractor) - "## Follow-up prompt 2 (verbatim)".
  readonly excludeLevel1: boolean;
  readonly excludeLevel2: boolean;
  readonly excludeLevel3: boolean;
  // The word's picture + audio live in the backend archive `words/<id>.zip` (entries picture.png / word.mp3 /
  // first.mp3 / last.mp3) — `_LetterTraining_PROMPTS.md` / "## Follow-up prompt 9 — mobile-apps-preferences (backend
  // resources, cache, preload)". hasAudioFirst/hasAudioLast say whether the syllable variants exist in that archive
  // (naturally read with the syllable separated by a space: "koč ka" for Level 2 / "koč ka" for Level 3 — one TTS
  // reading, no emphasis, "## Follow-up prompt 12"; originally emphasized per "## Follow-up prompt 3 (verbatim)",
  // superseded); missing -> plain word.mp3.
  readonly hasAudioFirst?: boolean;
  readonly hasAudioLast?: boolean;
}

// Spoken letter name per lowercase Czech letter ("ch" is one letter), e.g. { a: require(...), ch: require(...) }.
// Missing letters are tolerated (no sound, plain 500 ms feedback).
export type LetterAudioMap = Readonly<Partial<Record<string, number>>>;

// Spoken syllable per lowercase syllable — the value is the mp3 entry name (folded, e.g. 'kocx.mp3') inside the
// backend archive `syllables/<first char of the value>.zip`. Missing syllables are tolerated; option generation
// prefers syllables that have audio.
export type SyllableAudioMap = Readonly<Partial<Record<string, string>>>;

// 1 = first letter, 2 = first syllable, 3 = last syllable.
export type WordStartsLevel = 1 | 2 | 3;

export interface WordStartsDataset {
  readonly words: readonly WordEntry[];
  readonly letterAudio: LetterAudioMap;
  readonly syllableAudio: SyllableAudioMap;
  // Real Czech syllables (all syllables of all words.json words) - preferred distractors over synthetic ones.
  readonly realSyllables?: readonly string[];
}

export interface WordStartsRound {
  readonly level: WordStartsLevel;
  readonly word: WordEntry;
  // Lowercase options (letters for level 1, syllables for levels 2 and 3) in display order.
  readonly options: readonly string[];
  readonly correctIndex: number;
}
