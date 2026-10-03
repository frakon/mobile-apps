// Test-set list page of one test type — requested in _TreninkPorozumeni_Fields123_PROMPTS.md
// ("User request 25"): lists only the groups of 10 that exist ("1–10", "11–20", … up to
// "91–100"), an empty-state message for a type without items, a "go back" button; tapping a
// set starts the game for that type and group (fresh — it clears any paused test). Pause in
// the game returns here, so this page also offers "Pokračuj v testu" (shared with the start page
// via src/pausedTestOffer.tsx; decision logged in the task's open_questions.md).
// Extra category (_TreninkPorozumeni_Fields123_PROMPTS.md "User request 27" + "User request 28" Q1/Q2): ONE "Extra" tile after the regular groups,
// shown only if the type has Extra items; it opens this same screen as the Extra sub-screen (/sets?field=…&extra=1)
// listing the Extra groups of 10 ("Extra 1–10", …; part numbers 11, 12, … — src/rounds.ts).

import { useFocusEffect, useLocalSearchParams, useRouter } from 'expo-router';
import React, { useCallback, useEffect, useRef } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { FIELDS, fieldLabel, FieldId } from '../src/items';
import { clearPausedGame } from '../src/pausedGame';
import { ResumeTestButton, usePausedTestOffer } from '../src/pausedTestOffer';
import { extraTestParts, testPartCount, testPartRangeLabel } from '../src/rounds';

export default function TestSetsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{ field?: string; extra?: string }>();
  const showExtra = !Array.isArray(params.extra) && params.extra === '1';
  const fieldIsValid =
    !Array.isArray(params.field) && FIELDS.some((candidate) => candidate.id === params.field);
  const field = (fieldIsValid ? params.field : 'field51') as FieldId;
  const extraParts = extraTestParts(field);
  const parts = showExtra ? extraParts : Array.from({ length: testPartCount(field) }, (_, index) => index + 1);
  const showExtraTile = !showExtra && extraParts.length > 0;
  const pausedTest = usePausedTestOffer();

  // Same double-tap guard as the start page; re-armed on focus.
  const navigationPendingRef = useRef(false);
  useFocusEffect(
    useCallback(() => {
      navigationPendingRef.current = false;
    }, [])
  );

  // Invalid deep link (/sets?field=xyz): back to the start page.
  useEffect(() => {
    if (!fieldIsValid) {
      router.replace('/');
    }
  }, [fieldIsValid, router]);

  const goBack = useCallback(() => {
    if (navigationPendingRef.current) {
      return;
    }
    navigationPendingRef.current = true;
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/');
    }
  }, [router]);

  if (!fieldIsValid) {
    return <SafeAreaView style={styles.container} />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>{showExtra ? `${fieldLabel(field)} — Extra` : fieldLabel(field)}</Text>
        {pausedTest !== null && (
          <ResumeTestButton
            pausedTest={pausedTest}
            onPress={() => {
              if (navigationPendingRef.current) {
                return;
              }
              navigationPendingRef.current = true;
              // Resuming CONSUMES the paused store inside the game screen (resume: '1').
              router.push({
                pathname: '/game',
                params: { field: pausedTest.field, part: String(pausedTest.part), resume: '1' },
              });
            }}
          />
        )}
        {parts.length === 0 ? (
          <Text style={styles.emptyText}>Zatím tu nejsou žádné testy.</Text>
        ) : (
          <View style={styles.setButtonsGrid}>
            {parts.map((part) => (
              <Pressable
                key={part}
                style={styles.setButton}
                onPress={() => {
                  if (navigationPendingRef.current) {
                    return;
                  }
                  navigationPendingRef.current = true;
                  clearPausedGame(); // starting a new test invalidates any paused one
                  router.push({ pathname: '/game', params: { field, part: String(part) } });
                }}
              >
                <Text style={styles.setButtonLabel}>{testPartRangeLabel(field, part)}</Text>
              </Pressable>
            ))}
            {showExtraTile && (
              <Pressable
                style={[styles.setButton, styles.extraButton]}
                onPress={() => {
                  if (navigationPendingRef.current) {
                    return;
                  }
                  navigationPendingRef.current = true;
                  router.push({ pathname: '/sets', params: { field, extra: '1' } });
                }}
              >
                <Text style={styles.setButtonLabel}>Extra</Text>
              </Pressable>
            )}
          </View>
        )}
      </ScrollView>
      {/* "Go back" button: absolutely positioned, so it MUST come AFTER the full-screen
          ScrollView sibling (later siblings are hit-tested first — "User follow-up request 20");
          absolute offsets need the safe-area insets added explicitly. */}
      <View style={[styles.topBar, { top: 16 + insets.top, left: 24 + insets.left }]}>
        <Pressable style={styles.backButton} accessibilityLabel="Zpět" onPress={goBack}>
          <Text style={styles.backButtonLabel}>← Zpět</Text>
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
  scrollContent: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    paddingHorizontal: 24,
    paddingTop: 80, // keeps the title clear of the back button on a short landscape iPhone
  },
  topBar: {
    position: 'absolute',
  },
  backButton: {
    backgroundColor: '#FFE9A8',
    borderRadius: 28,
    height: 56,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backButtonLabel: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#4C3000',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#4C4536',
    marginBottom: 20,
    textAlign: 'center',
  },
  emptyText: {
    fontSize: 22,
    color: '#A79C87',
    textAlign: 'center',
  },
  // Up to 10 sets (+ the Extra tile): 5 per row on both iPad and landscape iPhone.
  setButtonsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 12,
    width: '100%',
    maxWidth: 900,
  },
  setButton: {
    width: '18%',
    minHeight: 72,
    backgroundColor: '#FFB84D',
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  extraButton: {
    backgroundColor: '#B8D98A',
  },
  setButtonLabel: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4C3000',
  },
});
