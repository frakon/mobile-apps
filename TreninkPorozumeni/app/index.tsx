// Initial page — selection of the field to train (fields stay separated, never mixed) +
// link to Settings. Requested in _TreninkPorozumeni_Fields123_PROMPTS.md (section
// "User request", initial-page bullet).

import { useFocusEffect, useRouter } from 'expo-router';
import React, { useCallback, useRef, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { FieldId } from '../src/items';
import { clearPausedGame, peekPausedGame } from '../src/pausedGame';
import { examplesForTestPart, TestPart } from '../src/rounds';
import { loadRegime } from '../src/settings';

const FIELDS: { id: FieldId; label: string }[] = [
  { id: 'field51', label: '5.1 Reverzibilní věty' },
  { id: 'field52', label: '5.2 Předložky a prostor' },
  { id: 'field53', label: '5.3 Jednotné a množné číslo' },
];

// Sub-tests of 10 ("User follow-up request 21" in _TreninkPorozumeni_Fields123_PROMPTS.md):
// each field is split into two tests — "<field label> 1" (examples 1–10) and
// "<field label> 2" (examples 11–20) — so the page shows 6 test buttons.
const TEST_PARTS: TestPart[] = [1, 2];

function testLabel(field: FieldId, part: TestPart): string {
  return `${FIELDS.find((candidate) => candidate.id === field)?.label ?? ''} ${part}`;
}

// Example counts derived from the data — sub-tests without examples get a visibly
// disabled button (no fake "Hotovo!" games on empty sub-tests).
const exampleCountByTest = new Map<string, number>(
  FIELDS.flatMap((field) =>
    TEST_PARTS.map((part): [string, number] => [
      `${field.id}:${part}`,
      examplesForTestPart(field.id, part).length,
    ])
  )
);

export default function FieldSelectionScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  // Synchronous navigation guard: a child's double-tap (or 5.1 + 5.2 tapped quickly) must
  // not push two game screens. Re-armed whenever this screen regains focus.
  const navigationPendingRef = useRef(false);
  // Paused test offer ("Pokračuj v testu" — see _TreninkPorozumeni_Fields123_PROMPTS.md,
  // "User follow-up request 4"): shown only when a paused test exists AND the current stored
  // image-regime setting still equals the paused test's regime. Re-checked on every focus, so
  // pause → settings (regime unchanged) → back keeps the button, while changing the regime in
  // settings makes it disappear (the incompatible paused test is cleared = invalidated).
  // Paused-test identity is field + part ("User follow-up request 21").
  const [pausedTest, setPausedTest] = useState<{ field: FieldId; part: TestPart } | null>(null);

  useFocusEffect(
    useCallback(() => {
      navigationPendingRef.current = false;
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

  const navigateOnce = useCallback(
    (destination: () => void) => {
      if (navigationPendingRef.current) {
        return;
      }
      navigationPendingRef.current = true;
      destination();
    },
    []
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Compact landscape layout + ScrollView safety net ("User follow-up request 18" in
          _TreninkPorozumeni_Fields123_PROMPTS.md): with the "Pokračuj v testu" button visible the
          old single-column layout overflowed the landscape screen height. The field buttons now sit
          side by side in ONE ROW (landscape width is abundant, height is scarce), the title and
          paddings are smaller, and everything scrollable content-wise is wrapped in a ScrollView
          whose content centers when it fits (flexGrow) — scrolling only kicks in when it does not.
          The settings gear stays absolutely positioned OUTSIDE the ScrollView, unchanged. */}
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>Co budeme trénovat?</Text>
        {pausedTest !== null && (
          <Pressable
            style={styles.resumeButton}
            onPress={() =>
              navigateOnce(() =>
                // Resuming CONSUMES the paused store inside the game screen (resume: '1').
                router.push({
                  pathname: '/game',
                  params: { field: pausedTest.field, part: String(pausedTest.part), resume: '1' },
                })
              )
            }
          >
            <Text style={styles.resumeButtonLabel}>
              {/* Label names the SUB-test, e.g. "5.1 Reverzibilní věty 2" ("request 21"). */}
              Pokračuj v testu — {testLabel(pausedTest.field, pausedTest.part)}
            </Text>
          </Pressable>
        )}
        {/* 6 test buttons ("User follow-up request 21"): 3 columns (one per field) × 2 rows
            (part 1 above part 2) — the request-18 compact landscape layout kept: width is
            abundant, height is scarce, and the ScrollView below remains the safety net. */}
        <View style={styles.fieldButtonsRow}>
          {FIELDS.map((field) => (
            <View key={field.id} style={styles.fieldColumn}>
              {TEST_PARTS.map((part) => {
                const hasExamples = (exampleCountByTest.get(`${field.id}:${part}`) ?? 0) > 0;
                return (
                  <Pressable
                    key={part}
                    style={[styles.fieldButton, !hasExamples && styles.fieldButtonDisabled]}
                    disabled={!hasExamples}
                    onPress={() =>
                      navigateOnce(() => {
                        clearPausedGame(); // starting a new test invalidates any paused one
                        setPausedTest(null);
                        router.push({
                          pathname: '/game',
                          params: { field: field.id, part: String(part) },
                        });
                      })
                    }
                  >
                    <Text style={[styles.fieldButtonLabel, !hasExamples && styles.fieldButtonLabelDisabled]}>
                      {testLabel(field.id, part)}
                    </Text>
                    {!hasExamples && <Text style={styles.fieldButtonNote}>Zatím bez příkladů</Text>}
                  </Pressable>
                );
              })}
            </View>
          ))}
        </View>
      </ScrollView>
      {/* Settings gear ("User follow-up request 20" in _TreninkPorozumeni_Fields123_PROMPTS.md):
          MUST be rendered AFTER the full-screen ScrollView sibling. React Native hit-tests later
          siblings first, so when this absolutely positioned gear came before the ScrollView
          (request-18 rework), the ScrollView swallowed every touch on it — the settings button
          stopped working. Absolute offsets are measured from the padding-box, so SafeAreaView's
          inset padding does not apply here — add the insets explicitly (landscape notch/Dynamic
          Island). */}
      <View style={[styles.topBar, { top: 16 + insets.top, right: 24 + insets.right }]}>
        <Pressable
          style={styles.settingsButton}
          accessibilityLabel="Nastavení"
          onPress={() => navigateOnce(() => router.push('/settings'))}
        >
          <Text style={styles.settingsIcon}>⚙️</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FDF8EF',
  },
  scroll: {
    flex: 1,
  },
  // flexGrow + centering: when the content fits the screen it is centered exactly like before;
  // when it does not (small landscape screens + resume button), the ScrollView takes over.
  scrollContent: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    paddingHorizontal: 24,
  },
  topBar: {
    position: 'absolute',
  },
  settingsButton: {
    backgroundColor: '#FFE9A8',
    borderRadius: 32,
    width: 56,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
  },
  settingsIcon: {
    fontSize: 28,
  },
  title: {
    fontSize: 28, // was 36 — height is scarce in landscape ("User follow-up request 18")
    fontWeight: 'bold',
    color: '#4C4536',
    marginBottom: 20,
    textAlign: 'center',
  },
  // Resume button prominent at the top, full row width above the field buttons.
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
  // Three field COLUMNS side by side, each column stacking its two sub-test buttons
  // ("request 21": 6 tests; landscape width is abundant, height is scarce).
  fieldButtonsRow: {
    flexDirection: 'row',
    gap: 14,
    width: '100%',
    maxWidth: 900,
    alignItems: 'stretch',
  },
  fieldColumn: {
    flex: 1,
    gap: 10,
  },
  fieldButton: {
    flex: 1, // both buttons of a column share its height equally
    backgroundColor: '#FFB84D',
    borderRadius: 24,
    paddingVertical: 12, // was 16 — two stacked rows must still fit the landscape height
    paddingHorizontal: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fieldButtonDisabled: {
    backgroundColor: '#EFE6D4',
  },
  fieldButtonLabel: {
    fontSize: 20, // was 26 — the buttons share one row now, labels wrap to two lines
    fontWeight: 'bold',
    color: '#4C3000',
    textAlign: 'center',
  },
  fieldButtonLabelDisabled: {
    color: '#A79C87',
  },
  fieldButtonNote: {
    marginTop: 4,
    fontSize: 16,
    color: '#A79C87',
  },
});
