// "Začátky slov" training screen, levels 1-3 via the `level` route param - `_LetterTraining_PROMPTS.md` /
// "## Initial request (2026-10-01)" (Word starts training: General notes, Level 1, Level 2, Level 3) and
// "## Q&A (2026-10-01)" (L2/L3 wrong tap says the tapped syllable), "## Follow-up prompt 3 (verbatim)" (L2/L3 play the
// word with the first/last syllable emphasized).
//
// Feedback (same look as TreninkPorozumeni app/game.tsx):
// - correct tap: the option gets a green tint rgba(70,190,90,0.35) + green ✓, the letter/syllable sound plays, and the
//   next round shows after max(500 ms, end of that sound). DECISION (not user-specified): the request says both
//   "green checkmark shows for 0.5 second and then the next round" AND "for the right answer also play the sound of the
//   letter and go to the next round" - cutting the sound at 500 ms would make it unintelligible, so the round advances
//   only when BOTH the 500 ms passed and the sound ended (missing/failed sound counts as ended; 5 s safety cap).
// - wrong tap: the tapped option gets a red tint rgba(220,60,60,0.35) while the tapped option's letter/syllable sound
//   plays (plain 500 ms tint when there is no audio). The round is scored wrong on the first miss; the child continues
//   until the correct option is tapped.

import { Asset } from 'expo-asset';
import { setAudioModeAsync } from 'expo-audio';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Image, Pressable, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { playAudio, stopAudioIfOwnedBy } from '../src/audioController';
import {
  INITIAL_PROGRESS,
  PlayProgress,
  advanceRound,
  applyTap,
  buildRoundPlan,
  collectRoundAssetModules,
  optionAudio,
  optionLabel,
  roundWordAudio,
} from '../src/wordStarts/logic';
import { WordStartsDataset, WordStartsLevel, WordStartsRound } from '../src/wordStarts/types';
import { LETTER_AUDIO, REAL_SYLLABLES, SYLLABLE_AUDIO, WORDS } from '../src/words';

const DATASET: WordStartsDataset = {
  words: WORDS,
  letterAudio: LETTER_AUDIO,
  syllableAudio: SYLLABLE_AUDIO,
  realSyllables: REAL_SYLLABLES,
};

const FEEDBACK_DURATION_MILLISECONDS = 500;
const OPTION_SOUND_SAFETY_TIMEOUT_MILLISECONDS = 5000;
const WORD_SOUND_SAFETY_TIMEOUT_MILLISECONDS = 15000;
const PLAYBACK_RATE = 1;

const LEVEL_TITLES: Record<WordStartsLevel, string> = {
  1: 'Na které písmeno slovo začíná?',
  2: 'Kterou slabikou slovo začíná?',
  3: 'Kterou slabikou slovo končí?',
};

type Feedback = { kind: 'correct' | 'wrong'; index: number } | null;

function parseLevel(raw: string | string[] | undefined): WordStartsLevel {
  const value = Array.isArray(raw) ? raw[0] : raw;
  return value === '2' ? 2 : value === '3' ? 3 : 1;
}

export default function WordsScreen() {
  const router = useRouter();
  const { level: levelParam } = useLocalSearchParams<{ level?: string }>();
  const level = parseLevel(levelParam);

  const [roundPlan, setRoundPlan] = useState<WordStartsRound[]>(() => buildRoundPlan(DATASET, level));
  const [progress, setProgress] = useState<PlayProgress>(INITIAL_PROGRESS);
  const [feedback, setFeedback] = useState<Feedback>(null);
  const [audioModeReady, setAudioModeReady] = useState(false);

  // Mirrors for async continuations; generation invalidates every pending timer/sound callback of an older tap/round.
  const progressRef = useRef(progress);
  progressRef.current = progress;
  const generation = useRef(0);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const owner = useRef({}).current; // identity of this screen for stopAudioIfOwnedBy

  const clearTimers = useCallback(() => {
    for (const timer of timers.current) {
      clearTimeout(timer);
    }
    timers.current = [];
  }, []);

  const finished = progress.roundIndex >= roundPlan.length;
  const currentRound = finished ? null : roundPlan[progress.roundIndex];

  // Prefetch of the upcoming rounds' assets - identical mechanism to TreninkPorozumeni app/game.tsx ("every data which
  // are needed in the next rounds of current training shall be pre-fetched 2 rounds in advance",
  // `_LetterTraining_PROMPTS.md` / "## Initial request (2026-10-01)"): on every round start fire-and-forget
  // Asset.fromModule(id).downloadAsync() for rounds [roundIndex .. roundIndex + 2] (current + next two). Failures are
  // ignored (lazy load stays the fallback); the Set de-duplicates per screen instance.
  const prefetchedModuleIdsRef = useRef<Set<number>>(new Set());
  useEffect(() => {
    for (let index = progress.roundIndex; index <= progress.roundIndex + 2 && index < roundPlan.length; index++) {
      for (const moduleId of collectRoundAssetModules(roundPlan[index], DATASET)) {
        if (prefetchedModuleIdsRef.current.has(moduleId)) {
          continue;
        }
        prefetchedModuleIdsRef.current.add(moduleId);
        try {
          Asset.fromModule(moduleId)
            .downloadAsync()
            .catch(() => {
              // Silent by design: the round will lazy-load the asset.
            });
        } catch {
          // fromModule threw synchronously (unknown module id): equally silent.
        }
      }
    }
  }, [roundPlan, progress.roundIndex]);

  useEffect(() => {
    setAudioModeAsync({ playsInSilentMode: true })
      .catch(() => {
        // Audio mode is a nicety (play even with the mute switch on); ignore failures.
      })
      .then(() => setAudioModeReady(true));
  }, []);

  // Leaving the screen: stop our sound and every pending continuation.
  useEffect(() => {
    return () => {
      generation.current += 1;
      clearTimers();
      stopAudioIfOwnedBy(owner);
    };
  }, [clearTimers, owner]);

  const playWord = useCallback(
    (round: WordStartsRound) => {
      // Level 1 plain word, level 2 first syllable emphasized, level 3 last syllable emphasized -
      // `_LetterTraining_PROMPTS.md` / "## Follow-up prompt 3 (verbatim)".
      playAudio(roundWordAudio(round), {
        key: `word:${round.level}:${round.word.id}`,
        owner,
        rate: PLAYBACK_RATE,
        startWatchdog: true,
        retryOnceOnStartFailure: true,
        safetyTimeoutMilliseconds: WORD_SOUND_SAFETY_TIMEOUT_MILLISECONDS,
      });
    },
    [owner]
  );

  // Auto-play the word on every round start ("a sound/speech with the word will be played").
  useEffect(() => {
    if (currentRound !== null && audioModeReady) {
      playWord(currentRound);
    }
  }, [currentRound, audioModeReady, playWord]);

  const goBackToSelection = useCallback(() => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/');
    }
  }, [router]);

  const restart = useCallback(() => {
    generation.current += 1;
    clearTimers();
    stopAudioIfOwnedBy(owner);
    setFeedback(null);
    setProgress(INITIAL_PROGRESS);
    setRoundPlan(buildRoundPlan(DATASET, level));
  }, [clearTimers, owner, level]);

  const handleOptionTap = (index: number) => {
    if (currentRound === null || feedback?.kind === 'correct') {
      return; // the correct answer is already being confirmed
    }
    clearTimers(); // a pending wrong-tint timer of an earlier tap
    generation.current += 1;
    const tapGeneration = generation.current;
    const isCurrent = () => tapGeneration === generation.current;
    const result = applyTap(progressRef.current, currentRound, index);
    setProgress(result.progress);
    progressRef.current = result.progress;
    const audio = optionAudio(currentRound, currentRound.options[index], DATASET);
    setFeedback({ kind: result.isCorrect ? 'correct' : 'wrong', index });

    if (result.isCorrect) {
      // Advance after max(500 ms, sound end) - see the DECISION in the header comment.
      let minimumElapsed = false;
      let soundEnded = audio === undefined;
      const tryAdvance = () => {
        if (!isCurrent() || !minimumElapsed || !soundEnded) {
          return;
        }
        generation.current += 1;
        clearTimers();
        setFeedback(null);
        const next = advanceRound(progressRef.current);
        progressRef.current = next;
        setProgress(next);
      };
      timers.current.push(
        setTimeout(() => {
          minimumElapsed = true;
          tryAdvance();
        }, FEEDBACK_DURATION_MILLISECONDS)
      );
      if (audio !== undefined) {
        const onEnd = () => {
          soundEnded = true;
          tryAdvance();
        };
        playAudio(audio, {
          key: `option:${currentRound.options[index]}`,
          owner,
          rate: PLAYBACK_RATE,
          onFinish: onEnd,
          onFailure: onEnd,
          startWatchdog: true,
          safetyTimeoutMilliseconds: OPTION_SOUND_SAFETY_TIMEOUT_MILLISECONDS,
        });
      }
      return;
    }

    // Wrong tap: red tint while the tapped option's sound plays (plain 500 ms tint without audio).
    const clearTint = () => {
      if (isCurrent()) {
        setFeedback(null);
      }
    };
    if (audio === undefined) {
      stopAudioIfOwnedBy(owner); // a still-running word sound must not overlap the feedback
      timers.current.push(setTimeout(clearTint, FEEDBACK_DURATION_MILLISECONDS));
    } else {
      playAudio(audio, {
        key: `option:${currentRound.options[index]}`,
        owner,
        rate: PLAYBACK_RATE,
        onFinish: clearTint,
        onFailure: () => timers.current.push(setTimeout(clearTint, FEEDBACK_DURATION_MILLISECONDS)),
        startWatchdog: true,
        safetyTimeoutMilliseconds: OPTION_SOUND_SAFETY_TIMEOUT_MILLISECONDS,
      });
    }
  };

  const window = useWindowDimensions();
  const isLandscape = window.width > window.height;

  if (roundPlan.length === 0) {
    return (
      <SafeAreaView style={styles.centered}>
        <Text style={styles.scoreLine}>Pro tuto úroveň zatím nejsou žádná slova.</Text>
        <Pressable style={styles.homeButton} onPress={goBackToSelection} accessibilityRole="button">
          <Text style={styles.homeButtonLabel}>Zpět na výběr</Text>
        </Pressable>
      </SafeAreaView>
    );
  }

  if (currentRound === null) {
    // Results page: "10 rounds, then results page will be shown with offer to play again or to go to the
    // disambigulation intro page".
    return (
      <SafeAreaView style={styles.centered}>
        <Text style={styles.scoreTitle}>Hotovo!</Text>
        <Text style={styles.scoreLine}>
          Správně: {progress.correctRounds}/{roundPlan.length}
        </Text>
        <Pressable style={styles.restartButton} onPress={restart} accessibilityRole="button">
          <Text style={styles.restartButtonLabel}>Hrát znovu</Text>
        </Pressable>
        <Pressable style={styles.homeButton} onPress={goBackToSelection} accessibilityRole="button">
          <Text style={styles.homeButtonLabel}>Zpět na výběr</Text>
        </Pressable>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={goBackToSelection} accessibilityRole="button" accessibilityLabel="Zpět na výběr" style={styles.backButton} hitSlop={8}>
          <Text style={styles.backButtonText}>‹ Zpět</Text>
        </Pressable>
        <Text style={styles.headerTitle} numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.6}>
          {LEVEL_TITLES[level]}
        </Text>
        <Text style={styles.roundCounter}>
          {progress.roundIndex + 1}/{roundPlan.length}
        </Text>
      </View>
      <View style={[styles.body, isLandscape && styles.bodyLandscape]}>
        <View style={styles.pictureRow}>
          <Image source={currentRound.word.image} style={styles.picture} resizeMode="contain" />
          {/* "next to the picture will be also a button for play or play again" */}
          <Pressable
            style={({ pressed }) => [styles.replayButton, pressed && styles.replayButtonPressed]}
            onPress={() => playWord(currentRound)}
            accessibilityRole="button"
            accessibilityLabel="Přehrát slovo znovu"
          >
            <Text style={styles.replayButtonIcon}>🔊</Text>
          </Pressable>
        </View>
        <View style={[styles.optionsRow, isLandscape && styles.optionsRowLandscape]}>
          {currentRound.options.map((option, index) => {
            const showGreen = feedback?.kind === 'correct' && feedback.index === index;
            const showRed = feedback?.kind === 'wrong' && feedback.index === index;
            return (
              <Pressable
                key={`${progress.roundIndex}-${index}`}
                style={({ pressed }) => [styles.option, pressed && styles.optionPressed]}
                onPress={() => handleOptionTap(index)}
                accessibilityRole="button"
                accessibilityLabel={optionLabel(option)}
              >
                <Text style={styles.optionText} numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.5}>
                  {optionLabel(option)}
                </Text>
                {showRed && <View style={[styles.optionOverlay, styles.redOverlay]} />}
                {showGreen && (
                  <View style={[styles.optionOverlay, styles.greenOverlay]}>
                    <Text style={styles.checkmark}>✓</Text>
                  </View>
                )}
              </Pressable>
            );
          })}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF6E5',
  },
  centered: {
    flex: 1,
    backgroundColor: '#FFF6E5',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  backButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
  },
  backButtonText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#6B5B7B',
  },
  headerTitle: {
    flex: 1,
    marginHorizontal: 10,
    fontSize: 20,
    fontWeight: '800',
    color: '#5B3E96',
    textAlign: 'center',
  },
  roundCounter: {
    fontSize: 18,
    fontWeight: '700',
    color: '#6B5B7B',
  },
  body: {
    flex: 1,
    padding: 12,
  },
  bodyLandscape: {
    flexDirection: 'row',
  },
  pictureRow: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  picture: {
    flex: 1,
    height: '100%',
    borderRadius: 20,
  },
  replayButton: {
    marginLeft: 12,
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#FFB84D',
    alignItems: 'center',
    justifyContent: 'center',
  },
  replayButtonPressed: {
    backgroundColor: '#F09A20',
  },
  replayButtonIcon: {
    fontSize: 30,
  },
  optionsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
    paddingTop: 16,
    paddingBottom: 8,
  },
  optionsRowLandscape: {
    flexDirection: 'column',
    paddingTop: 0,
    paddingLeft: 16,
    justifyContent: 'center',
  },
  option: {
    flex: 1,
    minHeight: 90,
    maxWidth: 180,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    borderWidth: 3,
    borderColor: '#FFB23F',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    paddingHorizontal: 6,
  },
  optionPressed: {
    backgroundColor: '#FFF0D0',
  },
  optionText: {
    fontSize: 44,
    fontWeight: '800',
    color: '#E0457B',
  },
  optionOverlay: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  redOverlay: {
    backgroundColor: 'rgba(220, 60, 60, 0.35)', // slight red tint on a wrong tap (as TreninkPorozumeni)
  },
  greenOverlay: {
    backgroundColor: 'rgba(70, 190, 90, 0.35)', // slight green tint on the correct tap (as TreninkPorozumeni)
  },
  checkmark: {
    fontSize: 60,
    color: '#1F8A3B',
    fontWeight: 'bold',
  },
  scoreTitle: {
    fontSize: 44,
    fontWeight: 'bold',
    color: '#4C4536',
    marginBottom: 24,
  },
  scoreLine: {
    fontSize: 32,
    color: '#4C4536',
    marginBottom: 8,
    textAlign: 'center',
  },
  restartButton: {
    marginTop: 32,
    backgroundColor: '#FFB84D',
    borderRadius: 32,
    paddingHorizontal: 48,
    paddingVertical: 20,
  },
  restartButtonLabel: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#4C3000',
  },
  homeButton: {
    marginTop: 16,
    backgroundColor: '#FFE9A8',
    borderRadius: 28,
    paddingHorizontal: 40,
    paddingVertical: 14,
  },
  homeButtonLabel: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#4C4536',
  },
});
