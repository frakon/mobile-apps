// TreninkPorozumeni — Czech listening-comprehension training game for children.
// Full specification: _TreninkPorozumeni_SPEC.md (in this folder).

import { StatusBar } from 'expo-status-bar';
import { createAudioPlayer, setAudioModeAsync } from 'expo-audio';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { buildRoundPlan, GameRound } from './src/rounds';

const FEEDBACK_DURATION_MILLISECONDS = 500;

type PictureSide = 'left' | 'right';

export default function App() {
  const [roundPlan, setRoundPlan] = useState<GameRound[]>(() => buildRoundPlan());
  const [roundIndex, setRoundIndex] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [wrongCount, setWrongCount] = useState(0);
  const [wrongTappedSide, setWrongTappedSide] = useState<PictureSide | null>(null);
  const [correctTapped, setCorrectTapped] = useState(false);
  const [audioModeReady, setAudioModeReady] = useState(false);
  const mistakeMadeThisRound = useRef(false);
  const roundAdvancePending = useRef(false); // synchronous guard against double/simultaneous taps
  const correctFeedbackTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const wrongFeedbackTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const playerRef = useRef<ReturnType<typeof createAudioPlayer> | null>(null);

  const finished = roundIndex >= roundPlan.length;
  const currentRound = finished ? null : roundPlan[roundIndex];

  useEffect(() => {
    setAudioModeAsync({ playsInSilentMode: true })
      .catch(() => {
        // Audio mode is a nicety (play even with the mute switch on); ignore failures.
      })
      .then(() => {
        setAudioModeReady(true); // gate the first auto-play so it happens under the applied mode
      });
  }, []);

  // Clear any pending feedback timers on unmount.
  useEffect(() => {
    return () => {
      if (correctFeedbackTimer.current !== null) {
        clearTimeout(correctFeedbackTimer.current);
      }
      if (wrongFeedbackTimer.current !== null) {
        clearTimeout(wrongFeedbackTimer.current);
      }
    };
  }, []);

  // Auto-play the sentence audio whenever a new round starts (once the audio mode is applied).
  useEffect(() => {
    if (!currentRound || !audioModeReady) {
      return;
    }
    const player = createAudioPlayer(currentRound.audio);
    playerRef.current = player;
    player.play();
    return () => {
      playerRef.current = null;
      player.remove();
    };
  }, [currentRound, audioModeReady]);

  const replayAudio = useCallback(async () => {
    const player = playerRef.current;
    if (!player) {
      return;
    }
    try {
      await player.seekTo(0); // must complete before play(), otherwise iOS may play at end-of-item (silence)
    } catch {
      return; // player was likely removed meanwhile
    }
    if (playerRef.current === player) {
      player.play();
    }
  }, []);

  const handlePictureTap = useCallback(
    (side: PictureSide) => {
      // roundAdvancePending is checked/set synchronously: React state (correctTapped) alone
      // cannot block two taps delivered before a re-render (double/two-finger taps by children).
      if (!currentRound || correctTapped || roundAdvancePending.current) {
        return;
      }
      if (side === currentRound.correctSide) {
        roundAdvancePending.current = true;
        setCorrectTapped(true);
        if (mistakeMadeThisRound.current) {
          setWrongCount((count) => count + 1);
        } else {
          setCorrectCount((count) => count + 1);
        }
        correctFeedbackTimer.current = setTimeout(() => {
          correctFeedbackTimer.current = null;
          setCorrectTapped(false);
          setWrongTappedSide(null);
          mistakeMadeThisRound.current = false;
          roundAdvancePending.current = false;
          setRoundIndex((index) => index + 1);
        }, FEEDBACK_DURATION_MILLISECONDS);
      } else {
        mistakeMadeThisRound.current = true; // scored wrong on first mistake; round keeps going
        setWrongTappedSide(side);
        if (wrongFeedbackTimer.current !== null) {
          clearTimeout(wrongFeedbackTimer.current); // re-arm so a repeated wrong tap gets the full tint duration
        }
        wrongFeedbackTimer.current = setTimeout(() => {
          wrongFeedbackTimer.current = null;
          setWrongTappedSide(null);
        }, FEEDBACK_DURATION_MILLISECONDS);
      }
    },
    [currentRound, correctTapped]
  );

  const restartGame = useCallback(() => {
    if (correctFeedbackTimer.current !== null) {
      clearTimeout(correctFeedbackTimer.current);
      correctFeedbackTimer.current = null;
    }
    if (wrongFeedbackTimer.current !== null) {
      clearTimeout(wrongFeedbackTimer.current);
      wrongFeedbackTimer.current = null;
    }
    roundAdvancePending.current = false;
    setRoundPlan(buildRoundPlan());
    setRoundIndex(0);
    setCorrectCount(0);
    setWrongCount(0);
    setWrongTappedSide(null);
    setCorrectTapped(false);
    mistakeMadeThisRound.current = false;
  }, []);

  const pictures = useMemo(() => {
    if (!currentRound) {
      return null;
    }
    const leftIsCorrect = currentRound.correctSide === 'left';
    return {
      left: leftIsCorrect ? currentRound.correctImage : currentRound.wrongImage,
      right: leftIsCorrect ? currentRound.wrongImage : currentRound.correctImage,
    };
  }, [currentRound]);

  if (finished || !currentRound || !pictures) {
    return (
      <SafeAreaProvider>
        <SafeAreaView style={styles.container}>
          <StatusBar style="dark" />
          <Text style={styles.scoreTitle}>Hotovo!</Text>
          <Text style={styles.scoreLine}>Správně: {correctCount}</Text>
          <Text style={styles.scoreLine}>Špatně: {wrongCount}</Text>
          <Pressable style={styles.restartButton} onPress={restartGame}>
            <Text style={styles.restartButtonLabel}>Hrát znovu</Text>
          </Pressable>
        </SafeAreaView>
      </SafeAreaProvider>
    );
  }

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <StatusBar style="dark" />
        <View style={styles.topBar}>
          <Text style={styles.progressLabel}>
            {roundIndex + 1} / {roundPlan.length}
          </Text>
          <Pressable style={styles.replayButton} onPress={replayAudio} accessibilityLabel="Přehrát znovu">
            <Text style={styles.replayIcon}>🔊</Text>
          </Pressable>
        </View>
        <View style={styles.picturesRow}>
          {(['left', 'right'] as const).map((side) => {
            const isCorrectSide = side === currentRound.correctSide;
            const showGreen = correctTapped && isCorrectSide;
            const showRed = wrongTappedSide === side;
            return (
              <Pressable key={side} style={styles.pictureSlot} onPress={() => handlePictureTap(side)}>
                <Image source={pictures[side]} style={styles.picture} resizeMode="contain" />
                {showRed && <View style={[styles.pictureOverlay, styles.redOverlay]} />}
                {showGreen && (
                  <View style={[styles.pictureOverlay, styles.greenOverlay]}>
                    <Text style={styles.checkmark}>✓</Text>
                  </View>
                )}
              </Pressable>
            );
          })}
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
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
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 24,
    marginBottom: 16,
  },
  progressLabel: {
    fontSize: 24,
    color: '#7A6F5D',
  },
  replayButton: {
    backgroundColor: '#FFE9A8',
    borderRadius: 40,
    width: 72,
    height: 72,
    alignItems: 'center',
    justifyContent: 'center',
  },
  replayIcon: {
    fontSize: 36,
  },
  picturesRow: {
    flexDirection: 'row',
    gap: 24,
    width: '100%',
    flex: 1,
    maxHeight: 560,
  },
  pictureSlot: {
    flex: 1,
    borderRadius: 24,
    overflow: 'hidden',
    backgroundColor: '#FFFFFF',
    borderWidth: 3,
    borderColor: '#E4D9C3',
  },
  picture: {
    width: '100%',
    height: '100%',
  },
  pictureOverlay: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  redOverlay: {
    backgroundColor: 'rgba(220, 60, 60, 0.35)', // slight red tint on a wrong tap
  },
  greenOverlay: {
    backgroundColor: 'rgba(70, 190, 90, 0.35)', // slight green tint on the correct tap
  },
  checkmark: {
    fontSize: 96,
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
});
