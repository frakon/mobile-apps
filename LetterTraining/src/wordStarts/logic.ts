// Pure logic of the "Začátky slov" trainings (round plan, option generation, scoring, prefetch list) -
// `_LetterTraining_PROMPTS.md` / "## Initial request (2026-10-01)" (Word starts training: General notes, Level 1-3)
// and "## Q&A (2026-10-01)". No React / native imports here so everything is unit-testable with jest.

import type { UnpackedArchive } from '../resources/types';
import { WordEntry, WordStartsDataset, WordStartsLevel, WordStartsRound } from './types';

// "every play will have 10 rounds" - `_LetterTraining_PROMPTS.md` / "## Initial request (2026-10-01)".
export const ROUNDS_PER_PLAY = 10;

export const LEVEL_1_OPTION_COUNT = 3;
export const SYLLABLE_OPTION_COUNT = 4;

// Czech alphabet; "ch" is ONE letter (sorted after "h").
export const CZECH_ALPHABET: readonly string[] = [
  'a', 'á', 'b', 'c', 'č', 'd', 'ď', 'e', 'é', 'ě', 'f', 'g', 'h', 'ch', 'i', 'í', 'j', 'k', 'l', 'm', 'n', 'ň',
  'o', 'ó', 'p', 'q', 'r', 'ř', 's', 'š', 't', 'ť', 'u', 'ú', 'ů', 'v', 'w', 'x', 'y', 'ý', 'z', 'ž',
];

// Letters no Czech word starts with - never offered as a level-1 distractor.
const NON_INITIAL_LETTERS = new Set(['ě', 'ů']);

const VOWELS = new Set(['a', 'á', 'e', 'é', 'ě', 'i', 'í', 'o', 'ó', 'u', 'ú', 'ů', 'y', 'ý']);
// Consonants after which e/i/y spelling is unusual - synthesized syllables avoid those vowels there.
const SOFT_CONSONANTS = new Set(['ď', 'ť', 'ň', 'č', 'ř', 'š', 'ž', 'c', 'j']);
const SYNTHESIS_VOWELS = ['a', 'o', 'u', 'e', 'i', 'á', 'é', 'í', 'ó', 'ú'];
const SOFT_SYNTHESIS_VOWELS = ['a', 'o', 'u', 'á', 'ú'];
const SYNTHESIS_CODAS = ['m', 'l', 's', 'n', 't', 'k', 'p'];
const SYNTHESIS_CONSONANTS = ['b', 'c', 'č', 'd', 'f', 'h', 'ch', 'j', 'k', 'l', 'm', 'n', 'p', 'r', 'ř', 's', 'š', 't', 'v', 'z', 'ž'];

export type RandomSource = () => number;

// First Czech letter of a word/syllable (lowercase); "ch" counts as one letter.
export function firstLetter(text: string): string {
  const normalized = text.normalize('NFC').toLocaleLowerCase('cs-CZ');
  if (normalized.startsWith('ch')) {
    return 'ch';
  }
  return Array.from(normalized)[0] ?? '';
}

// Display form of an option ("ch" -> "CH", "koč" -> "KOČ").
export function optionLabel(option: string): string {
  return option.toLocaleUpperCase('cs-CZ');
}

export function shuffled<T>(source: readonly T[], random: RandomSource = Math.random): T[] {
  const result = [...source];
  for (let index = result.length - 1; index > 0; index--) {
    const swapIndex = Math.floor(random() * (index + 1));
    [result[index], result[swapIndex]] = [result[swapIndex], result[index]];
  }
  return result;
}

// Takes up to `count` distinct items, preferring (in random order) those `isPreferred` accepts.
function pickPreferred(candidates: readonly string[], count: number, isPreferred: (item: string) => boolean, random: RandomSource): string[] {
  const unique = Array.from(new Set(candidates));
  const preferred = shuffled(unique.filter(isPreferred), random);
  const rest = shuffled(unique.filter((item) => !isPreferred(item)), random);
  return [...preferred, ...rest].slice(0, count);
}

export const MIN_WORDS_PER_CORRECT_LETTER = 3;

// Words a level can use (excludeLevelN words never): level 1 only words whose first letter has >= 3 such words
// (rarer letters still appear as wrong options - `_LetterTraining_PROMPTS.md` / "## Q&A 2 (verbatim answers)": "Only
// wrong options"); levels 2/3 only words with >= 2 syllables ("The words on pictures are at least 2 syllable ones").
// Exclude flags: "## Follow-up prompt 2 (verbatim)" (picture usable for some levels only) and "## Q&A 3 (pilot)".
export function eligibleWords(words: readonly WordEntry[], level: WordStartsLevel): WordEntry[] {
  if (level === 1) {
    const candidates = words.filter((entry) => !entry.excludeLevel1 && correctAnswer(entry, 1) !== '');
    const counts = new Map<string, number>();
    for (const entry of candidates) {
      const letter = correctAnswer(entry, 1);
      counts.set(letter, (counts.get(letter) ?? 0) + 1);
    }
    return candidates.filter((entry) => (counts.get(correctAnswer(entry, 1)) ?? 0) >= MIN_WORDS_PER_CORRECT_LETTER);
  }
  const excluded = level === 2 ? (entry: WordEntry) => entry.excludeLevel2 : (entry: WordEntry) => entry.excludeLevel3;
  return words.filter((entry) => entry.syllables.length >= 2 && !excluded(entry));
}

// The correct answer of a word for a level (level 1: the dataset's firstLetter, e.g. "ch", "d" for "džus").
export function correctAnswer(word: WordEntry, level: WordStartsLevel): string {
  switch (level) {
    case 1:
      return (word.firstLetter || firstLetter(word.word)).normalize('NFC').toLocaleLowerCase('cs-CZ');
    case 2:
      return word.syllables[0].toLocaleLowerCase('cs-CZ');
    case 3:
      return word.syllables[word.syllables.length - 1].toLocaleLowerCase('cs-CZ');
  }
}

// Level 1: the correct first letter + 2 other letters. Letters with a letter-audio prefer (real data: all have it);
// a missing audio only means the tap plays no sound.
export function buildLetterOptions(correct: string, dataset: WordStartsDataset, random: RandomSource = Math.random): string[] {
  const candidates = CZECH_ALPHABET.filter((letter) => letter !== correct && !NON_INITIAL_LETTERS.has(letter));
  const distractors = pickPreferred(candidates, LEVEL_1_OPTION_COUNT - 1, (letter) => dataset.letterAudio[letter] !== undefined, random);
  return shuffled([correct, ...distractors], random);
}

// Made-up syllables starting with `letter` (fallback when the dataset has too few real ones).
export function synthesizeSyllables(letter: string): string[] {
  if (VOWELS.has(letter)) {
    return SYNTHESIS_CODAS.map((coda) => letter + coda);
  }
  const vowels = SOFT_CONSONANTS.has(letter) ? SOFT_SYNTHESIS_VOWELS : SYNTHESIS_VOWELS;
  return vowels.map((vowel) => letter + vowel);
}

// FIXED list of all synthetic syllables synthesizeSyllables can ever return (one entry per alphabet letter). The audio
// generator (endgame2 AGENTS/Tasks/20261001_090718_LetterTraining/scripts/gen_audio.py) voices exactly this list into
// assets/audio/syllables - keep both in sync when the synthesis constants change.
export const SYNTHETIC_SYLLABLES: readonly string[] = Array.from(new Set(CZECH_ALPHABET.flatMap((letter) => synthesizeSyllables(letter))));

// Real syllable pool (lowercase, unique): dataset.realSyllables (all words.json syllables) + syllables of the words.
export function syllablePool(dataset: WordStartsDataset): string[] {
  const pool = new Set<string>();
  for (const syllable of dataset.realSyllables ?? []) {
    pool.add(syllable.toLocaleLowerCase('cs-CZ'));
  }
  for (const entry of dataset.words) {
    for (const syllable of entry.syllables) {
      pool.add(syllable.toLocaleLowerCase('cs-CZ'));
    }
  }
  return Array.from(pool);
}

// Levels 2/3: 4 syllables - 2 starting with the correct syllable's first letter (incl. the correct one) and 2 starting
// with ONE other letter ("2 starting on the same letter as the word, other 2 starting on another one letter";
// level 3 analogously: the correct LAST syllable's first letter). An option never equals the correct syllable and
// options are distinct. Preference: real syllables with audio > real without audio > synthesized with audio >
// synthesized without audio.
export function buildSyllableOptions(correct: string, dataset: WordStartsDataset, random: RandomSource = Math.random): string[] {
  const hasAudio = (syllable: string) => dataset.syllableAudio[syllable] !== undefined;
  const real = syllablePool(dataset).filter((syllable) => syllable !== correct);
  const realSet = new Set(real);
  const letter = firstLetter(correct);
  const rank = (syllable: string) => (realSet.has(syllable) ? 0 : 2) + (hasAudio(syllable) ? 0 : 1);
  // Up to `count` distinct candidates with the best rank, random within a rank.
  const pickBest = (candidates: readonly string[], count: number) => {
    const unique = shuffled(Array.from(new Set(candidates)).filter((syllable) => syllable !== correct), random);
    return unique.sort((left, right) => rank(left) - rank(right)).slice(0, count);
  };

  const sameLetter = pickBest(
    [...real.filter((syllable) => firstLetter(syllable) === letter), ...synthesizeSyllables(letter)],
    1
  );

  // The other letter: prefer a letter with 2 real syllables with audio, then 2 real syllables, else synthesize.
  const groups = new Map<string, string[]>();
  for (const syllable of real) {
    const groupLetter = firstLetter(syllable);
    if (groupLetter === letter || groupLetter === '') {
      continue;
    }
    groups.set(groupLetter, [...(groups.get(groupLetter) ?? []), syllable]);
  }
  const groupLetters = shuffled(Array.from(groups.keys()), random);
  const chosenGroup =
    groupLetters.find((groupLetter) => groups.get(groupLetter)!.filter(hasAudio).length >= 2) ??
    groupLetters.find((groupLetter) => groups.get(groupLetter)!.length >= 2);
  let otherLetter: string[];
  if (chosenGroup !== undefined) {
    otherLetter = pickBest(groups.get(chosenGroup)!, 2);
  } else {
    const consonant = shuffled(SYNTHESIS_CONSONANTS.filter((candidate) => candidate !== letter), random)[0];
    otherLetter = pickBest(synthesizeSyllables(consonant), 2);
  }
  return shuffled([correct, ...sameLetter, ...otherLetter], random);
}

export function buildRound(word: WordEntry, level: WordStartsLevel, dataset: WordStartsDataset, random: RandomSource = Math.random): WordStartsRound {
  const correct = correctAnswer(word, level);
  const options = level === 1 ? buildLetterOptions(correct, dataset, random) : buildSyllableOptions(correct, dataset, random);
  return { level, word, options, correctIndex: options.indexOf(correct) };
}

// 10 rounds of the level's eligible words in random order. A dataset with fewer eligible words than rounds repeats
// words (fresh shuffle per pass, never the same word twice in a row when avoidable). Empty dataset -> [].
export function buildRoundPlan(
  dataset: WordStartsDataset,
  level: WordStartsLevel,
  random: RandomSource = Math.random,
  roundCount: number = ROUNDS_PER_PLAY
): WordStartsRound[] {
  const eligible = eligibleWords(dataset.words, level);
  if (eligible.length === 0) {
    return [];
  }
  const sequence: WordEntry[] = [];
  while (sequence.length < roundCount) {
    const batch = shuffled(eligible, random);
    if (batch.length > 1 && sequence.length > 0 && sequence[sequence.length - 1].id === batch[0].id) {
      [batch[0], batch[batch.length - 1]] = [batch[batch.length - 1], batch[0]];
    }
    sequence.push(...batch);
  }
  return sequence.slice(0, roundCount).map((word) => buildRound(word, level, dataset, random));
}

// ---- Backend archives (`_LetterTraining_PROMPTS.md` / "## Follow-up prompt 9 — mobile-apps-preferences (backend
// resources, cache, preload)"): per-exercise pictures/audio come from backend zips; letter audio stays bundled. ----

// Preferences skill: "While in a round, preload the next 5 rounds" — supersedes the earlier 2-rounds-ahead prefetch
// ("## Follow-up prompt 9", user decision 3).
export const PRELOAD_ROUNDS_AHEAD = 5;

// Fixed entry names inside `words/<id>.zip` (ResourceBackend/pack.js; src/resources/README.md contract).
export const WORD_PICTURE_FILE = 'picture.png';

// An audio resource a screen can play: a bundled Metro module (letter names) or an entry of a backend archive
// (word / syllable mp3s, hot in memory once the archive is unpacked).
export type AudioResource =
  | { readonly kind: 'bundled'; readonly module: number }
  | { readonly kind: 'archive'; readonly archivePath: string; readonly fileName: string };

// Backend archive of a word's picture + audio variants.
export function wordArchivePath(word: WordEntry): string {
  return `words/${word.id}.zip`;
}

// The syllable's mp3: SYLLABLE_AUDIO maps the syllable to its folded entry name; the archive is the per-first-character
// group zip (ResourceBackend/pack.js groups syllable mp3s by the first character of the folded file name).
export function syllableAudioResource(syllable: string, dataset: WordStartsDataset): AudioResource | undefined {
  const fileName = dataset.syllableAudio[syllable];
  if (fileName === undefined || fileName.length === 0) {
    return undefined;
  }
  return { kind: 'archive', archivePath: `syllables/${fileName[0]}.zip`, fileName };
}

// Turns an AudioResource into something playAudio accepts: a bundled Metro module id, or the hot in-memory data URI
// of the already-unpacked archive entry. undefined = no audio (missing resource or archive not hot) — tolerated.
export function resolveAudioSource(
  resource: AudioResource | undefined,
  archives: Readonly<Record<string, UnpackedArchive>>
): number | { uri: string } | undefined {
  if (resource === undefined) {
    return undefined;
  }
  if (resource.kind === 'bundled') {
    return resource.module;
  }
  const dataUri = archives[resource.archivePath]?.files[resource.fileName]?.dataUri;
  return dataUri === undefined ? undefined : { uri: dataUri };
}

// The word-audio entry a round plays (auto-play + replay button): level 1 the plain word, level 2 the word with the
// FIRST syllable emphasized, level 3 with the LAST syllable emphasized (`_LetterTraining_PROMPTS.md` /
// "## Follow-up prompt 3 (verbatim)"); falls back to the plain word when the emphasized mp3 is missing.
export function roundWordAudioFile(round: WordStartsRound): string {
  switch (round.level) {
    case 1:
      return 'word.mp3';
    case 2:
      return round.word.hasAudioFirst === true ? 'first.mp3' : 'word.mp3';
    case 3:
      return round.word.hasAudioLast === true ? 'last.mp3' : 'word.mp3';
  }
}

// Sound of an option: level 1 the letter name (bundled), levels 2/3 the syllable (backend archive) -
// "## Q&A (2026-10-01)": say the tapped syllable like level 1. undefined = no audio available (tolerated).
export function optionAudioResource(round: WordStartsRound, option: string, dataset: WordStartsDataset): AudioResource | undefined {
  if (round.level === 1) {
    const module = dataset.letterAudio[option];
    return module === undefined ? undefined : { kind: 'bundled', module };
  }
  return syllableAudioResource(option, dataset);
}

// EXACTLY the backend archives this round can use: the word's zip (picture + word audio) and, for levels 2/3, the
// syllable-group zips of every option. Level-1 letter audio is bundled, so it needs no archive.
export function collectRoundArchives(round: WordStartsRound, dataset: WordStartsDataset): string[] {
  const archives: string[] = [wordArchivePath(round.word)];
  for (const option of round.options) {
    const resource = optionAudioResource(round, option, dataset);
    if (resource !== undefined && resource.kind === 'archive' && !archives.includes(resource.archivePath)) {
      archives.push(resource.archivePath);
    }
  }
  return archives;
}

// Archives of the preload window: the current round + the next `ahead` rounds (preferences skill: downloaded, cached
// and unpacked hot in memory before their round comes). Deduplicated, in round order (current round's archives first).
export function collectPreloadWindowArchives(
  plan: readonly WordStartsRound[],
  roundIndex: number,
  dataset: WordStartsDataset,
  ahead: number = PRELOAD_ROUNDS_AHEAD
): string[] {
  const archives: string[] = [];
  for (let index = roundIndex; index <= roundIndex + ahead && index < plan.length; index++) {
    for (const archivePath of collectRoundArchives(plan[index], dataset)) {
      if (!archives.includes(archivePath)) {
        archives.push(archivePath);
      }
    }
  }
  return archives;
}

// Scoring: a round counts as correct only when the FIRST tap is correct; after a miss the child continues until the
// correct option is tapped (round then scored wrong).
export interface PlayProgress {
  readonly roundIndex: number;
  readonly missedCurrentRound: boolean;
  readonly correctRounds: number;
}

export const INITIAL_PROGRESS: PlayProgress = { roundIndex: 0, missedCurrentRound: false, correctRounds: 0 };

export function applyTap(progress: PlayProgress, round: WordStartsRound, optionIndex: number): { progress: PlayProgress; isCorrect: boolean } {
  if (optionIndex === round.correctIndex) {
    return {
      progress: { ...progress, correctRounds: progress.correctRounds + (progress.missedCurrentRound ? 0 : 1) },
      isCorrect: true,
    };
  }
  return { progress: { ...progress, missedCurrentRound: true }, isCorrect: false };
}

export function advanceRound(progress: PlayProgress): PlayProgress {
  return { ...progress, roundIndex: progress.roundIndex + 1, missedCurrentRound: false };
}
