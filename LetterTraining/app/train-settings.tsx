// Settings page of "Abecedový vlak" - `_LetterTraining_PROMPTS.md` / "## Follow-up prompt 5 — new game "Abecedový vlak"
// (verbatim)" (two alphabets with czech / english flag, default czech; capitals or lower letters), "## Q&A 6" (waiting
// wagons 4–8), "## Q&A 7" (default 6, remembered; drawn flags). Persisted via src/train/settings.ts; same load/save +
// race-guard pattern as app/compose-settings.tsx. Landscape like the game (avoids a rotation flip on open/close).

import * as ScreenOrientation from 'expo-screen-orientation';
import { useNavigation, useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { CzechFlag, UnitedKingdomFlag } from '../src/train/Flags';
import { MAXIMUM_WAITING_WAGONS, MINIMUM_WAITING_WAGONS, TrainAlphabet, TrainLetterCase } from '../src/train/logic';
import { DEFAULT_TRAIN_SETTINGS, TrainSettings, loadTrainSettings, saveTrainSettings } from '../src/train/settings';

const ALPHABETS: { value: TrainAlphabet; label: string }[] = [
  { value: 'cz', label: 'Česká abeceda' },
  { value: 'en', label: 'Anglická abeceda' },
];
const CASES: { value: TrainLetterCase; label: string }[] = [
  { value: 'upper', label: 'VELKÁ  A B C' },
  { value: 'lower', label: 'malá  a b c' },
];
const COUNTS = Array.from({ length: MAXIMUM_WAITING_WAGONS - MINIMUM_WAITING_WAGONS + 1 }, (_, index) => MINIMUM_WAITING_WAGONS + index);

export default function TrainSettingsScreen() {
  const router = useRouter();
  const navigation = useNavigation();
  const [settings, setSettings] = useState<TrainSettings>(DEFAULT_TRAIN_SETTINGS);
  // Race guard: a tap before the async load resolves must not be overwritten by the stale stored value.
  const userChoseRef = useRef(false);

  useEffect(() => {
    ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE).catch(() => undefined);
    let cancelled = false;
    loadTrainSettings().then((stored) => {
      if (!cancelled && !userChoseRef.current) {
        setSettings(stored);
      }
    });
    return () => {
      cancelled = true;
      // Unlock on leave unless the screen we return to is the (also landscape) game, which keeps its own lock
      // (verification round 1 L7: deep link / replace would otherwise leave the landscape lock in place).
      let returningToTrain = false;
      try {
        const routes = navigation.getState()?.routes ?? [];
        const remaining = routes.filter((route) => route.name !== 'train-settings');
        returningToTrain = remaining[remaining.length - 1]?.name === 'train';
      } catch {
        returningToTrain = false;
      }
      if (!returningToTrain) {
        ScreenOrientation.unlockAsync().catch(() => undefined);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const update = (change: Partial<TrainSettings>) => {
    userChoseRef.current = true;
    setSettings((previous) => {
      const next = { ...previous, ...change };
      void saveTrainSettings(next);
      return next;
    });
  };

  const goBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/train');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={goBack} accessibilityRole="button" accessibilityLabel="Zpět" style={styles.backButton} hitSlop={8}>
          <Text style={styles.backButtonText}>‹ Zpět</Text>
        </Pressable>
        <Text style={styles.headerTitle}>Nastavení – Abecedový vlak</Text>
      </View>
      <ScrollView contentContainerStyle={styles.body}>
        <Text style={styles.sectionTitle}>Abeceda</Text>
        <View style={styles.row}>
          {ALPHABETS.map((choice) => {
            const selected = settings.alphabet === choice.value;
            return (
              <Pressable
                key={choice.value}
                accessibilityRole="radio"
                accessibilityState={{ selected }}
                style={[styles.choice, selected && styles.choiceSelected]}
                onPress={() => update({ alphabet: choice.value })}
              >
                {choice.value === 'cz' ? <CzechFlag width={54} /> : <UnitedKingdomFlag width={60} />}
                <Text style={styles.choiceLabel}>{choice.label}</Text>
              </Pressable>
            );
          })}
        </View>
        <Text style={styles.sectionTitle}>Písmena</Text>
        <View style={styles.row}>
          {CASES.map((choice) => {
            const selected = settings.letterCase === choice.value;
            return (
              <Pressable
                key={choice.value}
                accessibilityRole="radio"
                accessibilityState={{ selected }}
                style={[styles.choice, selected && styles.choiceSelected]}
                onPress={() => update({ letterCase: choice.value })}
              >
                <Text style={styles.choiceLabel}>{choice.label}</Text>
              </Pressable>
            );
          })}
        </View>
        <Text style={styles.sectionTitle}>Počet čekajících vagónů</Text>
        <View style={styles.row}>
          {COUNTS.map((count) => {
            const selected = settings.waitingWagons === count;
            return (
              <Pressable
                key={count}
                accessibilityRole="radio"
                accessibilityState={{ selected }}
                style={[styles.countChoice, selected && styles.choiceSelected]}
                onPress={() => update({ waitingWagons: count })}
              >
                <Text style={styles.choiceLabel}>{count}</Text>
              </Pressable>
            );
          })}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF6E5' },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 6 },
  backButton: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12, backgroundColor: '#FFFFFF' },
  backButtonText: { fontSize: 18, fontWeight: '700', color: '#6B5B7B' },
  headerTitle: { flex: 1, marginHorizontal: 10, fontSize: 20, fontWeight: '800', color: '#5B3E96', textAlign: 'center' },
  body: { paddingHorizontal: 20, paddingBottom: 20, maxWidth: 760, width: '100%', alignSelf: 'center' },
  sectionTitle: { fontSize: 19, fontWeight: '800', color: '#5B3E96', marginTop: 8, marginBottom: 6 },
  row: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  choice: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 3,
    borderColor: '#E8D9BC',
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  countChoice: {
    minWidth: 54,
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 3,
    borderColor: '#E8D9BC',
    paddingVertical: 8,
  },
  choiceSelected: { borderColor: '#FFB23F', backgroundColor: '#FFF0D0' },
  choiceLabel: { fontSize: 20, fontWeight: '800', color: '#5B3E96' },
});
