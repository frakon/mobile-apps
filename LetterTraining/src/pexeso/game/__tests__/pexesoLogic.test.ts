import {
  BOARD_SIZES,
  Card,
  CZECH_ALPHABET,
  DEFAULT_SETTINGS,
  GameAction,
  GameState,
  PexesoSettings,
  PexesoWord,
  availableLetters,
  boardSizeById,
  createDeck,
  createInitialState,
  diacriticsLetterPool,
  effectiveBoardSize,
  gameReducer,
  gridShapeFor,
  isCardFaceUp,
  isSizeAvailable,
  letterText,
  pairCountOf,
  sanitizeSettings,
} from '../pexesoLogic';

// `_LetterPexeso_PROMPTS.md` / "Follow-up 1: landscape" + "Q&A 8 — Pexeso improvements round 1" (sizes).
test('gridShapeFor: longer board side along the longer window side', () => {
  const size3x6 = boardSizeById('3x6')!;
  expect(gridShapeFor(size3x6, 667, 375)).toEqual({ columns: 6, rows: 3 });
  expect(gridShapeFor(size3x6, 500, 500)).toEqual({ columns: 6, rows: 3 });
  expect(gridShapeFor(size3x6, 375, 667)).toEqual({ columns: 3, rows: 6 });
  expect(gridShapeFor(boardSizeById('4x10')!, 844, 390)).toEqual({ columns: 10, rows: 4 });
});

test('BOARD_SIZES: the 8 user sizes (3x5 dropped), even card counts', () => {
  expect(BOARD_SIZES.map((size) => size.id)).toEqual(['2x2', '2x3', '2x4', '3x4', '3x6', '3x8', '4x8', '4x10']);
  expect(BOARD_SIZES.map(pairCountOf)).toEqual([2, 3, 4, 6, 9, 12, 16, 20]);
});

// Deterministic pseudo-random generator (mulberry32) for reproducible decks.
function seededRandom(seed: number): () => number {
  let value = seed >>> 0;
  return () => {
    value = (value + 0x6d2b79f5) >>> 0;
    let mixed = value;
    mixed = Math.imul(mixed ^ (mixed >>> 15), mixed | 1);
    mixed ^= mixed + Math.imul(mixed ^ (mixed >>> 7), mixed | 61);
    return ((mixed ^ (mixed >>> 14)) >>> 0) / 4294967296;
  };
}

function deckFromLetters(letters: string[]): Card[] {
  return letters.map((letter, index) => ({
    id: index,
    letter,
    column: 0,
    face: { type: 'letter', text: letter, letterStyle: 'print' },
    isRemoved: false,
  }));
}

function word(id: string, firstLetter: string): PexesoWord {
  return { id, word: id, firstLetter, archivePath: `words/${id}.zip` };
}

// b: 2 pictures, ch: 2 pictures, k: 1 picture, č: 2 pictures (háček), á: 1 picture (čárka).
const WORDS: PexesoWord[] = [
  word('banan', 'b'), word('beran', 'b'), word('chleba', 'ch'), word('chobotnice', 'ch'), word('kure', 'k'),
  word('cmelak', 'č'), word('cepice', 'č'), word('auto', 'á'),
];

function settingsWith(overrides: Partial<PexesoSettings>): PexesoSettings {
  return { ...DEFAULT_SETTINGS, ...overrides };
}

const IMAGE_COLUMN = { type: 'image', letterCase: 'upper', letterStyle: 'print' } as const;
const SOUND_COLUMN = { type: 'sound', letterCase: 'upper', letterStyle: 'print' } as const;
const LOWER_CURSIVE_COLUMN = { type: 'letter', letterCase: 'lower', letterStyle: 'cursiveComenia' } as const;

describe('letter pools ("Q&A 8")', () => {
  test('defaults: háčky on, čárky off, CH always -> 42 - 7 letters', () => {
    const pool = diacriticsLetterPool(DEFAULT_SETTINGS);
    expect(pool).toHaveLength(35);
    expect(pool).toEqual(expect.arrayContaining(['ch', 'č', 'ď', 'ě', 'ň', 'ř', 'š', 'ť', 'ž', 'q', 'w', 'x']));
    for (const letter of ['á', 'é', 'í', 'ó', 'ú', 'ý', 'ů']) {
      expect(pool).not.toContain(letter);
    }
  });

  test('háčky off, čárky on', () => {
    const pool = diacriticsLetterPool({ useHacky: false, useCarky: true });
    expect(pool).toHaveLength(34);
    expect(pool).toContain('ů');
    expect(pool).toContain('ch');
    expect(pool).not.toContain('č');
  });

  test('both off -> 27 base letters incl. CH; both on -> 42', () => {
    expect(diacriticsLetterPool({ useHacky: false, useCarky: false })).toHaveLength(27);
    expect(diacriticsLetterPool({ useHacky: true, useCarky: true })).toEqual([...CZECH_ALPHABET]);
  });

  test('letters vs letters: the whole diacritics pool is available', () => {
    expect(availableLetters(DEFAULT_SETTINGS, WORDS)).toHaveLength(35);
  });

  test('one image column: only letters having a picture (∩ diacritics)', () => {
    const settings = settingsWith({ columns: [IMAGE_COLUMN, DEFAULT_SETTINGS.columns[1]] });
    expect(availableLetters(settings, WORDS).sort()).toEqual(['b', 'ch', 'k', 'č'].sort());
    expect(availableLetters({ ...settings, useCarky: true }, WORDS)).toContain('á');
    expect(availableLetters({ ...settings, useHacky: false }, WORDS)).not.toContain('č');
  });

  test('images vs images: only letters with 2 different pictures ("Q&A 9")', () => {
    const settings = settingsWith({ columns: [IMAGE_COLUMN, IMAGE_COLUMN] });
    expect(availableLetters(settings, WORDS).sort()).toEqual(['b', 'ch', 'č'].sort());
  });

  test('duplicate word ids are counted once', () => {
    const settings = settingsWith({ columns: [IMAGE_COLUMN, IMAGE_COLUMN] });
    expect(availableLetters(settings, [word('kure', 'k'), word('kure', 'k')])).toEqual([]);
  });

  test('sizes exceeding the available letters are disabled; effective size falls back to the largest smaller one', () => {
    expect(isSizeAvailable(boardSizeById('2x3')!, 3)).toBe(true);
    expect(isSizeAvailable(boardSizeById('2x4')!, 3)).toBe(false);
    const settings = settingsWith({ sizeId: '4x10' });
    expect(effectiveBoardSize(settings, 35)?.id).toBe('4x10');
    expect(effectiveBoardSize(settings, 13)?.id).toBe('3x8');
    expect(effectiveBoardSize(settings, 3)?.id).toBe('2x3');
    expect(effectiveBoardSize(settings, 1)).toBeUndefined();
    expect(effectiveBoardSize(settingsWith({ sizeId: '2x2' }), 30)?.id).toBe('2x2');
  });
});

describe('sanitizeSettings', () => {
  test('garbage -> defaults', () => {
    expect(sanitizeSettings(null)).toEqual(DEFAULT_SETTINGS);
    expect(sanitizeSettings('x')).toEqual(DEFAULT_SETTINGS);
    expect(sanitizeSettings({ sizeId: '3x5', useHacky: 'yes', columns: [{ type: 'video' }] })).toEqual(DEFAULT_SETTINGS);
  });

  test('valid values are kept (round trip)', () => {
    const settings: PexesoSettings = {
      useHacky: false,
      useCarky: true,
      sizeId: '4x10',
      soundOn: false,
      columns: [LOWER_CURSIVE_COLUMN, { type: 'letter', letterCase: 'upper', letterStyle: 'cursiveTraditional' }],
    };
    expect(sanitizeSettings(JSON.parse(JSON.stringify(settings)))).toEqual(settings);
  });
});


// Slots: 0:A 1:B 2:A 3:C 4:B 5:C
function smallGame(): GameState {
  return createInitialState(deckFromLetters(['A', 'B', 'A', 'C', 'B', 'C']));
}

function apply(state: GameState, ...actions: GameAction[]): GameState {
  return actions.reduce(gameReducer, state);
}

const tap = (cardId: number): GameAction => ({ type: 'tapCard', cardId });
const background: GameAction = { type: 'tapBackground' };

describe('CZECH_ALPHABET', () => {
  test('has 42 distinct letters including CH and letters with diacritics', () => {
    expect(CZECH_ALPHABET).toHaveLength(42);
    expect(new Set(CZECH_ALPHABET).size).toBe(42);
    for (const letter of ['ch', 'ď', 'ť', 'ů', 'ě', 'ř', 'ž', 'ň']) {
      expect(CZECH_ALPHABET).toContain(letter);
    }
  });
});

describe('createDeck', () => {
  test.each([1, 2, 3, 42, 12345])('seed %i: 18 cards, 9 distinct letters each exactly twice (once per column)', (seed) => {
    const deck = createDeck(DEFAULT_SETTINGS, WORDS, 9, seededRandom(seed));
    expect(deck).toHaveLength(18);
    deck.forEach((card, index) => {
      expect(card.id).toBe(index);
      expect(card.isRemoved).toBe(false);
      expect(diacriticsLetterPool(DEFAULT_SETTINGS)).toContain(card.letter);
    });
    const counts = new Map<string, number>();
    deck.forEach((card) => counts.set(card.letter, (counts.get(card.letter) ?? 0) + 1));
    expect(counts.size).toBe(9);
    counts.forEach((count) => expect(count).toBe(2));
    for (const letter of counts.keys()) {
      expect(deck.filter((card) => card.letter === letter).map((card) => card.column).sort()).toEqual([0, 1]);
    }
  });

  test('different seeds give different decks (randomness is used)', () => {
    const first = createDeck(DEFAULT_SETTINGS, WORDS, 9, seededRandom(1)).map((card) => card.letter).join(',');
    const second = createDeck(DEFAULT_SETTINGS, WORDS, 9, seededRandom(2)).map((card) => card.letter).join(',');
    expect(first).not.toBe(second);
  });

  test('works with Math.random default; 4x10 = 40 cards', () => {
    expect(createDeck(DEFAULT_SETTINGS, WORDS, 20)).toHaveLength(40);
  });

  test('throws when more pairs are requested than available letters', () => {
    const settings = settingsWith({ columns: [IMAGE_COLUMN, IMAGE_COLUMN] });
    expect(() => createDeck(settings, WORDS, 4, seededRandom(1))).toThrow();
    expect(createDeck(settings, WORDS, 3, seededRandom(1))).toHaveLength(6);
  });

  test('letter faces follow the column case / style; CH shown as CH / ch', () => {
    const settings = settingsWith({ useCarky: true, columns: [DEFAULT_SETTINGS.columns[0], LOWER_CURSIVE_COLUMN] });
    const deck = createDeck(settings, WORDS, 42, seededRandom(5));
    for (const card of deck) {
      expect(card.face.type).toBe('letter');
      if (card.face.type === 'letter') {
        expect(card.face.text).toBe(card.column === 0 ? card.letter.toUpperCase() : card.letter);
        expect(card.face.letterStyle).toBe(card.column === 0 ? 'print' : 'cursiveComenia');
      }
    }
    expect(letterText('ch', 'upper')).toBe('CH');
    expect(letterText('ch', 'lower')).toBe('ch');
    expect(letterText('ž', 'upper')).toBe('Ž');
  });

  test.each([1, 2, 3, 4, 5, 6])('seed %i: images vs images -> two DIFFERENT pictures with the same first letter', (seed) => {
    const settings = settingsWith({ columns: [IMAGE_COLUMN, IMAGE_COLUMN] });
    const deck = createDeck(settings, WORDS, 3, seededRandom(seed));
    for (const letter of ['b', 'ch', 'č']) {
      const pair = deck.filter((card) => card.letter === letter);
      expect(pair).toHaveLength(2);
      const ids = pair.map((card) => (card.face.type === 'image' ? card.face.word.id : 'not-image'));
      expect(ids[0]).not.toBe(ids[1]);
      pair.forEach((card) => expect(card.face.type === 'image' && card.face.word.firstLetter).toBe(letter));
    }
  });

  test('images vs sound: image key = first letter of the word, sound card has no visible letter', () => {
    const settings = settingsWith({ columns: [IMAGE_COLUMN, SOUND_COLUMN] });
    const deck = createDeck(settings, WORDS, 4, seededRandom(3));
    expect(deck.filter((card) => card.column === 1).every((card) => card.face.type === 'sound')).toBe(true);
    for (const card of deck.filter((card) => card.column === 0)) {
      expect(card.face.type === 'image' && card.face.word.firstLetter).toBe(card.letter);
    }
  });
});

describe('gameReducer', () => {
  test('first tap opens a card; tapping the same open card does nothing', () => {
    const opened = apply(smallGame(), tap(0));
    expect(opened.openCardIds).toEqual([0]);
    expect(apply(opened, tap(0))).toBe(opened);
    expect(apply(opened, background)).toBe(opened);
  });

  test('match removes both cards immediately and counts a right match', () => {
    const state = apply(smallGame(), tap(0), tap(2));
    expect(state.openCardIds).toEqual([]);
    expect(state.cards[0].isRemoved).toBe(true);
    expect(state.cards[2].isRemoved).toBe(true);
    expect(state.cards.filter((card) => card.isRemoved)).toHaveLength(2);
    expect(state.rightMatches).toBe(1);
    expect(state.wrongMatches).toBe(0);
    expect(state.attempts).toBe(1);
    expect(state.isGameOver).toBe(false);
  });

  test('mismatch stays open and hides after the timeout with the current token', () => {
    const mismatch = apply(smallGame(), tap(0), tap(1));
    expect(mismatch.openCardIds).toEqual([0, 1]);
    expect(mismatch.wrongMatches).toBe(0); // neutral: nothing was known yet ("Follow-up prompt 6")
    expect(mismatch.attempts).toBe(1);
    const hidden = apply(mismatch, { type: 'mismatchTimeout', token: mismatch.mismatchToken });
    expect(hidden.openCardIds).toEqual([]);
    expect(hidden.cards.every((card) => !card.isRemoved)).toBe(true);
  });

  test('early tap on background hides the mismatch', () => {
    const state = apply(smallGame(), tap(0), tap(1), background);
    expect(state.openCardIds).toEqual([]);
    expect(state.wrongMatches).toBe(0);
  });

  test('early tap on a third hidden card hides the mismatch and opens that card as first', () => {
    const state = apply(smallGame(), tap(0), tap(1), tap(3));
    expect(state.openCardIds).toEqual([3]);
    expect(isCardFaceUp(state, 0)).toBe(false);
    expect(isCardFaceUp(state, 1)).toBe(false);
    expect(state.attempts).toBe(1);
  });

  test('early tap on one of the mismatched open cards just hides both', () => {
    const state = apply(smallGame(), tap(0), tap(1), tap(1));
    expect(state.openCardIds).toEqual([]);
  });

  test('tap on an empty slot (removed card) acts as background', () => {
    const matched = apply(smallGame(), tap(0), tap(2)); // A pair removed
    const withMismatch = apply(matched, tap(1), tap(3));
    expect(withMismatch.openCardIds).toEqual([1, 3]);
    const state = apply(withMismatch, tap(0));
    expect(state.openCardIds).toEqual([]);
    // Empty slot tap with nothing / one open does nothing.
    const single = apply(matched, tap(1));
    expect(apply(single, tap(2))).toBe(single);
  });

  test('stale timeout does not hide a newly opened card or a newer mismatch', () => {
    const firstMismatch = apply(smallGame(), tap(0), tap(1));
    const staleToken = firstMismatch.mismatchToken;

    // Early tap on card 3 -> card 3 is the new first card; the old timeout fires afterwards.
    const newFirst = apply(firstMismatch, tap(3));
    const afterStale = apply(newFirst, { type: 'mismatchTimeout', token: staleToken });
    expect(afterStale.openCardIds).toEqual([3]);

    // A new mismatch (3:C, 4:B) - the stale timeout still must not hide it.
    const secondMismatch = apply(newFirst, tap(4));
    expect(secondMismatch.openCardIds).toEqual([3, 4]);
    expect(secondMismatch.mismatchToken).not.toBe(staleToken);
    expect(apply(secondMismatch, { type: 'mismatchTimeout', token: staleToken }).openCardIds).toEqual([3, 4]);
    expect(
      apply(secondMismatch, { type: 'mismatchTimeout', token: secondMismatch.mismatchToken }).openCardIds,
    ).toEqual([]);
  });

  test('match right after a mismatch-hiding tap works (third card becomes first, then matches)', () => {
    // 0:A 1:B mismatch, tap 2 (A) -> first, tap 0 (A) -> match.
    const state = apply(smallGame(), tap(0), tap(1), tap(2), tap(0));
    expect(state.cards[0].isRemoved).toBe(true);
    expect(state.cards[2].isRemoved).toBe(true);
    expect(state.rightMatches).toBe(1);
    expect(state.wrongMatches).toBe(0);
    expect(state.attempts).toBe(2);
  });

  test('game over after all pairs are matched, with correct stats; taps are then ignored', () => {
    const thirdMismatch = apply(
      smallGame(),
      tap(0), tap(1), background, // neutral (nothing seen before)
      tap(4), tap(3), tap(0), // wrong 1 (partner of first card 4:B = 1 seen), then 0 becomes first
      tap(2), // right 1 (A)
      tap(1), tap(3), // wrong 2 (partner of 1:B = 4 seen)
    );
    const state = apply(
      thirdMismatch,
      { type: 'mismatchTimeout', token: thirdMismatch.mismatchToken },
      tap(1), tap(4), // right 2 (B)
      tap(3), tap(5), // right 3 (C)
    );
    expect(state.isGameOver).toBe(true);
    expect(state.cards.every((card) => card.isRemoved)).toBe(true);
    expect(state.rightMatches).toBe(3);
    expect(state.wrongMatches).toBe(2);
    expect(state.attempts).toBe(6);
    expect(apply(state, tap(0))).toBe(state);
  });

  test('full 18-card deck can be completed with 9 right matches and no wrong ones', () => {
    let state = createInitialState(createDeck(DEFAULT_SETTINGS, WORDS, 9, seededRandom(7)));
    for (const card of state.cards) {
      if (state.cards[card.id].isRemoved) {
        continue;
      }
      const partner = state.cards.find((other) => other.letter === card.letter && other.id !== card.id)!;
      state = apply(state, tap(card.id), tap(partner.id));
    }
    expect(state.isGameOver).toBe(true);
    expect(state.rightMatches).toBe(9);
    expect(state.wrongMatches).toBe(0);
    expect(state.attempts).toBe(9);
  });

  test('newGame resets the state', () => {
    const played = apply(smallGame(), tap(0), tap(1));
    const cards = createDeck(DEFAULT_SETTINGS, WORDS, 9, seededRandom(99));
    const fresh = apply(played, { type: 'newGame', cards });
    expect(fresh.cards).toBe(cards);
    expect(fresh.openCardIds).toEqual([]);
    expect(fresh.rightMatches).toBe(0);
    expect(fresh.wrongMatches).toBe(0);
    expect(fresh.attempts).toBe(0);
    expect(fresh.revealCounts.every((count) => count === 0)).toBe(true);
    expect(fresh.revealToken).toBe(played.revealToken);
    expect(fresh.isGameOver).toBe(false);
    expect(fresh.gameNumber).toBe(played.gameNumber + 1);
  });

  test('newGame keeps the mismatch token monotonic (a timeout from the previous game never matches)', () => {
    const played = apply(smallGame(), tap(0), tap(1));
    const oldToken = played.mismatchToken;
    expect(oldToken).toBeGreaterThan(0);
    const fresh = apply(played, { type: 'newGame', cards: deckFromLetters(['A', 'B', 'A', 'B']) });
    expect(fresh.mismatchToken).toBe(oldToken);
    const newMismatch = apply(fresh, tap(0), tap(1));
    expect(newMismatch.mismatchToken).toBeGreaterThan(oldToken);
    // The old game's timeout is ignored in the new game.
    expect(apply(newMismatch, { type: 'mismatchTimeout', token: oldToken }).openCardIds).toEqual([0, 1]);
  });

  test('actions after game over are ignored (tapCard, tapBackground, mismatchTimeout)', () => {
    const over = apply(createInitialState(deckFromLetters(['A', 'A'])), tap(0), tap(1));
    expect(over.isGameOver).toBe(true);
    expect(apply(over, tap(0))).toBe(over);
    expect(apply(over, tap(1))).toBe(over);
    expect(apply(over, background)).toBe(over);
    expect(apply(over, { type: 'mismatchTimeout', token: over.mismatchToken })).toBe(over);
  });

  test('invalid card id is ignored (acts as background tap)', () => {
    const opened = apply(smallGame(), tap(0));
    expect(apply(opened, tap(99))).toBe(opened);
    expect(apply(opened, tap(-1))).toBe(opened);
    const mismatch = apply(smallGame(), tap(0), tap(1));
    expect(apply(mismatch, tap(99)).openCardIds).toEqual([]);
  });
});

// Scoring - `_LetterPexeso_PROMPTS.md` / "Follow-up prompt 6" + "Q&A 11": match = right; mismatch = wrong only if the
// partner of the FIRST card was revealed before, or either card is now revealed >= 3 times (incl. this flip); else neutral.
describe('scoring', () => {
  // Slots: 0:A 1:B 2:C 3:D 4:A 5:B 6:C 7:D
  function eightGame(): GameState {
    return createInitialState(deckFromLetters(['A', 'B', 'C', 'D', 'A', 'B', 'C', 'D']));
  }

  test('blind mismatches of never-seen pairs are neutral (counted in attempts only)', () => {
    const state = apply(eightGame(), tap(0), tap(1), background, tap(2), tap(3), background);
    expect(state.wrongMatches).toBe(0);
    expect(state.attempts).toBe(2);
  });

  test('wrong when the partner of the FIRST card was seen before', () => {
    // 0:A seen; later 4:A (first) + 2:C -> partner of 4 (0) was seen -> wrong.
    const state = apply(eightGame(), tap(0), tap(1), background, tap(4), tap(2));
    expect(state.wrongMatches).toBe(1);
  });

  test('NOT wrong when only the partner of the SECOND card was seen before (Q&A 11)', () => {
    // 1:B seen; later 2:C (first, new, partner 6 never seen) + 5:B (second) -> blind pick -> neutral.
    const state = apply(eightGame(), tap(0), tap(1), background, tap(2), tap(5));
    expect(state.wrongMatches).toBe(0);
    expect(state.attempts).toBe(2);
  });

  test('wrong when a card is turned for the 3rd time (incl. this flip) even without any seen partner', () => {
    // Cards 0:A and 1:B are re-flipped together; their partners 4 / 5 are never shown.
    const first = apply(eightGame(), tap(0), tap(1), background); // reveals 1 each -> neutral
    const second = apply(first, tap(0), tap(1), background); // reveals 2 each -> neutral
    expect(second.wrongMatches).toBe(0);
    const third = apply(second, tap(0), tap(1)); // reveals 3 each -> wrong
    expect(third.wrongMatches).toBe(1);
    expect(third.revealCounts[0]).toBe(3);
    expect(third.attempts).toBe(3);
  });

  test('3rd reveal of only ONE of the two cards is enough', () => {
    // card 0 revealed 3 times with always-new partners that are never paired with a seen card.
    const state = apply(createInitialState(deckFromLetters(['A', 'B', 'C', 'D', 'E', 'A', 'B', 'C', 'D', 'E'])),
      tap(0), tap(1), background, // 0:1  neutral
      tap(0), tap(2), background, // 0:2  neutral (partner of 2 = 7 never seen; partner of 0 = 5 never seen)
      tap(0), tap(3)); // 0:3  -> wrong
    expect(state.wrongMatches).toBe(1);
    expect(state.attempts).toBe(3);
  });

  test('a match is always right, even after many reveals', () => {
    const state = apply(eightGame(), tap(0), tap(1), background, tap(0), tap(1), background, tap(0), tap(4));
    expect(state.rightMatches).toBe(1);
    expect(state.cards[0].isRemoved).toBe(true);
  });

  test('every face-up turn bumps the reveal token and records the revealed card (sound on flip only - "Q&A 9")', () => {
    const opened = apply(eightGame(), tap(3));
    expect(opened.revealToken).toBe(1);
    expect(opened.lastRevealedCardId).toBe(3);
    const matched = apply(opened, tap(7));
    expect(matched.revealToken).toBe(2);
    expect(matched.lastRevealedCardId).toBe(7);
    // Tapping the already-open card / background does not reveal anything.
    expect(apply(opened, tap(3)).revealToken).toBe(1);
    expect(apply(opened, background).revealToken).toBe(1);
  });
});
