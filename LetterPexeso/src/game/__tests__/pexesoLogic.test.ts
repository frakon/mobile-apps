import {
  Card,
  CZECH_ALPHABET,
  GameAction,
  GameState,
  createDeck,
  createInitialState,
  gameReducer,
  gridShapeFor,
  isCardFaceUp,
} from '../pexesoLogic';

// `_LetterPexeso_PROMPTS.md` / "Follow-up 1: landscape".
test('gridShapeFor: 6 x 3 for a landscape (or square) window, 3 x 6 for portrait; always 18 slots', () => {
  expect(gridShapeFor(667, 375)).toEqual({ columns: 6, rows: 3 });
  expect(gridShapeFor(500, 500)).toEqual({ columns: 6, rows: 3 });
  expect(gridShapeFor(375, 667)).toEqual({ columns: 3, rows: 6 });
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
  return letters.map((letter, index) => ({ id: index, letter, isRemoved: false }));
}

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
    for (const letter of ['CH', 'Ď', 'Ť', 'Ů', 'Ě', 'Ř', 'Ž', 'Ň']) {
      expect(CZECH_ALPHABET).toContain(letter);
    }
  });
});

describe('createDeck', () => {
  test.each([1, 2, 3, 42, 12345])('seed %i: 18 cards, 9 distinct Czech letters each exactly twice', (seed) => {
    const deck = createDeck(seededRandom(seed));
    expect(deck).toHaveLength(18);
    deck.forEach((card, index) => {
      expect(card.id).toBe(index);
      expect(card.isRemoved).toBe(false);
      expect(CZECH_ALPHABET).toContain(card.letter);
    });
    const counts = new Map<string, number>();
    deck.forEach((card) => counts.set(card.letter, (counts.get(card.letter) ?? 0) + 1));
    expect(counts.size).toBe(9);
    counts.forEach((count) => expect(count).toBe(2));
  });

  test('different seeds give different decks (randomness is used)', () => {
    const first = createDeck(seededRandom(1)).map((card) => card.letter).join(',');
    const second = createDeck(seededRandom(2)).map((card) => card.letter).join(',');
    expect(first).not.toBe(second);
  });

  test('works with Math.random default', () => {
    expect(createDeck()).toHaveLength(18);
  });

  test('throws when more pairs are requested than letters in the pool', () => {
    expect(() => createDeck(seededRandom(1), ['A', 'B'], 3)).toThrow();
    expect(createDeck(seededRandom(1), ['A', 'B'], 2)).toHaveLength(4);
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
    expect(mismatch.wrongMatches).toBe(1);
    expect(mismatch.attempts).toBe(1);
    const hidden = apply(mismatch, { type: 'mismatchTimeout', token: mismatch.mismatchToken });
    expect(hidden.openCardIds).toEqual([]);
    expect(hidden.cards.every((card) => !card.isRemoved)).toBe(true);
  });

  test('early tap on background hides the mismatch', () => {
    const state = apply(smallGame(), tap(0), tap(1), background);
    expect(state.openCardIds).toEqual([]);
    expect(state.wrongMatches).toBe(1);
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
    expect(state.wrongMatches).toBe(1);
    expect(state.attempts).toBe(2);
  });

  test('game over after all pairs are matched, with correct stats; taps are then ignored', () => {
    const thirdMismatch = apply(
      smallGame(),
      tap(0), tap(1), background, // wrong 1
      tap(3), tap(4), tap(0), // wrong 2, then 0 becomes first
      tap(2), // right 1 (A)
      tap(1), tap(3), // wrong 3
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
    expect(state.wrongMatches).toBe(3);
    expect(state.attempts).toBe(6);
    expect(apply(state, tap(0))).toBe(state);
  });

  test('full 18-card deck can be completed with 9 right matches and no wrong ones', () => {
    let state = createInitialState(createDeck(seededRandom(7)));
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
    const cards = createDeck(seededRandom(99));
    const fresh = apply(played, { type: 'newGame', cards });
    expect(fresh.cards).toBe(cards);
    expect(fresh.openCardIds).toEqual([]);
    expect(fresh.rightMatches).toBe(0);
    expect(fresh.wrongMatches).toBe(0);
    expect(fresh.attempts).toBe(0);
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
