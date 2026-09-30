// Settings page — setting #1: 2-image vs 4-image regime (persisted via AsyncStorage,
// default 2 images). Requested in _TreninkPorozumeni_Fields123_PROMPTS.md (section
// "User request", settings bullet).

import { useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Regime } from '../src/rounds';
import { DEFAULT_REGIME, loadRegime, saveRegime } from '../src/settings';

export default function SettingsScreen() {
  const router = useRouter();
  const [regime, setRegime] = useState<Regime>(DEFAULT_REGIME);
  const [loaded, setLoaded] = useState(false);
  // Race guard: if the user taps an option before the async load resolves, the stale
  // loaded value must NOT overwrite the tapped one (UI would revert while storage holds
  // the new value).
  const userChoseRef = useRef(false);

  useEffect(() => {
    let cancelled = false;
    loadRegime().then((stored) => {
      if (!cancelled) {
        if (!userChoseRef.current) {
          setRegime(stored);
        }
        setLoaded(true);
      }
    });
    return () => {
      cancelled = true;
    };
  }, []);

  // Back with a history guard (same as game.tsx): opened cold via deep link there is
  // nothing to pop, so replace with the field-selection page instead of a no-op/app exit.
  const goBackToSelection = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/');
    }
  };

  const selectRegime = (value: Regime) => {
    userChoseRef.current = true;
    setRegime(value);
    void saveRegime(value);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Nastavení</Text>
      <Text style={styles.settingLabel}>Počet obrázků</Text>
      <View style={styles.optionsRow}>
        {([2, 4] as const).map((value) => {
          const selected = loaded && regime === value;
          return (
            <Pressable
              key={value}
              style={[styles.optionButton, selected && styles.optionButtonSelected]}
              onPress={() => selectRegime(value)}
            >
              <Text style={[styles.optionLabel, selected && styles.optionLabelSelected]}>
                {value} obrázky
              </Text>
            </Pressable>
          );
        })}
      </View>
      <Pressable style={styles.backButton} onPress={goBackToSelection}>
        <Text style={styles.backButtonLabel}>Zpět</Text>
      </Pressable>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FDF8EF',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#4C4536',
    marginBottom: 32,
  },
  settingLabel: {
    fontSize: 26,
    color: '#4C4536',
    marginBottom: 16,
  },
  optionsRow: {
    flexDirection: 'row',
    gap: 16,
  },
  optionButton: {
    backgroundColor: '#FFFFFF',
    borderWidth: 3,
    borderColor: '#E4D9C3',
    borderRadius: 24,
    paddingVertical: 16,
    paddingHorizontal: 32,
  },
  optionButtonSelected: {
    backgroundColor: '#FFB84D',
    borderColor: '#D89A2E',
  },
  optionLabel: {
    fontSize: 24,
    color: '#7A6F5D',
  },
  optionLabelSelected: {
    fontWeight: 'bold',
    color: '#4C3000',
  },
  backButton: {
    marginTop: 48,
    backgroundColor: '#FFE9A8',
    borderRadius: 28,
    paddingHorizontal: 40,
    paddingVertical: 16,
  },
  backButtonLabel: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4C4536',
  },
});
