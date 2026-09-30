// Pure game logic of LetterPexeso (no React / React Native imports) - unit-testable on any machine.
// Requirements: see `_LetterPexeso_PROMPTS.md`, sections "User request (verbatim)" and "Master decisions (not user-specified)".

// Full Czech alphabet (42 letters, "CH" is one letter) - `_LetterPexeso_PROMPTS.md` / "Master decisions (not user-specified)".
// Kept as one constant for easy change of the letter pool.
export const CZECH_ALPHABET: readonly string[] = [
  'A', 'Á', 'B', 'C', 'Č', 'D', 'Ď', 'E', 'É', 'Ě', 'F', 'G', 'H', 'CH',
  'I', 'Í', 'J', 'K', 'L', 'M', 'N', 'Ň', 'O', 'Ó', 'P', 'Q', 'R', 'Ř',
  'S', 'Š', 'T', 'Ť', 'U', 'Ú', 'Ů', 'V', 'W', 'X', 'Y', 'Ý', 'Z', 'Ž',
];

// 9 letters -> 18 cards in a 3 x 6 grid - `_LetterPexeso_PROMPTS.md` / "User request (verbatim)".
export const PAIR_COUNT = 9;
export const GRID_COLUMNS = 3;
export const GRID_ROWS = 6;
// Landscape layout 6 x 3 (same 18 cards) - `_LetterPexeso_PROMPTS.md` / "Follow-up 1: landscape".
// The portrait 3 x 6 above stays as the fallback for a window taller than wide (e.g. the web preview).
export const LANDSCAPE_GRID_COLUMNS = 6;
export const LANDSCAPE_GRID_ROWS = 3;

// Grid shape for the given window size: 6 x 3 when width >= height, else 3 x 6.
export function gridShapeFor(windowWidth: number, windowHeight: number): { readonly columns: number; readonly rows: number } {
  return windowWidth >= windowHeight
    ? { columns: LANDSCAPE_GRID_COLUMNS, rows: LANDSCAPE_GRID_ROWS }
    : { columns: GRID_COLUMNS, rows: GRID_ROWS };
}

// Two different open cards hide after 1 second - `_LetterPexeso_PROMPTS.md` / "User request (verbatim)".
export const MISMATCH_HIDE_DELAY_MS = 1000;

// Returns a float in [0, 1) like Math.random; injectable for deterministic tests.
export type RandomSource = () => number;

export interface Card {
  // Stable id == index (grid slot) in the deck; the grid never reflows.
  readonly id: number;
  readonly letter: string;
  // Matched cards are removed (their slot stays empty).
  readonly isRemoved: boolean;
}

export interface GameState {
  readonly cards: readonly Card[];
  // Ids of currently face-up (not removed) cards: 0, 1, or 2 entries. 2 entries == a shown mismatch.
  readonly openCardIds: readonly number[];
  // Incremented every time a mismatch pair gets shown. A timeout carries the token it was scheduled for,
  // so a stale timeout (mismatch already hidden by an early tap) is ignored.
  readonly mismatchToken: number;
  readonly rightMatches: number;
  readonly wrongMatches: number;
  // Every opening of a second card is one attempt (rightMatches + wrongMatches).
  readonly attempts: number;
  readonly isGameOver: boolean;
  // Incremented by every newGame. The UI keys the cards by it, so each game mounts fresh card components with
  // fresh flip animation values (verification finding "flip stuck after fast match").
  readonly gameNumber: number;
}

export type GameAction =
  | { readonly type: 'tapCard'; readonly cardId: number }
  | { readonly type: 'tapBackground' }
  | { readonly type: 'mismatchTimeout'; readonly token: number }
  | { readonly type: 'newGame'; readonly cards: readonly Card[] };

function shuffleInPlace<T>(items: T[], random: RandomSource): T[] {
  // Fisher-Yates shuffle
  for (let index = items.length - 1; index > 0; index--) {
    const otherIndex = Math.floor(random() * (index + 1));
    const temporary = items[index];
    items[index] = items[otherIndex];
    items[otherIndex] = temporary;
  }
  return items;
}

// Random 9 distinct letters of the pool, each twice, shuffled - `_LetterPexeso_PROMPTS.md` / "User request (verbatim)".
export function createDeck(
  random: RandomSource = Math.random,
  letterPool: readonly string[] = CZECH_ALPHABET,
  pairCount: number = PAIR_COUNT,
): Card[] {
  if (pairCount > letterPool.length) {
    throw new Error(`pairCount ${pairCount} exceeds the letter pool size ${letterPool.length}`);
  }
  const chosenLetters = shuffleInPlace([...letterPool], random).slice(0, pairCount);
  const letters = shuffleInPlace([...chosenLetters, ...chosenLetters], random);
  return letters.map((letter, index) => ({ id: index, letter, isRemoved: false }));
}

export function createInitialState(cards: readonly Card[]): GameState {
  return {
    cards,
    openCardIds: [],
    mismatchToken: 0,
    rightMatches: 0,
    wrongMatches: 0,
    attempts: 0,
    isGameOver: cards.every((card) => card.isRemoved),
    gameNumber: 0,
  };
}

export function createNewGame(random: RandomSource = Math.random): GameState {
  return createInitialState(createDeck(random));
}

export function isCardFaceUp(state: GameState, cardId: number): boolean {
  return state.openCardIds.includes(cardId);
}

export function isMismatchShown(state: GameState): boolean {
  return state.openCardIds.length === 2;
}

// Hides a shown mismatch pair (no-op otherwise).
function hideMismatch(state: GameState): GameState {
  return isMismatchShown(state) ? { ...state, openCardIds: [] } : state;
}

function openCard(state: GameState, card: Card): GameState {
  if (state.openCardIds.length === 0) {
    return { ...state, openCardIds: [card.id] };
  }

  // Exactly one card open -> this is the second card = one attempt.
  const firstCard = state.cards[state.openCardIds[0]];
  const attempts = state.attempts + 1;

  if (firstCard.letter === card.letter) {
    // Same letters disappear immediately - `_LetterPexeso_PROMPTS.md` / "User request (verbatim)".
    const cards = state.cards.map((existing) =>
      existing.id === firstCard.id || existing.id === card.id ? { ...existing, isRemoved: true } : existing,
    );
    return {
      ...state,
      cards,
      openCardIds: [],
      attempts,
      rightMatches: state.rightMatches + 1,
      isGameOver: cards.every((existing) => existing.isRemoved),
    };
  }

  // Different letters stay visible until timeout or next tap - `_LetterPexeso_PROMPTS.md` / "User request (verbatim)".
  return {
    ...state,
    openCardIds: [firstCard.id, card.id],
    attempts,
    wrongMatches: state.wrongMatches + 1,
    mismatchToken: state.mismatchToken + 1,
  };
}

function tapCard(state: GameState, cardId: number): GameState {
  const card = state.cards[cardId];
  if (card === undefined || card.isRemoved) {
    // Tap on an empty slot (removed card) behaves as a tap on the background.
    return hideMismatch(state);
  }

  if (isMismatchShown(state)) {
    // Tap during a shown mismatch hides both; a tapped hidden card becomes the new first open card
    // - `_LetterPexeso_PROMPTS.md` / "Master decisions (not user-specified)".
    const wasOpen = isCardFaceUp(state, cardId);
    const hidden = hideMismatch(state);
    return wasOpen ? hidden : openCard(hidden, card);
  }

  if (isCardFaceUp(state, cardId)) {
    // Tapping the single already-open card does nothing.
    return state;
  }

  return openCard(state, card);
}

// Reducer-style transition function (pure).
export function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'newGame':
      // The mismatch token stays monotonic across games, so a timeout scheduled in a previous game can never
      // match a token of the new game (verification finding "mismatchToken resets to 0 on newGame").
      return { ...createInitialState(action.cards), mismatchToken: state.mismatchToken, gameNumber: state.gameNumber + 1 };
    case 'tapCard':
      return state.isGameOver ? state : tapCard(state, action.cardId);
    case 'tapBackground':
      return hideMismatch(state);
    case 'mismatchTimeout':
      // Stale timeouts (token of an already-hidden mismatch) are ignored.
      return action.token === state.mismatchToken ? hideMismatch(state) : state;
    default:
      return state;
  }
}
