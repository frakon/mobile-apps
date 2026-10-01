// Shared "Pokračuj v testu" offer — used by the start page (app/index.tsx) AND the sets page
// (app/sets.tsx). Requested in _TreninkPorozumeni_Fields123_PROMPTS.md ("User follow-up
// request 4" pause/resume, "User follow-up request 21" field + part identity); shown on the
// sets page too since "User request 25" (pause returns to the sets page, see open_questions).

import { useFocusEffect } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';
import { FieldId, fieldLabel } from './items';
import { clearPausedGame, peekPausedGame } from './pausedGame';
import { TestPart, testPartRangeLabel } from './rounds';
import { loadRegime } from './settings';

export interface PausedTestIdentity {
  field: FieldId;
  part: TestPart;
}

// Returns the paused test to offer, or null. Shown only when a paused test exists AND the
// current stored image-regime setting still equals the paused test's regime. Re-checked on
// every focus, so pause → settings (regime unchanged) → back keeps the button, while changing
// the regime makes it disappear (the incompatible paused test is cleared = invalidated).
export function usePausedTestOffer(): PausedTestIdentity | null {
  const [pausedTest, setPausedTest] = useState<PausedTestIdentity | null>(null);

  useFocusEffect(
    useCallback(() => {
      let cancelled = false;
      // Hide the button SYNCHRONOUSLY on every focus and show it only after the async regime
      // check below passes: otherwise the button from the previous focus would stay tappable
      // for the AsyncStorage round-trip, allowing a resume of a test whose regime was just
      // changed in settings (the game re-validates too, but the window must not exist here).
      setPausedTest(null);
      const paused = peekPausedGame();
      if (paused === null) {
        return;
      }
      loadRegime().then((storedRegime) => {
        if (cancelled) {
          return;
        }
        if (storedRegime === paused.regime) {
          setPausedTest({ field: paused.field, part: paused.part });
        } else {
          clearPausedGame(); // incompatible settings → the paused test is invalidated for good
          setPausedTest(null);
        }
      });
      return () => {
        cancelled = true;
      };
    }, [])
  );

  return pausedTest;
}

// Green full-width resume button; the label names the SUB-test, e.g.
// "Pokračuj v testu — 5.1 Reverzibilní věty 11–20" ("request 21"). The caller navigates to
// /game with resume: '1' (resuming CONSUMES the paused store inside the game screen).
export function ResumeTestButton(props: { pausedTest: PausedTestIdentity; onPress: () => void }) {
  const { field, part } = props.pausedTest;
  return (
    <Pressable style={styles.resumeButton} onPress={props.onPress}>
      <Text style={styles.resumeButtonLabel}>
        Pokračuj v testu — {fieldLabel(field)} {testPartRangeLabel(field, part)}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  // Resume button prominent at the top, full row width above the type/set buttons.
  resumeButton: {
    backgroundColor: '#8FD08F', // green — visually distinct from the orange new-test buttons
    borderRadius: 24,
    paddingVertical: 14,
    paddingHorizontal: 24,
    alignItems: 'center',
    width: '100%', // width + maxWidth (not alignSelf stretch) so the parent's alignItems centers it
    maxWidth: 720,
    marginBottom: 16,
  },
  resumeButtonLabel: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1E4620',
    textAlign: 'center',
  },
});
