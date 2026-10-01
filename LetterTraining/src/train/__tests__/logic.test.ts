// Tests of the pure "Abecedový vlak" logic - `_LetterTraining_PROMPTS.md` / "## Follow-up prompt 5", "## Q&A 6", "## Q&A 7".

jest.mock('@react-native-async-storage/async-storage', () => require('@react-native-async-storage/async-storage/jest/async-storage-mock'));

import {
  shouldDeferBoardSize,
  CZ_ALPHABET,
  DEFAULT_WAITING_WAGONS,
  EN_ALPHABET,
  TrainGameState,
  assignWagonImages,
  clampWaitingWagons,
  computeTrainLayout,
  createTrainGame,
  dropZone,
  expectedLetter,
  isDropHit,
  isGameFinished,
  letterLabel,
  placeLetter,
  poolSlotPositions,
  NO_SHADES,
  selectionOutcome,
  shadesAfterConnect,
  shadesAfterWrongSelection,
  configureWagonPan,
  releaseReaction,
} from '../logic';
import { parseTrainSettings } from '../settings';

function sequenceRandom(values: number[]): () => number {
  let index = 0;
  return () => values[index++ % values.length];
}

describe('alphabets', () => {
  test('czech alphabet = the Q&A 6 list (incl. CH, háčky, no čárky/kroužky, no Ě)', () => {
    // The Q&A 6 answer says "35 letters" but its explicit list has 34 entries; the explicit list is implemented.
    expect(CZ_ALPHABET.join(' ')).toBe('a b c č d ď e f g h ch i j k l m n ň o p q r ř s š t ť u v w x y z ž');
    expect(CZ_ALPHABET).toHaveLength(34);
    for (const excluded of ['á', 'é', 'ě', 'í', 'ó', 'ú', 'ů', 'ý']) {
      expect(CZ_ALPHABET).not.toContain(excluded);
    }
  });

  test('english alphabet has 26 letters', () => {
    expect(EN_ALPHABET).toHaveLength(26);
    expect(EN_ALPHABET[0]).toBe('a');
    expect(EN_ALPHABET[25]).toBe('z');
  });

  test('labels by case', () => {
    expect(letterLabel('ch', 'upper')).toBe('CH');
    expect(letterLabel('ř', 'upper')).toBe('Ř');
    expect(letterLabel('ď', 'lower')).toBe('ď');
  });
});

describe('game sequence', () => {
  test('initial pool = the first N letters shuffled, clamped to 4..8', () => {
    const game = createTrainGame(CZ_ALPHABET, 6, Math.random);
    expect([...game.pool].sort()).toEqual([...CZ_ALPHABET.slice(0, 6)].sort());
    expect(game.nextToAdd).toBe(6);
    expect(createTrainGame(CZ_ALPHABET, 20, Math.random).pool).toHaveLength(8);
    expect(createTrainGame(CZ_ALPHABET, 1, Math.random).pool).toHaveLength(4);
    expect(clampWaitingWagons(Number.NaN)).toBe(DEFAULT_WAITING_WAGONS);
  });

  test('wrong letter is rejected, correct one inserts the next letter at the random index', () => {
    const game: TrainGameState = { letters: EN_ALPHABET, placedCount: 0, pool: ['c', 'a', 'b', 'd'], nextToAdd: 4 };
    expect(placeLetter(game, 'b', Math.random)).toBeNull();
    // remaining after removing 'a' = [c, b, d] (3) -> index floor(0.5 * 4) = 2
    const result = placeLetter(game, 'a', () => 0.5);
    expect(result).not.toBeNull();
    expect(result!.state.pool).toEqual(['c', 'b', 'e', 'd']);
    expect(result!.insertedIndex).toBe(2);
    expect(result!.insertedLetter).toBe('e');
    expect(expectedLetter(result!.state)).toBe('b');
    // random just below 1 -> last position (index = remaining length)
    expect(placeLetter(game, 'a', () => 0.9999)!.insertedIndex).toBe(3);
  });

  test('whole alphabet can be placed; the pool shrinks at the end', () => {
    let game = createTrainGame(CZ_ALPHABET, 8, sequenceRandom([0.1, 0.7, 0.4, 0.95, 0.2]));
    const random = sequenceRandom([0.3, 0.8, 0.05, 0.6]);
    for (const letter of CZ_ALPHABET) {
      expect(game.pool).toContain(letter);
      expect(game.pool.length).toBe(Math.min(8, CZ_ALPHABET.length - game.placedCount));
      game = placeLetter(game, letter, random)!.state;
    }
    expect(isGameFinished(game)).toBe(true);
    expect(game.pool).toHaveLength(0);
    expect(expectedLetter(game)).toBeNull();
  });

  test('wagon image per letter within range', () => {
    const images = assignWagonImages(CZ_ALPHABET, 10, Math.random);
    for (const letter of CZ_ALPHABET) {
      expect(images[letter]).toBeGreaterThanOrEqual(0);
      expect(images[letter]).toBeLessThan(10);
    }
    expect(assignWagonImages(['a'], 0, Math.random).a).toBe(0);
  });
});

describe('drop zone and layout', () => {
  test('any overlap with the zone is a hit', () => {
    const zone = dropZone(500, 20, 130, 100, 66);
    expect(zone.x).toBe(400);
    expect(zone.y).toBeCloseTo(-6.4, 9);
    expect(zone.width).toBe(250);
    expect(zone.height).toBe(196);
    expect(isDropHit({ x: 645, y: 100, width: 100, height: 66 }, zone)).toBe(true); // touches the right part
    expect(isDropHit({ x: 650, y: 100, width: 100, height: 66 }, zone)).toBe(false); // edge only
    expect(isDropHit({ x: 450, y: 200, width: 100, height: 66 }, zone)).toBe(false); // below (zone ends at 189.6)
    expect(isDropHit({ x: 300, y: 150, width: 101, height: 66 }, zone)).toBe(true);
  });

  test('pool slots are centred', () => {
    expect(poolSlotPositions(1000, 3, 100, 10)).toEqual([340, 450, 560]);
    expect(poolSlotPositions(1000, 0, 100, 10)).toEqual([]);
  });
});

describe('settings parsing', () => {
  test('defaults and clamping', () => {
    expect(parseTrainSettings(null)).toEqual({ alphabet: 'cz', letterCase: 'upper', waitingWagons: 6 });
    expect(parseTrainSettings('garbage')).toEqual({ alphabet: 'cz', letterCase: 'upper', waitingWagons: 6 });
    expect(parseTrainSettings('{"alphabet":"en","letterCase":"lower","waitingWagons":12}')).toEqual({
      alphabet: 'en',
      letterCase: 'lower',
      waitingWagons: 8,
    });
  });
});

describe('computeTrainLayout (verification round 1 H1: drop zone never reaches the pool row)', () => {
  // Real generated wagon / engine shapes (src/train/assets.ts from assets/train/manifest.json).
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { ENGINE_IMAGES, WAGON_IMAGES } = require('../assets');
  const options = { referenceWagonAspect: 1.5, couplingGap: 3, dragScale: 1.08, floatAmplitude: 4, minimumPoolGap: 12 };
  // Phone landscape screens; board = screen minus header (~44 px) and safe areas (0 or notch 47 px sides + 21 px bottom).
  const screens = [
    [640, 300],
    [667, 375],
    [740, 360],
    [780, 330],
    [844, 390],
    [852, 393],
    [915, 412],
    [932, 430],
  ];
  test('pool row fits the board width for N 4-8 at widths >= 300 px, landscape and portrait (verification round 3 M1)', () => {
    const sizes = [300, 320, 360, 375, 390, 430, 568, 640, 768, 1024, 1366];
    for (const first of sizes) {
      for (const second of sizes) {
        for (let waiting = 4; waiting <= 8; waiting++) {
          for (const engine of ENGINE_IMAGES) {
            const layout = computeTrainLayout(first, second, waiting, engine, WAGON_IMAGES, options);
            const slots = poolSlotPositions(layout.width, waiting, layout.wagonWidth, layout.gap);
            expect(slots[0]).toBeGreaterThanOrEqual(0);
            expect(slots[waiting - 1] + layout.wagonWidth).toBeLessThanOrEqual(first + 1e-9);
            expect(layout.wagonWidth).toBeGreaterThan(0);
          }
        }
      }
    }
  });

  test('vertical gap for every N 4-8, every engine, every wagon', () => {
    for (const [screenWidth, screenHeight] of screens) {
      for (const [boardWidth, boardHeight] of [
        [screenWidth, screenHeight - 44],
        [screenWidth - 94, screenHeight - 44 - 21],
      ]) {
        for (let waiting = 4; waiting <= 8; waiting++) {
          for (const engine of ENGINE_IMAGES) {
            const layout = computeTrainLayout(boardWidth, boardHeight, waiting, engine, WAGON_IMAGES, options);
            const zone = dropZone(0, layout.trainTop, layout.engineHeight, layout.wagonWidth, layout.wagonHeight);
            const zoneBottom = zone.y + zone.height;
            for (const wagon of WAGON_IMAGES) {
              const height = layout.wagonWidth / wagon.aspect;
              const restTop = layout.poolRail - wagon.baseline * height - ((options.dragScale - 1) / 2) * height - options.floatAmplitude;
              expect(restTop - zoneBottom).toBeGreaterThanOrEqual(options.minimumPoolGap - 1e-9);
            }
            expect(layout.wagonWidth).toBeGreaterThan(40);
          }
        }
      }
    }
  });
});

describe('shouldDeferBoardSize (verification round 2 H1)', () => {
  it('defers a portrait size only while the lock is pending', () => {
    expect(shouldDeferBoardSize(400, 800, false)).toBe(true);
    expect(shouldDeferBoardSize(500, 500, false)).toBe(true);
    expect(shouldDeferBoardSize(800, 400, false)).toBe(false);
  });

  it('lays out any size once the lock settled (portrait fallback)', () => {
    expect(shouldDeferBoardSize(400, 800, true)).toBe(false);
    expect(shouldDeferBoardSize(800, 400, true)).toBe(false);
  });
});

// "## Follow-up prompt 10": connect on touch/tap, red/green shades.
describe('selection on touch / tap ("## Follow-up prompt 10")', () => {
  const game = createTrainGame(['a', 'b', 'c', 'd', 'e'], 4, () => 0.3);
  test('the expected letter connects, others are wrong, nothing when not playing', () => {
    expect(selectionOutcome(game, 'a', true)).toBe('connect');
    expect(selectionOutcome(game, 'c', true)).toBe('wrong');
    expect(selectionOutcome(game, 'a', false)).toBe('ignored');
  });
});

describe('shades ("## Follow-up prompt 10")', () => {
  test('wrong selection: red on the wrong wagon (new serial each time) + green on the correct one', () => {
    const first = shadesAfterWrongSelection(NO_SHADES, 'c', 'a');
    expect(first).toEqual({ green: 'a', red: { letter: 'c', serial: 1 } });
    const again = shadesAfterWrongSelection(first, 'c', 'a');
    expect(again.red).toEqual({ letter: 'c', serial: 2 });
    expect(again.green).toBe('a');
  });

  test('green stays until the correct wagon connects, then it is removed', () => {
    const shades = shadesAfterWrongSelection(NO_SHADES, 'c', 'a');
    expect(shadesAfterConnect(shades, 'a').green).toBeNull();
    expect(shadesAfterConnect(shades, 'a').red).toEqual({ letter: 'c', serial: 1 });
    expect(shadesAfterConnect(NO_SHADES, 'a')).toEqual(NO_SHADES);
  });
});

describe('release reaction wiring (repair M3)', () => {
  test('wrong: wiggle only in the drop zone, never a train move', () => {
    expect(releaseReaction('wrong', true, false)).toEqual({ wiggle: true, follow: 'none' });
    expect(releaseReaction('wrong', false, false)).toEqual({ wiggle: false, follow: 'none' });
  });

  test('connect: shift, except for the last wagon (exit, no shift); released anywhere', () => {
    expect(releaseReaction('connect', false, false)).toEqual({ wiggle: false, follow: 'shift' });
    expect(releaseReaction('connect', true, false)).toEqual({ wiggle: false, follow: 'shift' });
    expect(releaseReaction('connect', false, true)).toEqual({ wiggle: false, follow: 'exit' });
    expect(releaseReaction('ignored', true, false)).toEqual({ wiggle: false, follow: 'none' });
  });
});

describe('wagon pan configuration (repair M3)', () => {
  class FakePan {
    readonly calls: [string, unknown][] = [];
    runOnJS(value: boolean): FakePan {
      this.calls.push(['runOnJS', value]);
      return this;
    }
    enabled(value: boolean): FakePan {
      this.calls.push(['enabled', value]);
      return this;
    }
    minDistance(value: number): FakePan {
      this.calls.push(['minDistance', value]);
      return this;
    }
    maxPointers(value: number): FakePan {
      this.calls.push(['maxPointers', value]);
      return this;
    }
  }

  test('activates on a mere touch (minDistance 0) so a tap is a release; one finger; JS callbacks', () => {
    const pan = configureWagonPan(new FakePan(), true);
    expect(pan.calls).toEqual([
      ['runOnJS', true],
      ['enabled', true],
      ['minDistance', 0],
      ['maxPointers', 1],
    ]);
    expect(configureWagonPan(new FakePan(), false).calls).toContainEqual(['enabled', false]);
  });
});
