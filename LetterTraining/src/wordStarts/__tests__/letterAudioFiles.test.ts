// Consistency of the bundled letter-audio maps: every require() of LETTER_AUDIO (src/words.ts) and PEXESO_LETTER_AUDIO
// (src/pexeso/pexesoPlatform.ts) points at an existing file, and the vowel readings follow `_LetterTraining_PROMPTS.md` /
// "## Follow-up prompt 11" + "## Q&A 11" + "## Follow-up prompt 16 — Long vowel pronunciation everywhere".
/// <reference types="node" />
import * as fs from 'fs';
import * as path from 'path';

import { PEXESO_LETTER_AUDIO } from '../../pexeso/pexesoPlatform';
import { LETTER_AUDIO } from '../../words';

// pexesoPlatform re-exports the expo-audio controller, which cannot load under jest (same mock as PexesoGame.test.tsx).
jest.mock('../../audioController', () => ({ playAudio: jest.fn(), stopAllAudio: jest.fn(), stopAudioIfOwnedBy: jest.fn() }));

const SRC = path.join(__dirname, '..', '..');
const REQUIRE_ENTRY = /'([^']+)': require\('([^']+\.mp3)'\)/g;

function mapEntries(file: string, mapName: string): Map<string, string> {
  const text = fs.readFileSync(file, 'utf8');
  const start = text.indexOf(`export const ${mapName}`);
  const block = text.slice(start, text.indexOf('};', start));
  const entries = new Map<string, string>();
  for (const match of block.matchAll(REQUIRE_ENTRY)) {
    entries.set(match[1], path.resolve(path.dirname(file), match[2]));
  }
  return entries;
}

const general = mapEntries(path.join(SRC, 'words.ts'), 'LETTER_AUDIO');
const pexeso = mapEntries(path.join(SRC, 'pexeso', 'pexesoPlatform.ts'), 'PEXESO_LETTER_AUDIO');

test('every LETTER_AUDIO / PEXESO_LETTER_AUDIO key resolves to an existing file and a defined module', () => {
  expect(general.size).toBe(Object.keys(LETTER_AUDIO).length);
  for (const [letter, file] of [...general, ...pexeso]) {
    expect({ letter, exists: fs.existsSync(file) }).toEqual({ letter, exists: true });
  }
  for (const letter of Object.keys(LETTER_AUDIO)) {
    expect(PEXESO_LETTER_AUDIO[letter]).toBeDefined();
  }
});

test('general map: every vowel variant reads one long vowel; y/ý keep ypsilon', () => {
  const expected: Record<string, string> = {
    'a': 'a_long', 'á': 'a_long', 'e': 'e_long', 'é': 'e_long', 'i': 'i_long', 'í': 'i_long',
    'o': 'o_long', 'ó': 'o_long', 'u': 'u_long', 'ú': 'u_long', 'ů': 'u_long', 'y': 'y', 'ý': 'yy',
  };
  for (const [letter, name] of Object.entries(expected)) {
    expect({ letter, file: path.basename(general.get(letter) ?? '') }).toEqual({ letter, file: `${name}.mp3` });
  }
});

test('pexeso map keeps distinguishing readings', () => {
  const expected: Record<string, string> = {
    'a': 'a_long', 'á': 'aa', 'e': 'e_long', 'é': 'ee', 'i': 'i_soft_long', 'í': 'ii',
    'o': 'o_long', 'ó': 'oo', 'u': 'u_long', 'ú': 'uu', 'ů': 'uo',
  };
  for (const [letter, name] of Object.entries(expected)) {
    expect({ letter, file: path.basename(pexeso.get(letter) ?? '') }).toEqual({ letter, file: `${name}.mp3` });
  }
  // (module ids are not compared: jest-expo maps every asset require to the same stub id)
  expect(path.basename(pexeso.get('b') ?? general.get('b') ?? '')).toBe('b.mp3');
});
