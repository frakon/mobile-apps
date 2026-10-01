// In-memory store of a PAUSED (not stopped) test — requested in
// _TreninkPorozumeni_Fields123_PROMPTS.md (section "User follow-up request 4 — pause the
// test, 'Pokračuj v testu' on the initial page").
//
// Deliberately a module-level variable, NOT AsyncStorage: game screens unmount on router
// pop, so the paused state must live outside the component — but a paused test is not a
// SAVED test. A fresh app start simply has no paused test to continue, which matches the
// requested "paused" semantics (see _TreninkPorozumeni_SPEC.md, "Pause / resume").

import { FieldId } from './items';
import { GameRound, Regime, TestPart } from './rounds';

export interface PausedGame {
  field: FieldId;
  // Sub-test part ("User follow-up request 21"): the paused-test identity is field + part —
  // resume must reopen exactly the same sub-test (e.g. "5.1 Reverzibilní věty 11–20").
  part: TestPart; // group 1..10 since "User request 25"
  // Each round of roundPlan stores its drawn variant ("User request 25"), so resuming keeps
  // the same sentences / correct pictures; only a new start or restart re-draws.
  regime: Regime; // regime the paused plan was built for; a differing regime setting invalidates the pause
  roundPlan: GameRound[]; // the EXACT rounds (order included) — resume continues the same shuffle
  roundIndex: number;
  correctCount: number;
  wrongCount: number;
  mistakeMadeThisRound: boolean; // a mistake already made in the current round must survive the pause
}

let pausedGame: PausedGame | null = null;

export function savePausedGame(state: PausedGame): void {
  pausedGame = state;
}

// Non-destructive read — the start page and the sets page peek (src/pausedTestOffer.tsx) to decide whether to show "Pokračuj v testu".
export function peekPausedGame(): PausedGame | null {
  return pausedGame;
}

// Destructive read — resuming CONSUMES the paused test (one of the requested invalidations).
export function consumePausedGame(): PausedGame | null {
  const state = pausedGame;
  pausedGame = null;
  return state;
}

// Invalidation: starting a new test, or detecting an incompatible regime setting.
export function clearPausedGame(): void {
  pausedGame = null;
}
