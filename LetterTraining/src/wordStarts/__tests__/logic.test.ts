// Unit tests of the pure word-starts logic - `_LetterTraining_PROMPTS.md` / "## Initial request (2026-10-01)".
import {
  CZECH_ALPHABET,
  INITIAL_PROGRESS,
  ROUNDS_PER_PLAY,
  advanceRound,
  applyTap,
  buildLetterOptions,
  buildRoundPlan,
  buildSyllableOptions,
  collectRoundAssetModules,
  correctAnswer,
  eligibleWords,
  firstLetter,
  optionAudio,
  optionLabel,
  roundWordAudio,
  synthesizeSyllables,
} from '../logic';
import { WordEntry, WordStartsDataset } from '../types';

function word(id: string, text: string, syllables: string[], image: number, audio: number, extra: Partial<WordEntry> = {}): WordEntry {
  return {
    id,
    word: text,
    syllables,
    firstLetter: firstLetter(text),
    alternativeNames: [],
    excludeLevel1: false,
    excludeLevel2: false,
    excludeLevel3: false,
    image,
    audio,
    ...extra,
  };
}

const WORDS: WordEntry[] = [
  word('kocka', 'kočka', ['koč', 'ka'], 101, 201),
  word('pes', 'pes', ['pes'], 102, 202),
  word('chleba', 'chleba', ['chle', 'ba'], 103, 203),
  word('voda', 'voda', ['vo', 'da'], 104, 204),
  word('kolo', 'kolo', ['ko', 'lo'], 105, 205),
  word('vlak', 'vlak', ['vlak'], 106, 206),
  word('banan', 'banán', ['ba', 'nán'], 107, 207),
];

const DATASET: WordStartsDataset = {
  words: WORDS,
  letterAudio: { k: 301, ch: 302, p: 303, a: 304, m: 305 },
  syllableAudio: { koč: 401, ko: 402, ba: 403, da: 404 },
};

// Deterministic pseudo-random source.
function seeded(seed: number): () => number {
  let state = seed;
  return () => {
    state = (state * 1103515245 + 12345) % 2147483648;
    return state / 2147483648;
  };
}

describe('firstLetter', () => {
  test('ch is one letter', () => {
    expect(firstLetter('chleba')).toBe('ch');
    expect(firstLetter('Chalupa')).toBe('ch');
  });
  test('diacritics are kept', () => {
    expect(firstLetter('čepice')).toBe('č');
    expect(firstLetter('Žába')).toBe('ž');
  });
  test('c without h stays c', () => {
    expect(firstLetter('cibule')).toBe('c');
  });
  test('alphabet contains ch as one entry', () => {
    expect(CZECH_ALPHABET).toContain('ch');
    expect(CZECH_ALPHABET).toHaveLength(42);
  });
});

test('optionLabel uppercases Czech', () => {
  expect(optionLabel('ch')).toBe('CH');
  expect(optionLabel('koč')).toBe('KOČ');
});

// Words that make "k" a level-1 letter (>= 3 words).
const K_WORDS = [word('koza', 'koza', ['ko', 'za'], 108, 208), word('kos', 'koš', ['koš'], 110, 210)];

test('eligibleWords: level 1 only letters with >= 3 non-excluded words (Q&A 2), no fallback', () => {
  const extra = [K_WORDS[0], word('pivo', 'pivo', ['pi', 'vo'], 109, 209)];
  expect(eligibleWords([...WORDS, ...extra], 1).map((entry) => entry.id)).toEqual(['kocka', 'kolo', 'koza']);
  expect(eligibleWords(WORDS, 1)).toHaveLength(0); // no letter has 3 words
  // an excluded word neither counts nor plays
  const excluded = word('koza', 'koza', ['ko', 'za'], 108, 208, { excludeLevel1: true });
  expect(eligibleWords([...WORDS, excluded], 1)).toHaveLength(0); // kočka + kolo = 2
  expect(eligibleWords([...WORDS, ...K_WORDS, excluded], 1).map((entry) => entry.id)).toEqual(['kocka', 'kolo', 'koza', 'kos']);
});

test('eligibleWords: level 1 uses the dataset firstLetter (dž -> d)', () => {
  const dz = [1, 2, 3].map((index) => word(`dzus${index}`, 'džus', ['džus'], index, index, { firstLetter: 'd' }));
  expect(eligibleWords(dz, 1)).toHaveLength(3);
  expect(correctAnswer(dz[0], 1)).toBe('d');
});

test('eligibleWords: levels 2/3 only >= 2 syllables and not excluded', () => {
  expect(eligibleWords(WORDS, 2).map((entry) => entry.id)).toEqual(['kocka', 'chleba', 'voda', 'kolo', 'banan']);
  expect(eligibleWords(WORDS, 3)).toHaveLength(5);
  const flagged = [word('obraz', 'obraz', ['ob', 'raz'], 1, 2, { excludeLevel2: true }), word('bagr', 'bagr', ['ba', 'gr'], 3, 4, { excludeLevel3: true })];
  expect(eligibleWords(flagged, 2).map((entry) => entry.id)).toEqual(['bagr']);
  expect(eligibleWords(flagged, 3).map((entry) => entry.id)).toEqual(['obraz']);
});

test('correctAnswer per level', () => {
  expect(correctAnswer(WORDS[0], 1)).toBe('k');
  expect(correctAnswer(WORDS[0], 2)).toBe('koč');
  expect(correctAnswer(WORDS[0], 3)).toBe('ka');
  expect(correctAnswer(WORDS[2], 1)).toBe('ch');
});

describe('buildLetterOptions', () => {
  test('3 distinct options incl. the correct one, many seeds', () => {
    for (let seed = 1; seed < 200; seed++) {
      const options = buildLetterOptions('ch', DATASET, seeded(seed));
      expect(options).toHaveLength(3);
      expect(new Set(options).size).toBe(3);
      expect(options).toContain('ch');
      for (const option of options) {
        expect(CZECH_ALPHABET).toContain(option);
        expect(['ě', 'ů']).not.toContain(option);
      }
    }
  });
  test('letters with audio are preferred as distractors', () => {
    for (let seed = 1; seed < 50; seed++) {
      const options = buildLetterOptions('k', DATASET, seeded(seed));
      for (const option of options) {
        expect(DATASET.letterAudio[option]).toBeDefined();
      }
    }
  });
  test('works with empty letter audio', () => {
    const options = buildLetterOptions('a', { ...DATASET, letterAudio: {} }, seeded(3));
    expect(options).toHaveLength(3);
    expect(options).toContain('a');
  });
});

describe('buildSyllableOptions', () => {
  function checkStructure(correct: string, options: string[]) {
    expect(options).toHaveLength(4);
    expect(new Set(options).size).toBe(4);
    expect(options).toContain(correct);
    const letter = firstLetter(correct);
    const same = options.filter((option) => firstLetter(option) === letter);
    const other = options.filter((option) => firstLetter(option) !== letter);
    expect(same).toHaveLength(2);
    expect(other).toHaveLength(2);
    expect(firstLetter(other[0])).toBe(firstLetter(other[1]));
  }

  test('2 same-letter + 2 one-other-letter, many seeds and words', () => {
    for (let seed = 1; seed < 100; seed++) {
      for (const correct of ['koč', 'ko', 'chle', 'vo', 'ba', 'ka', 'da', 'lo', 'nán']) {
        checkStructure(correct, buildSyllableOptions(correct, DATASET, seeded(seed)));
      }
    }
  });

  test('real same-letter syllable with audio preferred', () => {
    for (let seed = 1; seed < 30; seed++) {
      const options = buildSyllableOptions('koč', DATASET, seeded(seed));
      expect(options).toContain('ko'); // the only other k-syllable with audio
    }
  });

  test('falls back to synthesized syllables when the dataset is tiny', () => {
    const tiny: WordStartsDataset = { words: [word('voda', 'voda', ['vo', 'da'], 1, 2)], letterAudio: {}, syllableAudio: {} };
    for (let seed = 1; seed < 50; seed++) {
      checkStructure('vo', buildSyllableOptions('vo', tiny, seeded(seed)));
      checkStructure('chle', buildSyllableOptions('chle', tiny, seeded(seed)));
    }
  });

  test('never an option equal to the correct one; real syllables preferred over synthetic ones with audio', () => {
    const synthAudio: Record<string, number> = {};
    for (const syllable of [...synthesizeSyllables('k'), ...synthesizeSyllables('m')]) {
      synthAudio[syllable] = 900;
    }
    const dataset: WordStartsDataset = {
      words: [word('kocka', 'kočka', ['koč', 'ka'], 1, 2)],
      letterAudio: {},
      syllableAudio: { ...synthAudio, kos: 501, mýd: 502, lo: 503, lí: 504 },
      realSyllables: ['koč', 'ka', 'kos', 'mýd', 'lo', 'lí'],
    };
    for (let seed = 1; seed < 100; seed++) {
      for (const correct of ['koč', 'ka']) {
        const options = buildSyllableOptions(correct, dataset, seeded(seed));
        checkStructure(correct, options);
        expect(options.filter((option) => option === correct)).toHaveLength(1);
        const same = options.find((option) => option !== correct && firstLetter(option) === 'k');
        expect(['koč', 'ka', 'kos']).toContain(same); // real k-syllable, not synthetic "ko"/"ku"...
        const other = options.filter((option) => firstLetter(option) !== 'k');
        expect(other.sort()).toEqual(['lo', 'lí']); // the only letter with 2 real audio syllables
      }
    }
  });

  test('synthesizeSyllables', () => {
    expect(synthesizeSyllables('m')).toContain('ma');
    expect(synthesizeSyllables('ch')[0]).toBe('cha');
    expect(synthesizeSyllables('ď').every((syllable) => !/[eiéí]$/.test(syllable))).toBe(true);
    expect(synthesizeSyllables('a')[0]).toBe('am');
  });
});

describe('buildRoundPlan', () => {
  test('always 10 rounds, correctIndex points at the correct answer', () => {
    const dataset: WordStartsDataset = { ...DATASET, words: [...WORDS, ...K_WORDS] };
    for (const level of [1, 2, 3] as const) {
      const plan = buildRoundPlan(dataset, level, seeded(7));
      expect(plan).toHaveLength(ROUNDS_PER_PLAY);
      for (const round of plan) {
        expect(round.options[round.correctIndex]).toBe(correctAnswer(round.word, level));
        expect(round.options).toHaveLength(level === 1 ? 3 : 4);
        if (level !== 1) {
          expect(round.word.syllables.length).toBeGreaterThanOrEqual(2);
        }
      }
    }
  });

  test('few words are repeated but never twice in a row', () => {
    for (let seed = 1; seed < 50; seed++) {
      const plan = buildRoundPlan(DATASET, 2, seeded(seed));
      for (let index = 1; index < plan.length; index++) {
        expect(plan[index].word.id).not.toBe(plan[index - 1].word.id);
      }
    }
  });

  test('large dataset: 10 distinct words', () => {
    const many: WordEntry[] = Array.from({ length: 30 }, (_, index) => word(`w${index}`, `mama${index}`, ['ma', `ma${index}`], index, index));
    const plan = buildRoundPlan({ words: many, letterAudio: {}, syllableAudio: {} }, 1, seeded(5));
    expect(new Set(plan.map((round) => round.word.id)).size).toBe(10);
  });

  test('empty dataset -> empty plan', () => {
    expect(buildRoundPlan({ words: [], letterAudio: {}, syllableAudio: {} }, 1)).toEqual([]);
    expect(buildRoundPlan(DATASET, 1)).toEqual([]); // no letter with >= 3 words
  });
});

test('optionAudio and collectRoundAssetModules', () => {
  const round = { level: 2 as const, word: WORDS[0], options: ['koč', 'ko', 'da', 'dů'], correctIndex: 0 };
  expect(optionAudio(round, 'koč', DATASET)).toBe(401);
  expect(optionAudio(round, 'dů', DATASET)).toBeUndefined();
  expect(collectRoundAssetModules(round, DATASET)).toEqual([101, 201, 401, 402, 404]);
  const letterRound = { level: 1 as const, word: WORDS[0], options: ['k', 'p', 'z'], correctIndex: 0 };
  expect(collectRoundAssetModules(letterRound, DATASET)).toEqual([101, 201, 301, 303]);
});

test('roundWordAudio + prefetch use the emphasized variant (Follow-up prompt 3)', () => {
  const emphasized = word('kocka', 'kočka', ['koč', 'ka'], 101, 201, { audioFirst: 601, audioLast: 602 });
  const level1 = { level: 1 as const, word: emphasized, options: ['k', 'p', 'a'], correctIndex: 0 };
  const level2 = { level: 2 as const, word: emphasized, options: ['koč', 'ko', 'da', 'dů'], correctIndex: 0 };
  const level3 = { level: 3 as const, word: emphasized, options: ['ka', 'ko', 'da', 'dů'], correctIndex: 0 };
  expect(roundWordAudio(level1)).toBe(201);
  expect(roundWordAudio(level2)).toBe(601);
  expect(roundWordAudio(level3)).toBe(602);
  expect(collectRoundAssetModules(level2, DATASET)).toEqual([101, 601, 401, 402, 404]);
  expect(collectRoundAssetModules(level3, DATASET)).toEqual([101, 602, 402, 404]);
  // missing emphasized mp3 -> plain word
  expect(roundWordAudio({ ...level3, word: WORDS[0] })).toBe(201);
});

describe('scoring', () => {
  const round = { level: 1 as const, word: WORDS[0], options: ['k', 'p', 'a'], correctIndex: 0 };
  test('first tap correct -> scored', () => {
    const result = applyTap(INITIAL_PROGRESS, round, 0);
    expect(result.isCorrect).toBe(true);
    expect(result.progress.correctRounds).toBe(1);
    expect(advanceRound(result.progress)).toEqual({ roundIndex: 1, missedCurrentRound: false, correctRounds: 1 });
  });
  test('miss first -> round wrong even after the correct tap', () => {
    const miss = applyTap(INITIAL_PROGRESS, round, 2);
    expect(miss.isCorrect).toBe(false);
    expect(miss.progress.missedCurrentRound).toBe(true);
    const miss2 = applyTap(miss.progress, round, 1);
    const hit = applyTap(miss2.progress, round, 0);
    expect(hit.isCorrect).toBe(true);
    expect(hit.progress.correctRounds).toBe(0);
    expect(advanceRound(hit.progress).missedCurrentRound).toBe(false);
  });
});
