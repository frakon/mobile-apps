// Initial page — selection of the field to train (fields stay separated, never mixed) +
// link to Settings. Requested in _TreninkPorozumeni_Fields123_PROMPTS.md (section
// "User request", initial-page bullet).

import { useFocusEffect, useRouter } from 'expo-router';
import React, { useCallback, useRef } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { FIELDS } from '../src/items';
import { ResumeTestButton, usePausedTestOffer } from '../src/pausedTestOffer';

// "User request 25" in _TreninkPorozumeni_Fields123_PROMPTS.md: the start page offers exactly
// the 15 test types 5.1–5.15; a tapped type opens app/sets.tsx (its test sets 1–10, 11–20, …).
// Types without items stay tappable — the sets page shows the empty state.

export default function FieldSelectionScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  // Synchronous navigation guard: a child's double-tap (or 5.1 + 5.2 tapped quickly) must
  // not push two game screens. Re-armed whenever this screen regains focus.
  const navigationPendingRef = useRef(false);
  // Paused test offer ("Pokračuj v testu" — "User follow-up request 4"): regime check and
  // focus re-check shared with app/sets.tsx in src/pausedTestOffer.tsx.
  const pausedTest = usePausedTestOffer();

  useFocusEffect(
    useCallback(() => {
      navigationPendingRef.current = false;
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
          old single-column layout overflowed the landscape screen height. The type buttons now sit
          in a 5-column grid (landscape width is abundant, height is scarce — "User request 25"), the title and
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
          <ResumeTestButton
            pausedTest={pausedTest}
            onPress={() =>
              navigateOnce(() =>
                // Resuming CONSUMES the paused store inside the game screen (resume: '1').
                router.push({
                  pathname: '/game',
                  params: { field: pausedTest.field, part: String(pausedTest.part), resume: '1' },
                })
              )
            }
          />
        )}
        {/* 15 type buttons ("User request 25"): 5 columns × 3 rows — landscape width is
            abundant, height is scarce (request 18); the ScrollView remains the safety net on
            a landscape iPhone. Opening the sets page does NOT clear the paused test — only
            starting a set does (app/sets.tsx / app/game.tsx). */}
        <View style={styles.fieldButtonsGrid}>
          {FIELDS.map((field) => (
            <Pressable
              key={field.id}
              style={styles.fieldButton}
              onPress={() =>
                navigateOnce(() => router.push({ pathname: '/sets', params: { field: field.id } }))
              }
            >
              <Text style={styles.fieldButtonNumber}>{field.number}</Text>
              <Text style={styles.fieldButtonLabel} numberOfLines={2} adjustsFontSizeToFit>
                {field.name}
              </Text>
            </Pressable>
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
  // 15 type buttons wrapped 5 per row ("User request 25"): width 18% + gap 10 keeps 5 per row
  // from a landscape iPhone (~650 pt usable) up to the 1000 pt iPad cap.
  fieldButtonsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 10,
    width: '100%',
    maxWidth: 1000,
  },
  fieldButton: {
    width: '18%',
    minHeight: 76,
    backgroundColor: '#FFB84D',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fieldButtonNumber: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#4C3000',
  },
  fieldButtonLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#4C3000',
    textAlign: 'center',
  },
});
