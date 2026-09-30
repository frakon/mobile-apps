// Settings page — setting #1: 2-image vs 4-image regime (persisted via AsyncStorage,
// default 2 images). Requested in _TreninkPorozumeni_Fields123_PROMPTS.md (section
// "User request", settings bullet).
// Setting #2 — speech speed ("User follow-up request 21"): a continuous slider 60–150 %
// (integer steps) with five animal jump-to marks (Šnek 60, Želva 80, Člověk 100,
// Králík 120, Gepard 150); persisted via AsyncStorage, default 100 %.

import Slider from '@react-native-community/slider';
import { useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Regime } from '../src/rounds';
import {
  clampSpeechSpeedPercent,
  DEFAULT_REGIME,
  DEFAULT_SPEECH_SPEED_PERCENT,
  loadRegime,
  loadSpeechSpeedPercent,
  MAX_SPEECH_SPEED_PERCENT,
  MIN_SPEECH_SPEED_PERCENT,
  saveRegime,
  saveSpeechSpeedPercent,
} from '../src/settings';

// The five animal marks on the speed bar (positions in percent-of-speed; the slider itself
// accepts EVERY integer in between — 64 %, 90 %, ... — per "User follow-up request 21").
const SPEED_MARKS: { percent: number; emoji: string; label: string }[] = [
  { percent: 60, emoji: '🐌', label: 'Šnek' },
  { percent: 80, emoji: '🐢', label: 'Želva' },
  { percent: 100, emoji: '🧍', label: 'Člověk' },
  { percent: 120, emoji: '🐇', label: 'Králík' },
  { percent: 150, emoji: '🐆', label: 'Gepard' },
];

const SPEED_RANGE = MAX_SPEECH_SPEED_PERCENT - MIN_SPEECH_SPEED_PERCENT;

export default function SettingsScreen() {
  const router = useRouter();
  const [regime, setRegime] = useState<Regime>(DEFAULT_REGIME);
  const [loaded, setLoaded] = useState(false);
  // Race guard: if the user taps an option before the async load resolves, the stale
  // loaded value must NOT overwrite the tapped one (UI would revert while storage holds
  // the new value).
  const userChoseRef = useRef(false);
  // Speech speed ("User follow-up request 21") — same load/save + race-guard pattern.
  const [speedPercent, setSpeedPercent] = useState(DEFAULT_SPEECH_SPEED_PERCENT);
  const [speedLoaded, setSpeedLoaded] = useState(false);
  const userChoseSpeedRef = useRef(false);

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
    loadSpeechSpeedPercent().then((stored) => {
      if (!cancelled) {
        if (!userChoseSpeedRef.current) {
          setSpeedPercent(stored);
        }
        setSpeedLoaded(true);
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

  // Live slider drag updates the shown value; persisted only on sliding complete and on
  // animal-mark tap (persist=true) — intermediate drag values update state only.
  const selectSpeed = (value: number, persist: boolean) => {
    userChoseSpeedRef.current = true;
    const clamped = clampSpeechSpeedPercent(value);
    setSpeedPercent(clamped);
    if (persist) {
      void saveSpeechSpeedPercent(clamped);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* ScrollView safety net (same pattern as index.tsx, request 18): with the speech-speed
          setting added the content (~495 pt) is taller than a landscape phone screen and the
          "Zpět" button fell off-screen. flexGrow centers the content when it fits; scrolling
          only kicks in when it does not. (No absolutely positioned sibling on this page — if
          one is ever added, it MUST come AFTER the ScrollView in JSX, see index.tsx gear.) */}
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
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
      {/* Speech speed ("User follow-up request 21"): continuous 60–150 % bar; the five
          animal marks below the slider jump to their exact value on tap. */}
      <Text style={styles.settingLabel}>
        Rychlost řeči: <Text style={styles.speedValue}>{speedPercent} %</Text>
      </Text>
      <View style={styles.speedBarContainer}>
        <Slider
          style={styles.speedSlider}
          minimumValue={MIN_SPEECH_SPEED_PERCENT}
          maximumValue={MAX_SPEECH_SPEED_PERCENT}
          step={1}
          // iOS-only per the package typings ("Defaults to false on iOS. No effect on Android
          // or Windows."): tapping the track moves the thumb directly — easier for kids.
          tapToSeek
          value={speedLoaded ? speedPercent : DEFAULT_SPEECH_SPEED_PERCENT}
          onValueChange={(value) => selectSpeed(value, false)}
          onSlidingComplete={(value) => selectSpeed(value, true)}
          minimumTrackTintColor="#FFB84D"
          maximumTrackTintColor="#E4D9C3"
          thumbTintColor="#D89A2E"
        />
        <View style={styles.speedMarksRow}>
          {SPEED_MARKS.map((mark) => {
            const selected = speedPercent === mark.percent;
            // Middle marks: centered on their proportional position (fixed width + negative
            // margin). End marks (Šnek/Gepard): anchored INSIDE the row at left/right 0 —
            // centering them on 0 %/100 % pushed half of each mark past the row bounds, and
            // React Native does not deliver touches outside the parent's bounds, so their
            // outer halves were dead. Tick alignment stays approximate (the native track is
            // inset by the thumb radius anyway).
            const isFirst = mark.percent === MIN_SPEECH_SPEED_PERCENT;
            const isLast = mark.percent === MAX_SPEECH_SPEED_PERCENT;
            const positionStyle = isFirst
              ? { left: 0 }
              : isLast
                ? { right: 0 }
                : ({
                    left: `${((mark.percent - MIN_SPEECH_SPEED_PERCENT) / SPEED_RANGE) * 100}%`,
                    marginLeft: -38, // center the mark on its proportional position
                  } as const);
            return (
              <Pressable
                key={mark.percent}
                style={[styles.speedMark, positionStyle]}
                accessibilityLabel={`${mark.label} ${mark.percent} %`}
                onPress={() => selectSpeed(mark.percent, true)}
              >
                <Text style={styles.speedMarkEmoji}>{mark.emoji}</Text>
                <Text style={[styles.speedMarkLabel, selected && styles.speedMarkLabelSelected]}>
                  {mark.label}
                </Text>
                <Text style={[styles.speedMarkPercent, selected && styles.speedMarkLabelSelected]}>
                  {mark.percent} %
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>
      <Pressable style={styles.backButton} onPress={goBackToSelection}>
        <Text style={styles.backButtonLabel}>Zpět</Text>
      </Pressable>
      </ScrollView>
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
  // flexGrow + centering: content centered exactly like before when it fits; the ScrollView
  // takes over on small landscape screens (same pattern as index.tsx scrollContent).
  scrollContent: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  title: {
    fontSize: 32, // was 36 — height is scarce in landscape
    fontWeight: 'bold',
    color: '#4C4536',
    marginBottom: 24, // was 32
  },
  settingLabel: {
    fontSize: 26,
    color: '#4C4536',
    marginBottom: 16,
  },
  optionsRow: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 24, // space before the speech-speed setting below (was 32; height is scarce)
  },
  speedValue: {
    fontWeight: 'bold',
    color: '#4C3000',
  },
  // The bar + marks share one fixed-width container so the marks' percentage positions
  // line up with the slider track.
  speedBarContainer: {
    width: '100%',
    maxWidth: 560,
    alignItems: 'stretch',
  },
  speedSlider: {
    width: '100%',
    height: 40,
  },
  speedMarksRow: {
    height: 76, // emoji + label + percent stacked
    marginTop: 2,
  },
  speedMark: {
    position: 'absolute',
    width: 76,
    alignItems: 'center',
  },
  speedMarkEmoji: {
    fontSize: 24,
  },
  speedMarkLabel: {
    fontSize: 15,
    color: '#7A6F5D',
  },
  speedMarkPercent: {
    fontSize: 13,
    color: '#A79C87',
  },
  speedMarkLabelSelected: {
    fontWeight: 'bold',
    color: '#4C3000',
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
    marginTop: 32, // was 48; height is scarce in landscape
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
