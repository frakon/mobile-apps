// Pure game logic of LetterPexeso (no React / React Native imports) - unit-testable on any machine.
// IDENTICAL copy in LetterPexeso/src/game/pexesoLogic.ts and LetterTraining/src/pexeso/game/pexesoLogic.ts - keep both in sync.
// Requirements: see `_LetterPexeso_PROMPTS.md`, sections "User request (verbatim)", "Master decisions (not user-specified)",
// "Follow-up 1: landscape", "Follow-up prompt 6 — Pexeso improvements ...", "Q&A 8 — Pexeso improvements round 1" and
// "Q&A 9 — Pexeso improvements round 2".

// Full Czech alphabet (42 letters, "CH" is one letter), lowercase keys - `_LetterPexeso_PROMPTS.md` /
// "Master decisions (not user-specified)". Letter keys are lowercase everywhere (same as words.ts `firstLetter`).
export const CZECH_ALPHABET: readonly string[] = [
  'a', 'á', 'b', 'c', 'č', 'd', 'ď', 'e', 'é', 'ě', 'f', 'g', 'h', 'ch',
  'i', 'í', 'j', 'k', 'l', 'm', 'n', 'ň', 'o', 'ó', 'p', 'q', 'r', 'ř',
  's', 'š', 't', 'ť', 'u', 'ú', 'ů', 'v', 'w', 'x', 'y', 'ý', 'z', 'ž',
];

// Diacritics groups - `_LetterPexeso_PROMPTS.md` / "Q&A 8 — Pexeso improvements round 1" (háčky = Č Ď Ě Ň Ř Š Ť Ž;
// čárky = Á É Í Ó Ú Ý + Ů; CH always included). All other letters are always in the pool.
export const HACKY_LETTERS: readonly string[] = ['č', 'ď', 'ě', 'ň', 'ř', 'š', 'ť', 'ž'];
export const CARKY_LETTERS: readonly string[] = ['á', 'é', 'í', 'ó', 'ú', 'ý', 'ů'];

// Board sizes (rows x columns as named; 3x5 dropped) - `_LetterPexeso_PROMPTS.md` / "Q&A 8 — Pexeso improvements round 1".
export interface BoardSize {
  readonly id: string;
  readonly rows: number;
  readonly columns: number;
}
export const BOARD_SIZES: readonly BoardSize[] = [
  { id: '2x2', rows: 2, columns: 2 },
  { id: '2x3', rows: 2, columns: 3 },
  { id: '2x4', rows: 2, columns: 4 },
  { id: '3x4', rows: 3, columns: 4 },
  { id: '3x6', rows: 3, columns: 6 },
  { id: '3x8', rows: 3, columns: 8 },
  { id: '4x8', rows: 4, columns: 8 },
  { id: '4x10', rows: 4, columns: 10 },
];

export function pairCountOf(size: BoardSize): number {
  return (size.rows * size.columns) / 2;
}

export function boardSizeById(sizeId: string): BoardSize | undefined {
  return BOARD_SIZES.find((size) => size.id === sizeId);
}

// Card face types of one column: letters / images / sound-only (ear) - "Follow-up prompt 6".
export type CardFaceType = 'letter' | 'image' | 'sound';
export type LetterCase = 'upper' | 'lower';
// 'print' = tiskací, 'cursiveComenia' = psací – Comenia Script style, 'cursiveTraditional' = psací – tradiční vázané písmo
// - `_LetterPexeso_PROMPTS.md` / "Follow-up prompt 7 (verbatim)" + "Follow-up prompt 8 (verbatim)".
export type LetterStyle = 'print' | 'cursiveComenia' | 'cursiveTraditional';
export const LETTER_STYLES: readonly LetterStyle[] = ['print', 'cursiveComenia', 'cursiveTraditional'];

export interface ColumnSettings {
  readonly type: CardFaceType;
  // Used only when type === 'letter' (greyed out otherwise) - "Follow-up prompt 6".
  readonly letterCase: LetterCase;
  readonly letterStyle: LetterStyle;
}

export interface PexesoSettings {
  readonly useHacky: boolean;
  readonly useCarky: boolean;
  readonly sizeId: string;
  // Mutes letter + image cards only; sound-only cards always play - "Follow-up prompt 6".
  readonly soundOn: boolean;
  // Card 1 / card 2 of a pair - "Follow-up prompt 6" ("WHY the two columns").
  readonly columns: readonly [ColumnSettings, ColumnSettings];
}

// Defaults: háčky on, čárky off ("Follow-up prompt 6"); size 3x6, sound on, letters / capital / tiskací in both columns
// (FINAL SPEC of the evaluation; DECISION (not user-specified): these match the original game).
export const DEFAULT_COLUMN_SETTINGS: ColumnSettings = { type: 'letter', letterCase: 'upper', letterStyle: 'print' };
export const DEFAULT_SETTINGS: PexesoSettings = {
  useHacky: true,
  useCarky: false,
  sizeId: '3x6',
  soundOn: true,
  columns: [DEFAULT_COLUMN_SETTINGS, DEFAULT_COLUMN_SETTINGS],
};

// Validates untrusted (persisted) data; unknown / missing fields fall back to the defaults.
export function sanitizeSettings(raw: unknown): PexesoSettings {
  const value = (typeof raw === 'object' && raw !== null ? raw : {}) as Record<string, unknown>;
  const sanitizeColumn = (column: unknown): ColumnSettings => {
    const columnValue = (typeof column === 'object' && column !== null ? column : {}) as Record<string, unknown>;
    return {
      type: columnValue.type === 'image' || columnValue.type === 'sound' || columnValue.type === 'letter' ? columnValue.type : DEFAULT_COLUMN_SETTINGS.type,
      letterCase: columnValue.letterCase === 'lower' || columnValue.letterCase === 'upper' ? columnValue.letterCase : DEFAULT_COLUMN_SETTINGS.letterCase,
      letterStyle: LETTER_STYLES.includes(columnValue.letterStyle as LetterStyle) ? (columnValue.letterStyle as LetterStyle) : DEFAULT_COLUMN_SETTINGS.letterStyle,
    };
  };
  const columns = Array.isArray(value.columns) ? value.columns : [];
  return {
    useHacky: typeof value.useHacky === 'boolean' ? value.useHacky : DEFAULT_SETTINGS.useHacky,
    useCarky: typeof value.useCarky === 'boolean' ? value.useCarky : DEFAULT_SETTINGS.useCarky,
    sizeId: typeof value.sizeId === 'string' && boardSizeById(value.sizeId) !== undefined ? value.sizeId : DEFAULT_SETTINGS.sizeId,
    soundOn: typeof value.soundOn === 'boolean' ? value.soundOn : DEFAULT_SETTINGS.soundOn,
    columns: [sanitizeColumn(columns[0]), sanitizeColumn(columns[1])],
  };
}

// A picture usable on image cards: a Level-1-eligible word (words.ts) - "Follow-up prompt 6" / FINAL SPEC 4.
export interface PexesoWord {
  readonly id: string;
  readonly word: string;
  // Lowercase key ("ch" for ch-words).
  readonly firstLetter: string;
  // Metro module ids (require(...)).
  readonly image: number;
  readonly audio: number;
}

// Alphabet filtered by the diacritics checkboxes - "Q&A 8".
export function diacriticsLetterPool(settings: Pick<PexesoSettings, 'useHacky' | 'useCarky'>): string[] {
  return CZECH_ALPHABET.filter(
    (letter) => (settings.useHacky || !HACKY_LETTERS.includes(letter)) && (settings.useCarky || !CARKY_LETTERS.includes(letter)),
  );
}

function wordsByLetter(words: readonly PexesoWord[]): Map<string, PexesoWord[]> {
  const map = new Map<string, PexesoWord[]>();
  for (const word of words) {
    const list = map.get(word.firstLetter) ?? [];
    if (!list.some((existing) => existing.id === word.id)) {
      list.push(word);
    }
    map.set(word.firstLetter, list);
  }
  return map;
}

// Letters usable on the board = diacritics pool ∩ letters with enough pictures for every image column
// (images vs images need 2 DIFFERENT pictures with the same first letter) - "Q&A 9" / FINAL SPEC 5.
export function availableLetters(settings: PexesoSettings, words: readonly PexesoWord[]): string[] {
  const imageColumns = settings.columns.filter((column) => column.type === 'image').length;
  const byLetter = wordsByLetter(words);
  return diacriticsLetterPool(settings).filter((letter) => (byLetter.get(letter)?.length ?? 0) >= imageColumns);
}

// Sizes needing more pairs than available letters are disabled (greyed) - "Q&A 8" ("disable sizes needing more pairs").
export function isSizeAvailable(size: BoardSize, availableLetterCount: number): boolean {
  return pairCountOf(size) <= availableLetterCount;
}

// The size actually played: the chosen one, or (DECISION, not user-specified) the largest available smaller size when the
// chosen one needs more letters than available (e.g. after the image pool changed); undefined = not even 2x2 possible.
export function effectiveBoardSize(settings: PexesoSettings, availableLetterCount: number): BoardSize | undefined {
  const chosen = boardSizeById(settings.sizeId) ?? boardSizeById(DEFAULT_SETTINGS.sizeId)!;
  if (isSizeAvailable(chosen, availableLetterCount)) {
    return chosen;
  }
  const smaller = BOARD_SIZES.filter((size) => pairCountOf(size) < pairCountOf(chosen) && isSizeAvailable(size, availableLetterCount));
  return smaller.length > 0 ? smaller[smaller.length - 1] : undefined;
}

// Grid shape for the window: the longer side of the board along the longer window side (landscape -> 6 x 3 for 3x6,
// 10 x 4 for 4x10) - `_LetterPexeso_PROMPTS.md` / "Follow-up 1: landscape" (rows/cols swapped by orientation as before).
export function gridShapeFor(size: BoardSize, windowWidth: number, windowHeight: number): { readonly columns: number; readonly rows: number } {
  const longSide = Math.max(size.rows, size.columns);
  const shortSide = Math.min(size.rows, size.columns);
  return windowWidth >= windowHeight ? { columns: longSide, rows: shortSide } : { columns: shortSide, rows: longSide };
}

// Two different open cards hide after 1 second - `_LetterPexeso_PROMPTS.md` / "User request (verbatim)".
export const MISMATCH_HIDE_DELAY_MS = 1000;

// Returns a float in [0, 1) like Math.random; injectable for deterministic tests.
export type RandomSource = () => number;

export type CardFace =
  | { readonly type: 'letter'; readonly text: string; readonly letterStyle: LetterStyle }
  | { readonly type: 'image'; readonly word: PexesoWord }
  | { readonly type: 'sound' };

export interface Card {
  // Stable id == index (grid slot) in the deck; the grid never reflows.
  readonly id: number;
  // Lowercase letter key; the two cards of a pair share it (each letter at most once per board - "Follow-up prompt 6").
  readonly letter: string;
  // 0 = card 1 column, 1 = card 2 column of the settings.
  readonly column: 0 | 1;
  readonly face: CardFace;
  // Matched cards are removed (their slot stays empty).
  readonly isRemoved: boolean;
}

// Displayed letter text: CH as "CH" / "ch" (one letter), others upper/lower case.
export function letterText(letter: string, letterCase: LetterCase): string {
  return letterCase === 'upper' ? letter.toUpperCase() : letter.toLowerCase();
}

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

function faceFor(column: ColumnSettings, letter: string, word: PexesoWord | undefined): CardFace {
  if (column.type === 'image') {
    return { type: 'image', word: word! };
  }
  if (column.type === 'sound') {
    return { type: 'sound' };
  }
  return { type: 'letter', text: letterText(letter, column.letterCase), letterStyle: column.letterStyle };
}

// Random distinct letters of the available pool (each letter once per board), one card per column, shuffled.
// Images vs images: two DIFFERENT pictures with the same first letter - "Q&A 9". Throws when the pool is too small.
export function createDeck(settings: PexesoSettings, words: readonly PexesoWord[], pairCount: number, random: RandomSource = Math.random): Card[] {
  const pool = availableLetters(settings, words);
  if (pairCount > pool.length) {
    throw new Error(`pairCount ${pairCount} exceeds the available letter pool size ${pool.length}`);
  }
  const byLetter = wordsByLetter(words);
  const chosenLetters = shuffleInPlace([...pool], random).slice(0, pairCount);
  const unshuffled: Omit<Card, 'id'>[] = [];
  for (const letter of chosenLetters) {
    const pictures = shuffleInPlace([...(byLetter.get(letter) ?? [])], random);
    let pictureIndex = 0;
    for (const columnIndex of [0, 1] as const) {
      const column = settings.columns[columnIndex];
      const word = column.type === 'image' ? pictures[pictureIndex++] : undefined;
      unshuffled.push({ letter, column: columnIndex, face: faceFor(column, letter, word), isRemoved: false });
    }
  }
  return shuffleInPlace(unshuffled, random).map((card, index) => ({ ...card, id: index }));
}

export interface GameState {
  readonly cards: readonly Card[];
  // Ids of currently face-up (not removed) cards: 0, 1, or 2 entries. 2 entries == a shown mismatch.
  readonly openCardIds: readonly number[];
  // Incremented every time a mismatch pair gets shown. A timeout carries the token it was scheduled for,
  // so a stale timeout (mismatch already hidden by an early tap) is ignored.
  readonly mismatchToken: number;
  readonly rightMatches: number;
  // Wrong only when the player could have known (see openCard) - "Follow-up prompt 6" / "Q&A 11".
  readonly wrongMatches: number;
  // Every opening of a second card is one attempt (right + wrong + neutral).
  readonly attempts: number;
  // How many times each card (by id) has been turned face-up.
  readonly revealCounts: readonly number[];
  // Incremented on every card turned face-up; the UI plays the card's sound when it changes (sound on flip only - "Q&A 9").
  readonly revealToken: number;
  readonly lastRevealedCardId: number | undefined;
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

export function createInitialState(cards: readonly Card[]): GameState {
  return {
    cards,
    openCardIds: [],
    mismatchToken: 0,
    rightMatches: 0,
    wrongMatches: 0,
    attempts: 0,
    revealCounts: cards.map(() => 0),
    revealToken: 0,
    lastRevealedCardId: undefined,
    isGameOver: cards.every((card) => card.isRemoved),
    gameNumber: 0,
  };
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

function partnerOf(state: GameState, card: Card): Card | undefined {
  return state.cards.find((other) => other.id !== card.id && other.letter === card.letter);
}

// Number of times a card has been face-up at which a further mismatch counts as wrong - "Follow-up prompt 6".
export const KNOWN_AFTER_REVEALS = 3;

// Scoring of a mismatch - `_LetterPexeso_PROMPTS.md` / "Follow-up prompt 6" + "Q&A 11": wrong if the partner of the FIRST
// flipped card was already revealed before this attempt (the second card's partner does not count), OR either flipped card
// has now been revealed >= 3 times (incl. this flip); otherwise neutral (the player could not know).
export function isMismatchWrong(state: GameState, firstCard: Card, secondCard: Card, revealCounts: readonly number[]): boolean {
  const firstPartner = partnerOf(state, firstCard);
  const partnerSeen = firstPartner !== undefined && revealCounts[firstPartner.id] > 0;
  return partnerSeen || revealCounts[firstCard.id] >= KNOWN_AFTER_REVEALS || revealCounts[secondCard.id] >= KNOWN_AFTER_REVEALS;
}

function openCard(state: GameState, card: Card): GameState {
  const revealCounts = state.revealCounts.map((count, index) => (index === card.id ? count + 1 : count));
  const revealed = { revealCounts, revealToken: state.revealToken + 1, lastRevealedCardId: card.id };
  if (state.openCardIds.length === 0) {
    return { ...state, ...revealed, openCardIds: [card.id] };
  }

  // Exactly one card open -> this is the second card = one attempt.
  const firstCard = state.cards[state.openCardIds[0]];
  const attempts = state.attempts + 1;

  if (firstCard.letter === card.letter) {
    // Same letters disappear immediately - `_LetterPexeso_PROMPTS.md` / "User request (verbatim)"; a match is "right"
    // ("Follow-up prompt 6").
    const cards = state.cards.map((existing) =>
      existing.id === firstCard.id || existing.id === card.id ? { ...existing, isRemoved: true } : existing,
    );
    return {
      ...state,
      ...revealed,
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
    ...revealed,
    openCardIds: [firstCard.id, card.id],
    attempts,
    wrongMatches: state.wrongMatches + (isMismatchWrong(state, firstCard, card, revealCounts) ? 1 : 0),
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
      // The mismatch / reveal tokens stay monotonic across games, so a timeout scheduled in a previous game can never
      // match a token of the new game (verification finding "mismatchToken resets to 0 on newGame").
      return {
        ...createInitialState(action.cards),
        mismatchToken: state.mismatchToken,
        revealToken: state.revealToken,
        gameNumber: state.gameNumber + 1,
      };
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
