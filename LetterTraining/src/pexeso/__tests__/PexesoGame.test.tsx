// App-level UI tests (real App + reducer + timer effect) rendered with react-test-renderer and jest fake timers.
// Merged from the verification runs (AGENTS/Tasks/20260929_153248_ChangeVerification/Temp/uiTimer + Temp/subagent2).
// Handlers are invoked directly (props.onPressIn), so native responder negotiation is NOT exercised here.
import { ReactNode } from 'react';
import { Animated, Dimensions, StyleSheet } from 'react-native';
import { act, create, ReactTestInstance, ReactTestRenderer } from 'react-test-renderer';

import PexesoGame from '../PexesoGame';
import { DEFAULT_SETTINGS, PexesoSettings } from '../game/pexesoLogic';

// The game under test with known settings (the async AsyncStorage load is mocked to never resolve).
function App(props: { onBack?: () => void; initialSettings?: PexesoSettings }) {
  return <PexesoGame initialSettings={DEFAULT_SETTINGS} {...props} />;
}

jest.mock('../pexesoSettingsStorage', () => ({
  loadPexesoSettings: () => new Promise(() => undefined),
  savePexesoSettings: () => Promise.resolve(),
}));

// Card sounds (`_LetterPexeso_PROMPTS.md` / "Q&A 9 — Pexeso improvements round 2": sound on flip only).
jest.mock('../../audioController', () => ({
  playAudio: jest.fn(() => 1),
  stopAllAudio: jest.fn(),
  stopAudioIfOwnedBy: jest.fn(),
}));

// Runtime landscape lock (`_LetterPexeso_PROMPTS.md` / "Follow-up 1: landscape") - no native module in jest.
jest.mock('expo-screen-orientation', () => ({
  OrientationLock: { LANDSCAPE: 5 },
  lockAsync: jest.fn(() => Promise.resolve()),
  unlockAsync: jest.fn(() => Promise.resolve()),
}));

jest.mock('react-native-safe-area-context', () => {
  const { View } = jest.requireActual('react-native');
  function MockSafeAreaView(props: { children?: ReactNode }) {
    return <View {...props} />;
  }
  return {
    SafeAreaProvider: ({ children }: { children?: ReactNode }) => children,
    SafeAreaView: MockSafeAreaView,
  };
});

interface CardInfo {
  readonly cardId: number;
  readonly letter: string;
  readonly isFaceUp: boolean;
  readonly isRemoved: boolean;
}

let root: ReactTestRenderer;
let timingSpy: jest.SpyInstance | undefined;

function cardInstances(): ReactTestInstance[] {
  return root.root
    .findAll((node) => typeof node.props.cardId === 'number' && typeof node.props.onTap === 'function' && typeof node.type !== 'string', { deep: false })
    .sort((first, second) => first.props.cardId - second.props.cardId);
}

// `letter` = the face text (default settings: capital printed letters on both cards of a pair).
function cardInfos(): CardInfo[] {
  return cardInstances().map((node) => ({ ...(node.props as CardInfo), letter: node.props.face.text as string }));
}

function cardPressables(): ReactTestInstance[] {
  return root.root.findAll(
    (node) => typeof node.props.onPressIn === 'function' && node.props.accessibilityRole === 'button' && typeof node.type !== 'string',
    { deep: false },
  );
}

function pressCard(cardId: number) {
  const instance = cardInstances().find((node) => node.props.cardId === cardId)!;
  // The real touch target: the Pressable inside PexesoCard.
  const pressable = instance.findAll((node) => typeof node.props.onPressIn === 'function' && typeof node.type !== 'string', { deep: false })[0];
  act(() => {
    pressable.props.onPressIn();
  });
}

function backgroundPressable(): ReactTestInstance {
  return root.root.findAll(
    (node) => typeof node.props.onPressIn === 'function' && node.props.accessible === false && typeof node.type !== 'string',
    { deep: false },
  )[0];
}

function openIds(): number[] {
  return cardInfos().filter((card) => card.isFaceUp).map((card) => card.cardId);
}

function allTexts(): string[] {
  return root.root
    .findAll((node) => node.type === ('Text' as unknown as typeof node.type))
    .map((node) => ([] as unknown[]).concat(node.props.children).join(''));
}

function advance(milliseconds: number) {
  act(() => {
    jest.advanceTimersByTime(milliseconds);
  });
}

function setWindow(width: number, height: number) {
  const size = { width, height, scale: 2, fontScale: 1 };
  act(() => {
    Dimensions.set({ window: size, screen: size });
  });
}

function setup(gridWidth = 347, gridHeight = 590) {
  act(() => {
    root = create(<App />);
  });
  const grid = root.root.find((node) => typeof node.props.onLayout === 'function' && typeof node.type !== 'string');
  act(() => {
    grid.props.onLayout({ nativeEvent: { layout: { width: gridWidth, height: gridHeight } } });
  });
  const infos = cardInfos();
  const first = infos[0];
  const partner = infos.find((card) => card.letter === first.letter && card.cardId !== first.cardId)!;
  // Cards with pairwise different letters (none equal to the first card's letter).
  const distinct: CardInfo[] = [];
  for (const card of infos) {
    if (card.letter !== first.letter && distinct.every((other) => other.letter !== card.letter)) {
      distinct.push(card);
    }
  }
  return { first, partner, distinct };
}

beforeEach(() => {
  jest.useFakeTimers();
  setWindow(375, 667); // portrait by default (3 x 6)
});

afterEach(() => {
  act(() => {
    root.unmount();
  });
  jest.useRealTimers();
  timingSpy?.mockRestore();
  timingSpy = undefined;
});

// Absolute position wrapper (parent View of the card) of the given card.
function cardPosition(cardId: number): { left: number; top: number } {
  const wrapper = cardInstances().find((node) => node.props.cardId === cardId)!.parent!;
  const style = StyleSheet.flatten(wrapper.props.style) as { left: number; top: number };
  return { left: style.left, top: style.top };
}

test('landscape window -> 6 x 3 grid; orientation locked to landscape', () => {
  setWindow(667, 375);
  setup(627, 300);
  expect(cardPressables()).toHaveLength(18);
  const card = cardInstances()[0].props as { width: number; height: number };
  // 6 columns, gap 8: (627 - 5 * 8) / 6 = 97.8 -> 97; 3 rows: (300 - 2 * 8) / 3 = 94.67 -> 94.
  expect(card.width).toBe(97);
  expect(card.height).toBe(94);
  expect(cardPosition(5)).toEqual({ left: 5 * (97 + 8), top: 0 });
  expect(cardPosition(6)).toEqual({ left: 0, top: 94 + 8 });
  expect(cardPosition(17)).toEqual({ left: 5 * (97 + 8), top: 2 * (94 + 8) });
  const { lockAsync, OrientationLock } = jest.requireMock('expo-screen-orientation');
  expect(lockAsync).toHaveBeenCalledWith(OrientationLock.LANDSCAPE);
});

test('portrait window -> 3 x 6 fallback grid', () => {
  setup();
  const card = cardInstances()[0].props as { width: number; height: number };
  // 3 columns, gap 10: (347 - 20) / 3 = 109; 6 rows: (590 - 50) / 6 = 90.
  expect(card.width).toBe(109);
  expect(card.height).toBe(90);
  expect(cardPosition(2)).toEqual({ left: 2 * (109 + 10), top: 0 });
  expect(cardPosition(3)).toEqual({ left: 0, top: 90 + 10 });
});

test('orientation lock rejection (web) is swallowed', async () => {
  const { lockAsync } = jest.requireMock('expo-screen-orientation');
  lockAsync.mockImplementationOnce(() => Promise.reject(new Error('not supported on web')));
  setup();
  await act(async () => {
    await Promise.resolve();
  });
  expect(cardPressables()).toHaveLength(18);
});

// Regression (verification finding "flip stuck after fast match"): a match tapped within the 160 ms flip stopped
// the flip mid-way (effect cleanup, or the Animated.View unmount -> __detach -> stopAnimation) and the slot stayed
// squeezed (scaleX < 1) after "Hrát znovu". The REAL Animated.timing runs, only forced to the JS driver (the jest
// native-animated mock never reports progress back to JS) - same behaviour as on web.
function forceRealJsDrivenTiming() {
  const originalTiming = Animated.timing;
  timingSpy = jest.spyOn(Animated, 'timing').mockImplementation(((value: Animated.Value, config: Animated.TimingAnimationConfig) =>
    originalTiming(value, { ...config, useNativeDriver: false })) as typeof Animated.timing);
}

function cardScales(): number[] {
  return cardInstances().map((instance) => {
    const host = instance.findAll((node) => typeof node.type === 'string' && node.props.style != null
      && JSON.stringify(StyleSheet.flatten(node.props.style) ?? {}).includes('scaleX'))[0];
    const flat = StyleSheet.flatten(host.props.style) as { transform: { scaleX: unknown }[] };
    const scaleX = flat.transform[0].scaleX;
    return typeof scaleX === 'number' ? scaleX : (scaleX as { __getValue: () => number }).__getValue();
  });
}

// Finishes the game with slow (500 ms) taps, presses "Hrát znovu" and lets all animations settle.
function finishGameAndPlayAgain() {
  for (const card of cardInfos()) {
    const current = cardInfos().find((other) => other.cardId === card.cardId)!;
    if (current.isRemoved) {
      continue;
    }
    const pair = cardInfos().find((other) => other.letter === current.letter && other.cardId !== current.cardId)!;
    pressCard(current.cardId);
    advance(500);
    pressCard(pair.cardId);
    advance(500);
  }
  const playAgain = root.root.findAll(
    (node) => typeof node.props.onPress === 'function' && node.props.accessibilityRole === 'button' && typeof node.type !== 'string',
    { deep: false },
  )[0];
  act(() => {
    playAgain.props.onPress();
  });
  advance(2000);
}

test('fast match, removed card is the FIRST card (partner within its flip-up) -> every card has scaleX 1 after play again', () => {
  forceRealJsDrivenTiming();
  const { first, partner } = setup();
  pressCard(first.cardId);
  advance(50);
  pressCard(partner.cardId);
  advance(2000);
  finishGameAndPlayAgain();
  const scales = cardScales();
  expect(scales).toHaveLength(18);
  expect(scales).toEqual(new Array(18).fill(1));
});

test('fast match, removed card is the SECOND card (tapped within its flip-down) -> every card has scaleX 1 after play again', () => {
  forceRealJsDrivenTiming();
  const { first, partner, distinct } = setup();
  pressCard(first.cardId);
  advance(500);
  pressCard(distinct[0].cardId); // mismatch shown
  advance(500);
  pressCard(partner.cardId); // hides the mismatch (first starts flipping down), partner opens
  advance(50);
  pressCard(first.cardId); // match while the first card's flip-down still runs
  expect(cardInfos().find((card) => card.cardId === first.cardId)!.isRemoved).toBe(true);
  advance(2000);
  finishGameAndPlayAgain();
  const scales = cardScales();
  expect(scales).toHaveLength(18);
  expect(scales).toEqual(new Array(18).fill(1));
});

test('renders 18 card Pressables after grid layout', () => {
  setup();
  expect(cardPressables()).toHaveLength(18);
});

test('mismatch hides after exactly 1000 ms', () => {
  const { first, distinct } = setup();
  pressCard(first.cardId);
  pressCard(distinct[0].cardId);
  expect(openIds()).toEqual([first.cardId, distinct[0].cardId].sort((a, b) => a - b));
  advance(999);
  expect(openIds()).toHaveLength(2);
  advance(1);
  expect(openIds()).toHaveLength(0);
});

test('third card tap hides the mismatch, stale timer is cleared, a new mismatch gets a full 1000 ms', () => {
  const { first, distinct } = setup();
  const [second, third, fourth] = distinct;
  pressCard(first.cardId);
  pressCard(second.cardId);
  advance(900);
  pressCard(third.cardId);
  expect(openIds()).toEqual([third.cardId]);
  advance(200); // the old timer would have fired at 1000 ms
  expect(openIds()).toEqual([third.cardId]);
  expect(jest.getTimerCount()).toBe(0);
  pressCard(fourth.cardId); // new mismatch
  advance(999);
  expect(openIds()).toHaveLength(2);
  advance(1);
  expect(openIds()).toHaveLength(0);
  advance(400);
  expect(jest.getTimerCount()).toBe(0);
});

test('background tap hides a shown mismatch; the background Pressable wraps the safe area (incl. inset strips)', () => {
  const { first, distinct } = setup();
  const background = backgroundPressable();
  const { SafeAreaView } = jest.requireMock('react-native-safe-area-context');
  expect(background.findAll((node) => node.type === SafeAreaView)).toHaveLength(1);
  pressCard(first.cardId);
  pressCard(distinct[0].cardId);
  expect(openIds()).toHaveLength(2);
  act(() => {
    backgroundPressable().props.onPressIn();
  });
  expect(openIds()).toHaveLength(0);
});

test('match: both cards are removed in the same render (the second card is never shown face-up)', () => {
  const { first, partner } = setup();
  pressCard(first.cardId);
  pressCard(partner.cardId);
  const infos = cardInfos();
  expect(infos.filter((card) => card.isFaceUp)).toEqual([]);
  expect(infos.find((card) => card.cardId === first.cardId)!.isRemoved).toBe(true);
  expect(infos.find((card) => card.cardId === partner.cardId)!.isRemoved).toBe(true);
  advance(400);
  expect(jest.getTimerCount()).toBe(0);
});

test('full game via UI -> end overlay with stats; play again resets board and header', () => {
  const { first, distinct } = setup();
  pressCard(first.cardId);
  pressCard(distinct[0].cardId); // 1 wrong
  advance(1000);
  const done = new Set<number>();
  for (const card of cardInfos()) {
    if (done.has(card.cardId)) {
      continue;
    }
    const partner = cardInfos().find((other) => other.letter === card.letter && other.cardId !== card.cardId)!;
    pressCard(card.cardId);
    pressCard(partner.cardId);
    done.add(card.cardId);
    done.add(partner.cardId);
  }
  const texts = allTexts();
  expect(texts).toContain('Výborně!');
  expect(texts).toContain('Hrát znovu');
  expect(texts.find((text) => text.startsWith('Správně 9'))).toBeDefined();
  // The first blind mismatch is neutral (`_LetterPexeso_PROMPTS.md` / "Follow-up prompt 6"); total tries = 10.
  expect(texts.find((text) => text.includes('Špatně 0'))).toBeDefined();
  expect(texts.find((text) => text.includes('Pokusů 10'))).toBeDefined();

  const playAgain = root.root.findAll(
    (node) => typeof node.props.onPress === 'function' && node.props.accessibilityRole === 'button' && typeof node.type !== 'string'
      && node.findAll((child) => child.props.children === 'Hrát znovu').length > 0,
    { deep: false },
  )[0];
  act(() => {
    playAgain.props.onPress();
  });
  expect(cardInfos().every((card) => !card.isRemoved && !card.isFaceUp)).toBe(true);
  const textsAfter = allTexts();
  expect(textsAfter).not.toContain('Výborně!');
  expect(textsAfter.find((text) => text.startsWith('Správně 0'))).toBeDefined();
});

// LetterTraining nesting (`_LetterTraining_PROMPTS.md` / "## Initial request (2026-10-01)"): landscape unlock on leave,
// header back button and "Zpět na výběr" in the end overlay call onBack.
test('unmount unlocks the orientation', () => {
  setup();
  const { unlockAsync } = jest.requireMock('expo-screen-orientation');
  unlockAsync.mockClear();
  act(() => {
    root.unmount();
  });
  expect(unlockAsync).toHaveBeenCalledTimes(1);
  act(() => {
    root = create(<App />); // afterEach unmounts again
  });
});

test('header back button calls onBack', () => {
  const onBack = jest.fn();
  act(() => {
    root = create(<App onBack={onBack} />);
  });
  const back = root.root.find((node) => node.props.accessibilityLabel === 'Zpět na výběr' && typeof node.props.onPress === 'function');
  act(() => {
    back.props.onPress();
  });
  expect(onBack).toHaveBeenCalledTimes(1);
});

// Card sounds - `_LetterPexeso_PROMPTS.md` / "Follow-up prompt 6" (sound setting mutes letters / images only) and
// "Q&A 9 — Pexeso improvements round 2" (only on flip, not again on match).
describe('card sounds', () => {
  const { playAudio } = jest.requireMock('../../audioController') as { playAudio: jest.Mock };
  beforeEach(() => playAudio.mockClear());

  test('sound on: every flip of a letter card plays once; the match does not replay', () => {
    const { first, partner } = setup();
    pressCard(first.cardId);
    expect(playAudio).toHaveBeenCalledTimes(1);
    pressCard(partner.cardId);
    expect(playAudio).toHaveBeenCalledTimes(2);
    advance(2000);
    expect(playAudio).toHaveBeenCalledTimes(2);
  });

  test('sound off: letter cards are silent', () => {
    act(() => {
      root = create(<App initialSettings={{ ...DEFAULT_SETTINGS, soundOn: false }} />);
    });
    const grid = root.root.find((node) => typeof node.props.onLayout === 'function' && typeof node.type !== 'string');
    act(() => {
      grid.props.onLayout({ nativeEvent: { layout: { width: 347, height: 590 } } });
    });
    pressCard(cardInfos()[0].cardId);
    expect(playAudio).not.toHaveBeenCalled();
  });

  test('sound off: sound-only cards still play', () => {
    const soundColumn = { type: 'sound', letterCase: 'upper', letterStyle: 'print' } as const;
    act(() => {
      root = create(<App initialSettings={{ ...DEFAULT_SETTINGS, soundOn: false, columns: [soundColumn, soundColumn] }} />);
    });
    const grid = root.root.find((node) => typeof node.props.onLayout === 'function' && typeof node.type !== 'string');
    act(() => {
      grid.props.onLayout({ nativeEvent: { layout: { width: 347, height: 590 } } });
    });
    const ids = cardInstances().map((node) => node.props.cardId as number);
    pressCard(ids[0]);
    expect(playAudio).toHaveBeenCalledTimes(1);
  });

  test('sound vs sound: the second card waits until the first card finished (no cut-off)', () => {
    const soundColumn = { type: 'sound', letterCase: 'upper', letterStyle: 'print' } as const;
    act(() => {
      root = create(<App initialSettings={{ ...DEFAULT_SETTINGS, columns: [soundColumn, soundColumn] }} />);
    });
    const grid = root.root.find((node) => typeof node.props.onLayout === 'function' && typeof node.type !== 'string');
    act(() => {
      grid.props.onLayout({ nativeEvent: { layout: { width: 347, height: 590 } } });
    });
    const ids = cardInstances().map((node) => node.props.cardId as number);
    pressCard(ids[0]);
    pressCard(ids[1]);
    expect(playAudio).toHaveBeenCalledTimes(1); // queued
    act(() => {
      (playAudio.mock.calls[0][1] as { onFinish: () => void }).onFinish();
    });
    expect(playAudio).toHaveBeenCalledTimes(2);
  });
});

test('4x10 board in a phone landscape window -> 40 cards in 10 x 4', () => {
  setWindow(844, 390);
  act(() => {
    root = create(<App initialSettings={{ ...DEFAULT_SETTINGS, sizeId: '4x10' }} />);
  });
  const grid = root.root.find((node) => typeof node.props.onLayout === 'function' && typeof node.type !== 'string');
  act(() => {
    grid.props.onLayout({ nativeEvent: { layout: { width: 780, height: 330 } } });
  });
  expect(cardInstances()).toHaveLength(40);
  // 10 columns, gap 4: (780 - 36) / 10 = 74.4 -> 74; 4 rows: (330 - 12) / 4 = 79.5 -> 79.
  expect(cardInstances()[0].props.width).toBe(74);
  expect(cardInstances()[0].props.height).toBe(79);
});
