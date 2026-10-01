// PexesoSoundFix regression: playAudio() must enable iOS silent-mode playback (once, awaited) before the first play.
const mockSetAudioModeAsync = jest.fn<Promise<void>, [unknown]>(() => Promise.resolve());
const mockPlay = jest.fn();
jest.mock('expo-audio', () => ({
  setAudioModeAsync: (mode: unknown) => mockSetAudioModeAsync(mode),
  createAudioPlayer: () => ({
    play: mockPlay,
    pause: jest.fn(),
    remove: jest.fn(),
    release: jest.fn(),
    setPlaybackRate: jest.fn(),
    addListener: () => ({ remove: jest.fn() }),
  }),
}));

import { enablePlaybackInSilentMode, playAudio, resetSilentModeForTests, stopAllAudio } from '../src/audioController';

const flushPromises = () => new Promise<void>((resolve) => setImmediate(resolve));

beforeEach(() => {
  stopAllAudio();
  resetSilentModeForTests();
  mockSetAudioModeAsync.mockReset();
  mockSetAudioModeAsync.mockImplementation(() => Promise.resolve());
  mockPlay.mockClear();
});

test('first playAudio enables playsInSilentMode and plays only after it resolved', async () => {
  let resolveMode: () => void = () => undefined;
  mockSetAudioModeAsync.mockImplementation(() => new Promise<void>((resolve) => (resolveMode = resolve)));
  playAudio(1, { key: 'a', rate: 1 });
  expect(mockSetAudioModeAsync).toHaveBeenCalledWith({ playsInSilentMode: true });
  expect(mockPlay).not.toHaveBeenCalled();
  resolveMode();
  await flushPromises();
  expect(mockPlay).toHaveBeenCalledTimes(1);
});

test('audio mode is set once; later plays start synchronously', async () => {
  await enablePlaybackInSilentMode();
  playAudio(1, { key: 'a', rate: 1 });
  playAudio(2, { key: 'b', rate: 1 });
  expect(mockSetAudioModeAsync).toHaveBeenCalledTimes(1);
  expect(mockPlay).toHaveBeenCalledTimes(2);
});

test('a newer request while the mode is pending wins; the stale one never plays', async () => {
  playAudio(1, { key: 'old', rate: 1 });
  playAudio(2, { key: 'new', rate: 1 });
  await flushPromises();
  expect(mockSetAudioModeAsync).toHaveBeenCalledTimes(1);
  expect(mockPlay).toHaveBeenCalledTimes(1);
});

test('audio-mode failure is warned and playback still proceeds', async () => {
  const warn = jest.spyOn(console, 'warn').mockImplementation(() => undefined);
  mockSetAudioModeAsync.mockImplementation(() => Promise.reject(new Error('boom')));
  playAudio(1, { key: 'a', rate: 1 });
  await flushPromises();
  expect(warn).toHaveBeenCalled();
  expect(mockPlay).toHaveBeenCalledTimes(1);
  warn.mockRestore();
});

test('a hanging audio-mode call times out after ~1000 ms; the first sound still plays with a warning', async () => {
  jest.useFakeTimers();
  const warn = jest.spyOn(console, 'warn').mockImplementation(() => undefined);
  try {
    mockSetAudioModeAsync.mockImplementation(() => new Promise<void>(() => undefined)); // never settles
    playAudio(1, { key: 'a', rate: 1 });
    await jest.advanceTimersByTimeAsync(999);
    expect(mockPlay).not.toHaveBeenCalled();
    await jest.advanceTimersByTimeAsync(1);
    expect(mockPlay).toHaveBeenCalledTimes(1);
    expect(warn).toHaveBeenCalledWith(expect.stringContaining('timed out'));
  } finally {
    warn.mockRestore();
    stopAllAudio();
    jest.useRealTimers();
  }
});
