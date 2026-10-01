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
  collectPreloadWindowArchives,
  collectRoundArchives,
  correctAnswer,
  eligibleWords,
  firstLetter,
  optionAudioResource,
  optionLabel,
  resolveAudioSource,
  roundWordAudioFile,
  synthesizeSyllables,
  wordArchivePath,
} from '../logic';
import { WordEntry, WordStartsDataset } from '../types';

// The two unused numeric parameters kept the historic call sites unchanged when the dataset moved from Metro module
// ids to backend archives (the picture/audio now live in `words/<id>.zip` — wordArchivePath).
function word(id: string, text: string, syllables: string[], _image: number = 0, _audio: number = 0, extra: Partial<WordEntry> = {}): WordEntry {
  return {
    id,
    word: text,
    syllables,
    firstLetter: firstLetter(text),
    alternativeNames: [],
    excludeLevel1: false,
    excludeLevel2: false,
    excludeLevel3: false,
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
  // Values = mp3 entry name inside `syllables/<first char>.zip` (folded names, see ResourceBackend/pack.js).
  syllableAudio: { koč: 'kocx.mp3', ko: 'ko.mp3', ba: 'ba.mp3', da: 'da.mp3' },
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
    const synthAudio: Record<string, string> = {};
    for (const syllable of [...synthesizeSyllables('k'), ...synthesizeSyllables('m')]) {
      synthAudio[syllable] = `${syllable}.mp3`;
    }
    const dataset: WordStartsDataset = {
      words: [word('kocka', 'kočka', ['koč', 'ka'], 1, 2)],
      letterAudio: {},
      syllableAudio: { ...synthAudio, kos: 'kos.mp3', mýd: 'myyd.mp3', lo: 'lo.mp3', lí: 'lii.mp3' },
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

test('optionAudioResource, resolveAudioSource and collectRoundArchives (archive model)', () => {
  const round = { level: 2 as const, word: WORDS[0], options: ['koč', 'ko', 'da', 'dů'], correctIndex: 0 };
  expect(optionAudioResource(round, 'koč', DATASET)).toEqual({ kind: 'archive', archivePath: 'syllables/k.zip', fileName: 'kocx.mp3' });
  expect(optionAudioResource(round, 'da', DATASET)).toEqual({ kind: 'archive', archivePath: 'syllables/d.zip', fileName: 'da.mp3' });
  expect(optionAudioResource(round, 'dů', DATASET)).toBeUndefined();
  // Round archives: the word's zip + the syllable-group zips of the options (deduplicated).
  expect(wordArchivePath(WORDS[0])).toBe('words/kocka.zip');
  expect(collectRoundArchives(round, DATASET)).toEqual(['words/kocka.zip', 'syllables/k.zip', 'syllables/d.zip']);
  // Level 1: letter audio is BUNDLED -> only the word's archive.
  const letterRound = { level: 1 as const, word: WORDS[0], options: ['k', 'p', 'z'], correctIndex: 0 };
  expect(optionAudioResource(letterRound, 'k', DATASET)).toEqual({ kind: 'bundled', module: 301 });
  expect(optionAudioResource(letterRound, 'z', DATASET)).toBeUndefined();
  expect(collectRoundArchives(letterRound, DATASET)).toEqual(['words/kocka.zip']);
  // resolveAudioSource: bundled module passes through; archive entries resolve to the hot data URI.
  const archives = {
    'syllables/k.zip': { archivePath: 'syllables/k.zip', files: { 'kocx.mp3': { bytes: new Uint8Array(0), dataUri: 'data:k' } } },
  };
  expect(resolveAudioSource({ kind: 'bundled', module: 301 }, archives)).toBe(301);
  expect(resolveAudioSource(optionAudioResource(round, 'koč', DATASET), archives)).toEqual({ uri: 'data:k' });
  expect(resolveAudioSource(optionAudioResource(round, 'da', DATASET), archives)).toBeUndefined(); // archive not hot
  expect(resolveAudioSource(undefined, archives)).toBeUndefined();
});

test('roundWordAudioFile uses the emphasized variant (Follow-up prompt 3)', () => {
  const emphasized = word('kocka', 'kočka', ['koč', 'ka'], 101, 201, { hasAudioFirst: true, hasAudioLast: true });
  const level1 = { level: 1 as const, word: emphasized, options: ['k', 'p', 'a'], correctIndex: 0 };
  const level2 = { level: 2 as const, word: emphasized, options: ['koč', 'ko', 'da', 'dů'], correctIndex: 0 };
  const level3 = { level: 3 as const, word: emphasized, options: ['ka', 'ko', 'da', 'dů'], correctIndex: 0 };
  expect(roundWordAudioFile(level1)).toBe('word.mp3');
  expect(roundWordAudioFile(level2)).toBe('first.mp3');
  expect(roundWordAudioFile(level3)).toBe('last.mp3');
  // missing emphasized mp3 -> plain word
  expect(roundWordAudioFile({ ...level3, word: WORDS[0] })).toBe('word.mp3');
});

test('collectPreloadWindowArchives: current round + next 5, deduplicated, in round order (5-round preload)', () => {
  const plan = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'].map((letter, index) => ({
    level: 1 as const,
    word: word(`w${letter}`, `${letter}ovo${index}`, [`${letter}o`, `vo${index}`]),
    options: ['k', 'p', 'z'],
    correctIndex: 0,
  }));
  // Round 0: rounds 0..5 (current + PRELOAD_ROUNDS_AHEAD = 5) — rounds 6/7 are NOT preloaded yet.
  expect(collectPreloadWindowArchives(plan, 0, DATASET)).toEqual(
    ['wa', 'wb', 'wc', 'wd', 'we', 'wf'].map((id) => `words/${id}.zip`)
  );
  // Round 2: rounds 2..7 — the archives of the passed rounds 0/1 are no longer in the window (they get released).
  expect(collectPreloadWindowArchives(plan, 2, DATASET)).toEqual(
    ['wc', 'wd', 'we', 'wf', 'wg', 'wh'].map((id) => `words/${id}.zip`)
  );
  // Near the end the window just clips to the plan.
  expect(collectPreloadWindowArchives(plan, 6, DATASET)).toEqual(['wg', 'wh'].map((id) => `words/${id}.zip`));
  // A repeated word is preloaded once; level-2 rounds add their syllable-group zips after the word zips of earlier rounds.
  const level2Plan = [
    { level: 2 as const, word: WORDS[0], options: ['koč', 'ko', 'da', 'dů'], correctIndex: 0 },
    { level: 2 as const, word: WORDS[0], options: ['koč', 'ba', 'da', 'dů'], correctIndex: 0 },
  ];
  expect(collectPreloadWindowArchives(level2Plan, 0, DATASET)).toEqual(
    ['words/kocka.zip', 'syllables/k.zip', 'syllables/d.zip', 'syllables/b.zip']
  );
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
