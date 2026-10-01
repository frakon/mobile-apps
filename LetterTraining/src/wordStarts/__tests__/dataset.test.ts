// Sanity tests of the GENERATED dataset src/words.ts (gen_words_ts.py) - `_LetterTraining_PROMPTS.md` /
// "## Initial request (2026-10-01)", "## Follow-up prompt 3 (verbatim)".
import { LETTER_AUDIO, REAL_SYLLABLES, SYLLABLE_AUDIO, WORDS } from '../../words';
import { CZECH_ALPHABET, buildRoundPlan, buildSyllableOptions, correctAnswer, eligibleWords, firstLetter } from '../logic';
import { WordStartsDataset } from '../types';

const DATASET: WordStartsDataset = { words: WORDS, letterAudio: LETTER_AUDIO, syllableAudio: SYLLABLE_AUDIO, realSyllables: REAL_SYLLABLES };

test('every word has a valid archive id, L2/L3-eligible words have their emphasized variant', () => {
  expect(WORDS.length).toBeGreaterThan(0);
  expect(new Set(WORDS.map((entry) => entry.id)).size).toBe(WORDS.length);
  for (const entry of WORDS) {
    // The id names the backend archive `words/<id>.zip` (archive model, "## Follow-up prompt 9").
    expect(entry.id).toMatch(/^[a-z0-9_]+$/);
    expect(entry.syllables.join('')).toBe(entry.word);
  }
  // Emphasized variants are generated only for words eligible in L2 (first) / L3 (last); gen_emphasis.py skips excluded levels.
  for (const entry of eligibleWords(WORDS, 2)) {
    expect(entry.hasAudioFirst).toBe(true);
  }
  for (const entry of eligibleWords(WORDS, 3)) {
    expect(entry.hasAudioLast).toBe(true);
  }
});

test('every letter has audio; every real syllable has audio', () => {
  for (const letter of CZECH_ALPHABET) {
    expect(LETTER_AUDIO[letter]).toBeDefined();
  }
  for (const syllable of REAL_SYLLABLES) {
    expect(SYLLABLE_AUDIO[syllable]).toBeDefined();
  }
});

test('syllable options for every eligible L2/L3 word: 4 distinct, 2+2 structure, correct once', () => {
  for (const level of [2, 3] as const) {
    for (const entry of eligibleWords(WORDS, level)) {
      const correct = correctAnswer(entry, level);
      for (let attempt = 0; attempt < 5; attempt++) {
        const options = buildSyllableOptions(correct, DATASET);
        expect(new Set(options).size).toBe(4);
        expect(options.filter((option) => option === correct)).toHaveLength(1);
        const same = options.filter((option) => firstLetter(option) === firstLetter(correct));
        const other = options.filter((option) => firstLetter(option) !== firstLetter(correct));
        expect(same).toHaveLength(2);
        expect(new Set(other.map(firstLetter)).size).toBe(1);
        for (const option of options) {
          expect(SYLLABLE_AUDIO[option]).toBeDefined();
        }
      }
    }
  }
});

test('round plans of all levels are 10 rounds or empty (level 1 needs letters with >= 3 words)', () => {
  for (const level of [1, 2, 3] as const) {
    const plan = buildRoundPlan(DATASET, level);
    expect([0, 10]).toContain(plan.length);
  }
});
