// Extensible registry of the trainings offered on the intro (selection) page - `_LetterTraining_PROMPTS.md` /
// "## Initial request (2026-10-01)" ("there will be more of them, initially just the following").
// A new training = a new route under app/ + one entry here.

import { Href } from 'expo-router';

export interface TrainingEntry {
  readonly id: string;
  readonly title: string;
  readonly description: string;
  readonly href: Href;
}

export const TRAININGS: readonly TrainingEntry[] = [
  {
    id: 'pexeso',
    title: 'Pexeso',
    description: 'Najdi dvojice stejných písmen.',
    href: '/pexeso',
  },
  {
    id: 'word-starts-1',
    title: 'Začátky slov – úroveň 1 (písmena)',
    description: 'Na které písmeno slovo začíná?',
    href: { pathname: '/words', params: { level: '1' } },
  },
  {
    id: 'word-starts-2',
    title: 'Začátky slov – úroveň 2 (první slabika)',
    description: 'Kterou slabikou slovo začíná?',
    href: { pathname: '/words', params: { level: '2' } },
  },
  {
    id: 'word-starts-3',
    title: 'Začátky slov – úroveň 3 (poslední slabika)',
    description: 'Kterou slabikou slovo končí?',
    href: { pathname: '/words', params: { level: '3' } },
  },
  // "Skládání slov" - own game option with two variants (letters, syllables) - `_LetterTraining_PROMPTS.md` /
  // "## Follow-up prompt 4 — new game "Skládání slov" (verbatim)".
  {
    id: 'compose-letters',
    title: 'Skládání slov – písmena',
    description: 'Přetáhni písmena do okének a slož slovo.',
    href: { pathname: '/compose', params: { variant: 'letters' } },
  },
  {
    id: 'compose-syllables',
    title: 'Skládání slov – slabiky',
    description: 'Přetáhni slabiky do okének a slož slovo.',
    href: { pathname: '/compose', params: { variant: 'syllables' } },
  },
  // "Abecedový vlak" - `_LetterTraining_PROMPTS.md` / "## Follow-up prompt 5 — new game "Abecedový vlak" (verbatim)"
  // ("it shall be again listed on the disambigulation page").
  {
    id: 'alphabet-train',
    title: 'Abecedový vlak',
    description: 'Připojuj vagóny s písmeny podle abecedy.',
    href: '/train',
  },
];
