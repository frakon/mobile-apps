// Standalone archive model (`_LetterPexeso_PROMPTS.md` / "## Phase E — mobile-apps-preferences in the standalone app"):
// image-card pictures/audio come from backend words/<id>.zip archives, every archive of the dealt deck is preloaded
// before the board shows, offline -> OfflineRetry, letters-only boards need no archives (fully offline-capable).
// The preload hook itself is unit-tested in src/resources/__tests__; here it is mocked to drive the gate.
import { ReactNode } from 'react';
import { act, create, ReactTestRenderer } from 'react-test-renderer';

import PexesoGame from '../src/PexesoGame';
import { DEFAULT_SETTINGS, PexesoSettings, WORD_AUDIO_FILE, WORD_PICTURE_FILE } from '../src/game/pexesoLogic';
import { PEXESO_WORDS } from '../src/pexesoPlatform';

jest.mock('../src/pexesoSettingsStorage', () => ({
  loadPexesoSettings: () => new Promise(() => undefined),
  savePexesoSettings: () => Promise.resolve(),
}));
jest.mock('../src/audioController', () => ({ playAudio: jest.fn(() => 1), stopAllAudio: jest.fn(), stopAudioIfOwnedBy: jest.fn() }));
jest.mock('expo-screen-orientation', () => ({
  OrientationLock: { LANDSCAPE: 5 },
  lockAsync: jest.fn(() => Promise.resolve()),
  unlockAsync: jest.fn(() => Promise.resolve()),
}));
jest.mock('react-native-safe-area-context', () => {
  const { View } = jest.requireActual('react-native');
  return {
    SafeAreaProvider: ({ children }: { children?: ReactNode }) => children,
    SafeAreaView: (props: { children?: ReactNode }) => <View {...props} />,
  };
});

type MockStatus = 'loading' | 'ready' | 'offline';
let mockStatus: MockStatus = 'loading';
const mockRetry = jest.fn();
const mockUseArchivePreloading = jest.fn((required: readonly string[]) => {
  if (required.length === 0) {
    return { status: 'ready', archives: {}, retry: mockRetry };
  }
  const archives: Record<string, unknown> = {};
  if (mockStatus === 'ready') {
    for (const archivePath of required) {
      archives[archivePath] = {
        archivePath,
        files: {
          'picture.png': { bytes: new Uint8Array(), dataUri: `data:image/png;base64,${archivePath}` },
          'word.mp3': { bytes: new Uint8Array(), dataUri: `data:audio/mpeg;base64,${archivePath}` },
        },
      };
    }
  }
  return { status: mockStatus, archives, retry: mockRetry };
});
jest.mock('../src/resources/useArchivePreloading', () => ({
  useArchivePreloading: (required: readonly string[]) => mockUseArchivePreloading(required),
}));

const IMAGE_SETTINGS: PexesoSettings = {
  ...DEFAULT_SETTINGS,
  columns: [{ ...DEFAULT_SETTINGS.columns[0], type: 'image' }, DEFAULT_SETTINGS.columns[1]],
};

let root: ReactTestRenderer | undefined;

function render(settings: PexesoSettings) {
  act(() => {
    root = create(<PexesoGame initialSettings={settings} />);
  });
  // The board lays out its cards only after the grid reports its size.
  const grid = root!.root.findAll((node) => typeof node.props.onLayout === 'function' && typeof node.type !== 'string')[0];
  if (grid !== undefined) {
    act(() => {
      grid.props.onLayout({ nativeEvent: { layout: { width: 347, height: 590 } } });
    });
  }
}

function texts(): string[] {
  return root!.root.findAll((node) => typeof node.props.children === 'string').map((node) => node.props.children as string);
}

function lastRequiredArchives(): readonly string[] {
  const calls = mockUseArchivePreloading.mock.calls;
  return calls[calls.length - 1][0];
}

beforeEach(() => {
  mockStatus = 'loading';
  mockRetry.mockClear();
  mockUseArchivePreloading.mockClear();
});

afterEach(() => {
  act(() => root?.unmount());
  root = undefined;
});

test('every standalone word points at its backend words/<id>.zip archive (no bundled word picture/audio)', () => {
  expect(PEXESO_WORDS.length).toBeGreaterThan(0);
  for (const word of PEXESO_WORDS) {
    expect(word.archivePath).toBe(`words/${word.id}.zip`);
    expect(word).not.toHaveProperty('image');
    expect(word).not.toHaveProperty('audio');
  }
  expect(WORD_PICTURE_FILE).toBe('picture.png');
  expect(WORD_AUDIO_FILE).toBe('word.mp3');
});

test('image board: all dealt archives requested; board hidden while loading', () => {
  render(IMAGE_SETTINGS);
  const required = lastRequiredArchives();
  expect(required.length).toBeGreaterThan(0);
  expect(new Set(required).size).toBe(required.length);
  for (const archivePath of required) {
    expect(archivePath).toMatch(/^words\/.+\.zip$/);
  }
  // Phase D: the themed start animation (its caption) replaces the plain "Načítám…" placeholder while loading.
  expect(texts()).toContain('Připravuji hru…');
  expect(root!.root.findAll((node) => typeof node.props.imageUri === 'string')).toHaveLength(0);
});

test('image board: offline -> child-friendly retry; retry calls the hook retry', () => {
  mockStatus = 'offline';
  render(IMAGE_SETTINGS);
  const retryButton = root!.root.find((node) => node.props.accessibilityLabel === 'Zkusit znovu' && typeof node.props.onPress === 'function');
  act(() => retryButton.props.onPress());
  expect(mockRetry).toHaveBeenCalledTimes(1);
});

test('image board: ready -> cards get the hot picture data URIs of their archives', () => {
  mockStatus = 'ready';
  render(IMAGE_SETTINGS);
  const imageCards = root!.root.findAll((node) => typeof node.props.cardId === 'number' && node.props.face?.type === 'image', { deep: false });
  expect(imageCards.length).toBeGreaterThan(0);
  for (const card of imageCards) {
    expect(card.props.imageUri).toBe(`data:image/png;base64,${card.props.face.word.archivePath}`);
  }
});

test('letters-only board needs no archives and shows immediately (fully offline-capable)', () => {
  mockStatus = 'offline';
  render(DEFAULT_SETTINGS);
  expect(lastRequiredArchives()).toEqual([]);
  expect(root!.root.findAll((node) => typeof node.props.cardId === 'number' && typeof node.props.onTap === 'function', { deep: false }).length).toBeGreaterThan(0);
});
