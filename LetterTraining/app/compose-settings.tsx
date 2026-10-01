// Settings page of the "Skládání slov" game - `_LetterTraining_PROMPTS.md` / "## Q&A 5 — Skládání slov round 2"
// ("Chooseable in settings of the game (CAPITALS, lower_case)"); persisted via AsyncStorage (src/compose/settings.ts),
// same load/save + race-guard pattern as TreninkPorozumeni app/settings.tsx.

import { useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { TileCase } from '../src/compose/logic';
import { DEFAULT_TILE_CASE, loadTileCase, saveTileCase } from '../src/compose/settings';

const CHOICES: { value: TileCase; label: string; sample: string }[] = [
  { value: 'upper', label: 'VELKÁ PÍSMENA', sample: 'KOČ KA' },
  { value: 'lower', label: 'malá písmena', sample: 'koč ka' },
];

export default function ComposeSettingsScreen() {
  const router = useRouter();
  const [tileCase, setTileCase] = useState<TileCase>(DEFAULT_TILE_CASE);
  // Race guard: a tap before the async load resolves must not be overwritten by the stale stored value.
  const userChoseRef = useRef(false);

  useEffect(() => {
    let cancelled = false;
    loadTileCase().then((stored) => {
      if (!cancelled && !userChoseRef.current) {
        setTileCase(stored);
      }
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const choose = (value: TileCase) => {
    userChoseRef.current = true;
    setTileCase(value);
    void saveTileCase(value);
  };

  const goBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={goBack} accessibilityRole="button" accessibilityLabel="Zpět" style={styles.backButton} hitSlop={8}>
          <Text style={styles.backButtonText}>‹ Zpět</Text>
        </Pressable>
        <Text style={styles.headerTitle}>Nastavení – Skládání slov</Text>
      </View>
      <View style={styles.body}>
        <Text style={styles.sectionTitle}>Písmena na kartičkách</Text>
        {CHOICES.map((choice) => {
          const selected = choice.value === tileCase;
          return (
            <Pressable
              key={choice.value}
              accessibilityRole="radio"
              accessibilityState={{ selected }}
              style={[styles.choice, selected && styles.choiceSelected]}
              onPress={() => choose(choice.value)}
            >
              <Text style={styles.choiceLabel}>{choice.label}</Text>
              <Text style={styles.choiceSample}>{choice.sample}</Text>
            </Pressable>
          );
        })}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF6E5' },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 8 },
  backButton: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12, backgroundColor: '#FFFFFF' },
  backButtonText: { fontSize: 18, fontWeight: '700', color: '#6B5B7B' },
  headerTitle: { flex: 1, marginHorizontal: 10, fontSize: 20, fontWeight: '800', color: '#5B3E96', textAlign: 'center' },
  body: { padding: 20, maxWidth: 640, width: '100%', alignSelf: 'center' },
  sectionTitle: { fontSize: 22, fontWeight: '800', color: '#5B3E96', marginBottom: 12 },
  choice: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    borderWidth: 3,
    borderColor: '#E8D9BC',
    padding: 16,
    marginBottom: 12,
  },
  choiceSelected: { borderColor: '#FFB23F', backgroundColor: '#FFF0D0' },
  choiceLabel: { fontSize: 22, fontWeight: '800', color: '#5B3E96' },
  choiceSample: { fontSize: 30, fontWeight: '800', color: '#E0457B', marginTop: 4 },
});
