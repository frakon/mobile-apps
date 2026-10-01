// Settings screen - `_LetterPexeso_PROMPTS.md` / "Follow-up prompt 6 — Pexeso improvements (standalone LetterPexeso +
// integrated in LetterTraining) (verbatim)" + "Q&A 8 — Pexeso improvements round 1" (greyed sizes) + "Follow-up prompt 8".
import { ReactNode } from 'react';
import { act, create, ReactTestInstance, ReactTestRenderer } from 'react-test-renderer';

import PexesoSettingsScreen from '../PexesoSettingsScreen';
import { DEFAULT_SETTINGS, availableLetters } from '../game/pexesoLogic';
import { PEXESO_WORDS } from '../pexesoPlatform';

const saved: unknown[] = [];
jest.mock('../pexesoSettingsStorage', () => ({
  loadPexesoSettings: () => new Promise(() => undefined),
  savePexesoSettings: (settings: unknown) => {
    saved.push(settings);
    return Promise.resolve();
  },
}));
jest.mock('../../audioController', () => ({ playAudio: jest.fn(), stopAllAudio: jest.fn() }));
jest.mock('react-native-safe-area-context', () => {
  const { View } = jest.requireActual('react-native');
  return { SafeAreaView: (props: { children?: ReactNode }) => <View {...props} /> };
});

let root: ReactTestRenderer;

function option(label: string): ReactTestInstance {
  return root.root.findAll(
    (node) => typeof node.props.onPress === 'function' && typeof node.type !== 'string'
      && node.findAll((child) => child.props.children === label).length > 0,
    { deep: false },
  )[0];
}

beforeEach(() => {
  saved.length = 0;
  act(() => {
    root = create(<PexesoSettingsScreen onBack={jest.fn()} />);
  });
});

afterEach(() => act(() => root.unmount()));

test('defaults: letters in both columns -> case / style enabled; all sizes enabled; 3 letter styles offered', () => {
  expect(option('VELKÁ').props.disabled).toBe(false);
  expect(option('Psací – nevázané (Comenia)').props.disabled).toBe(false);
  expect(option('Psací – tradiční vázané').props.disabled).toBe(false);
  expect(option('4 × 10').props.disabled).toBe(false);
});

test('images in column 1 greys out its case / style and sizes needing more letters than pictures; choice is saved', () => {
  act(() => option('Obrázky').props.onPress());
  const lastSaved = saved[saved.length - 1] as { columns: { type: string }[] };
  expect(lastSaved.columns[0].type).toBe('image');
  // Column 1 case options greyed (the first 'VELKÁ' belongs to column 1), column 2 still enabled.
  const upperOptions = root.root.findAll(
    (node) => node.props.accessibilityRole === 'radio' && typeof node.type !== 'string'
      && node.findAll((child) => child.props.children === 'VELKÁ').length > 0,
    { deep: false },
  );
  expect(upperOptions.map((node) => node.props.disabled)).toEqual([true, false]);
  // Depends on the current word data: 4x10 needs 20 letters with a picture.
  const imageLetters = availableLetters({ ...DEFAULT_SETTINGS, columns: [{ ...DEFAULT_SETTINGS.columns[0], type: 'image' }, DEFAULT_SETTINGS.columns[1]] }, PEXESO_WORDS);
  expect(option('4 × 10').props.disabled).toBe(imageLetters.length < 20);
  expect(option('2 × 2').props.disabled).toBe(imageLetters.length < 2);
});

test('sound checkbox is greyed only when both columns are sound-only - "Follow-up prompt 6"', () => {
  const soundCheckbox = () => root.root.findAll(
    (node) => node.props.accessibilityRole === 'checkbox' && typeof node.type !== 'string'
      && node.findAll((child) => child.props.children === 'Přehrávat písmena a obrázky').length > 0,
    { deep: false },
  )[0];
  const soundOptions = () => root.root.findAll(
    (node) => node.props.accessibilityRole === 'radio' && typeof node.type !== 'string'
      && node.findAll((child) => child.props.children === 'Jen zvuk (ucho)').length > 0,
    { deep: false },
  );
  expect(soundCheckbox().props.disabled).toBe(false);
  act(() => soundOptions()[0].props.onPress());
  expect(soundCheckbox().props.disabled).toBe(false);
  act(() => soundOptions()[1].props.onPress());
  expect(soundCheckbox().props.disabled).toBe(true);
});
