// Consistency of PEXESO_LETTER_AUDIO (src/pexesoWords.ts): every require() points at an existing file and the vowel
// readings stay distinguishing - LetterTraining `_LetterTraining_PROMPTS.md` / "## Follow-up prompt 11" + "## Q&A 11" +
// "## Follow-up prompt 16 — Long vowel pronunciation everywhere".
/// <reference types="node" />
import * as fs from 'fs';
import * as path from 'path';

import { PEXESO_LETTER_AUDIO } from '../src/pexesoWords';

const FILE = path.join(__dirname, '..', 'src', 'pexesoWords.ts');

function mapEntries(): Map<string, string> {
  const text = fs.readFileSync(FILE, 'utf8');
  const start = text.indexOf('export const PEXESO_LETTER_AUDIO');
  const block = text.slice(start, text.indexOf('};', start));
  const entries = new Map<string, string>();
  for (const match of block.matchAll(/'([^']+)': require\('([^']+\.mp3)'\)/g)) {
    entries.set(match[1], path.resolve(path.dirname(FILE), match[2]));
  }
  return entries;
}

const entries = mapEntries();

test('every PEXESO_LETTER_AUDIO key resolves to an existing file and a defined module', () => {
  expect(entries.size).toBe(Object.keys(PEXESO_LETTER_AUDIO).length);
  for (const [letter, file] of entries) {
    expect({ letter, exists: fs.existsSync(file) }).toEqual({ letter, exists: true });
    expect(PEXESO_LETTER_AUDIO[letter]).toBeDefined();
  }
});

test('pexeso vowel readings are distinguishing (long short-vowel files, named long/soft variants)', () => {
  const expected: Record<string, string> = {
    'a': 'a_long', 'á': 'aa', 'e': 'e_long', 'é': 'ee', 'i': 'i_soft_long', 'í': 'ii',
    'o': 'o_long', 'ó': 'oo', 'u': 'u_long', 'ú': 'uu', 'ů': 'uo', 'y': 'y', 'ý': 'yy',
  };
  for (const [letter, name] of Object.entries(expected)) {
    expect({ letter, file: path.basename(entries.get(letter) ?? '') }).toEqual({ letter, file: `${name}.mp3` });
  }
});
