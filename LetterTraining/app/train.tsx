// "Abecedový vlak" (alphabet train) game screen - `_LetterTraining_PROMPTS.md` / "## Follow-up prompt 5 — new game
// "Abecedový vlak" (verbatim)", "## Q&A 6 — Abecedový vlak round 1", "## Q&A 7 — Abecedový vlak round 2".
// Pure logic: src/train/logic.ts, motion math: src/train/motion.ts, settings: src/train/settings.ts.
//
// Behaviour:
// - landscape; steam engine + attached wagons across the top, the train's end at ~60 % of the width ("## Q&A 6");
// - N waiting wagons (settings 4–8, default 6) shuffled in one row below, slightly floating (a few px, slowly, random);
// - drag start / tap on a waiting wagon speaks its letter name (CZ or EN voice) ("## Q&A 7");
// - release with any overlap of the large drop zone at the train's end: correct letter -> the wagon eases onto the
//   train's end, the train shifts one wagon left (90 % in 1 s, last 10 % over 10 s, retargeted smoothly), the next
//   letter appears at a random pool position (neighbours ease apart, the new wagon grows from a point);
//   wrong letter -> slides back (eased) + the train wiggles, NO sound ("## Q&A 7");
// - last letter placed -> the train leaves the screen in 1 s, then "Hotovo" with "Znovu" / "Zpět" ("## Q&A 6");
// - random engine per play, random wagon image per letter; all images + letter audio preloaded on open.
// Autonomous decisions (NOT user-specified; listed in README.md):
// - DECISION: drop zone = 1 wagon width left of the train's end to 1.5 widths right of it, 0.4 wagon height above the
//   train down to 0.6 wagon height below it (src/train/logic.ts dropZone), drawn as a dashed outline at the train's end.
// - DECISION: the train wiggles only for a wrong letter released IN the drop zone; a release elsewhere just slides back.
// - DECISION: the last wagon first eases onto the train (ATTACH_MILLISECONDS), then the 1 s exit starts (ease-in).
// - DECISION: durations of the non-specified motions: slide back 500 ms, neighbours making space 350 ms, grow-in
//   350 ms (after 120 ms), floating ±4 px with 2–4 s random periods, wiggle ~0.5 s.
// - DECISION: a settings change (⚙) restarts the play; letter case CAPITALS by default.

import { Asset } from 'expo-asset';
import { setAudioModeAsync } from 'expo-audio';
import * as ScreenOrientation from 'expo-screen-orientation';
import { useFocusEffect, useRouter } from 'expo-router';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { LayoutChangeEvent, Pressable, StyleSheet, Text, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  Easing,
  cancelAnimation,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

import { playAudio, stopAudioIfOwnedBy } from '../src/audioController';
import { OfflineRetry } from '../src/resources/OfflineRetry';
import { useArchivePreloading } from '../src/resources/useArchivePreloading';
import { ENGINE_IMAGES, EN_LETTER_AUDIO, WAGON_IMAGES } from '../src/train/assets';
import {
  Rectangle,
  TrainGameState,
  TrainLayout,
  alphabetLetters,
  assignWagonImages,
  computeTrainLayout as computePureTrainLayout,
  createTrainGame,
  dropZone,
  isDropHit,
  shouldDeferBoardSize,
  isGameFinished,
  letterLabel,
  placeLetter,
  poolSlotPositions,
  randomInt,
} from '../src/train/logic';
import { SHIFT_TOTAL_MILLISECONDS, ShiftMotion, retargetShift, sampleShift } from '../src/train/motion';
import { TrainSettings, loadTrainSettings } from '../src/train/settings';
import { Engine, PLACEHOLDER_WAGON_ASPECT, Wagon, engineGeometry, wagonGeometry } from '../src/train/Vehicles';
import { LETTER_AUDIO } from '../src/words';

const SLIDE_BACK_MILLISECONDS = 500;
const MAKE_SPACE_MILLISECONDS = 350;
const GROW_DELAY_MILLISECONDS = 120;
const GROW_MILLISECONDS = 350;
const ATTACH_MILLISECONDS = 350;
const EXIT_MILLISECONDS = 1000; // "the train goes off the screen in 1 last second"
const FLOAT_AMPLITUDE_PIXELS = 4; // "a few pixels"
const DRAG_SCALE = 1.08;
const COUPLING_GAP_PIXELS = 3;
const TAIL_FRACTION = 0.6; // "## Q&A 6": the train's end at ~60 % of the width
const LETTER_SOUND_SAFETY_TIMEOUT_MILLISECONDS = 5000;
// Verification round 1 H1: a release counts as a drop only after a real drag (a tap only speaks the letter).
const MINIMUM_DRAG_DISTANCE_PIXELS = 10;
// Verification round 1 H1: guaranteed vertical gap between the drop zone and the pool row.
const MINIMUM_POOL_GAP_PIXELS = 12;
const EASE_IN_OUT = Easing.inOut(Easing.cubic);
// Verification round 2 H1: portrait board sizes are ignored only while the landscape lock is pending (at most this long);
// after that (lock done / failed / not honoured, e.g. web, iPad multitasking) any size is laid out.
const ORIENTATION_LOCK_GRACE_MILLISECONDS = 500;
const DRAG_SCALE_MILLISECONDS = 130; // verification round 2 M1: eased pick-up / put-down scale

type Phase = 'playing' | 'leaving' | 'done';

// The whole-play backend archive set of this no-round game (everything preloaded before the play, decision 6).
const TRAIN_ARCHIVE_PATH = 'train/train.zip';
const TRAIN_ARCHIVES: readonly string[] = [TRAIN_ARCHIVE_PATH];

// Layout with the REAL wagon shapes (src/train/logic.ts computeTrainLayout guarantees the drop zone / pool gap).
function computeTrainLayout(width: number, height: number, waitingWagons: number, engineIndex: number): TrainLayout {
  return computePureTrainLayout(width, height, waitingWagons, engineGeometry(engineIndex), WAGON_IMAGES, {
    referenceWagonAspect: PLACEHOLDER_WAGON_ASPECT,
    couplingGap: COUPLING_GAP_PIXELS,
    dragScale: DRAG_SCALE,
    floatAmplitude: FLOAT_AMPLITUDE_PIXELS,
    minimumPoolGap: MINIMUM_POOL_GAP_PIXELS,
  });
}

// Train offset (x of the engine's left edge) that puts the train's end at TAIL_FRACTION of the width.
function targetOffset(layout: TrainLayout, placedCount: number): number {
  return layout.width * TAIL_FRACTION - layout.engineWidth - placedCount * layout.pitch;
}

function wagonTop(rail: number, wagonIndex: number, wagonWidth: number): number {
  const geometry = wagonGeometry(wagonIndex);
  return rail - geometry.baseline * (wagonWidth / geometry.aspect);
}

function letterAudio(settings: TrainSettings, letter: string): number | undefined {
  return settings.alphabet === 'en' ? EN_LETTER_AUDIO[letter] : LETTER_AUDIO[letter];
}

interface Play {
  // Unique per play (new play -> train reset).
  id: number;
  game: TrainGameState;
  engineIndex: number;
  wagonImages: Record<string, number>;
  // Letter inserted by the latest placement (grows in), null at the start.
  grownLetter: string | null;
  // Where the latest attached wagon was released (board coordinates) - it eases from there onto the train.
  // x is train-relative (relative to the train offset at release; verification round 2 L1), y is board-relative.
  attachedFrom: { letter: string; x: number; y: number; scale: number } | null;
}

let playCounter = 0;

function newPlay(settings: TrainSettings): Play {
  const letters = alphabetLetters(settings.alphabet);
  playCounter += 1;
  return {
    id: playCounter,
    game: createTrainGame(letters, settings.waitingWagons, Math.random),
    engineIndex: ENGINE_IMAGES.length > 0 ? randomInt(ENGINE_IMAGES.length, Math.random) : 0,
    wagonImages: assignWagonImages(letters, WAGON_IMAGES.length, Math.random),
    grownLetter: null,
    attachedFrom: null,
  };
}

function sameSettings(first: TrainSettings | null, second: TrainSettings): boolean {
  return first !== null && first.alphabet === second.alphabet && first.letterCase === second.letterCase && first.waitingWagons === second.waitingWagons;
}

export default function TrainScreen() {
  const router = useRouter();
  const [settings, setSettings] = useState<TrainSettings | null>(null);
  const [play, setPlay] = useState<Play | null>(null);
  const [phase, setPhase] = useState<Phase>('playing');
  const [boardSize, setBoardSize] = useState({ width: 0, height: 0 });
  // Verification round 2 H1: the last measured board size + whether the landscape lock has settled.
  const measuredSize = useRef({ width: 0, height: 0 });
  const [lockSettled, setLockSettled] = useState(false);
  const owner = useRef({}).current;
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const playRef = useRef(play);
  playRef.current = play;

  // Train motion state (shared values: read by the animated style on the UI thread).
  const motionFrom = useSharedValue(0);
  const motionTo = useSharedValue(0);
  const motionVelocity = useSharedValue(0);
  const motionAcceleration = useSharedValue(0);
  const motionElapsed = useSharedValue(SHIFT_TOTAL_MILLISECONDS);
  const exitOffset = useSharedValue(0);
  const wiggle = useSharedValue(0);

  const clearTimers = useCallback(() => {
    for (const timer of timers.current) {
      clearTimeout(timer);
    }
    timers.current = [];
  }, []);

  // "## Q&A 6": landscape lock while this screen is mounted.
  useEffect(() => {
    let mounted = true;
    const settle = () => {
      if (mounted) {
        setLockSettled(true);
      }
    };
    const graceTimer = setTimeout(settle, ORIENTATION_LOCK_GRACE_MILLISECONDS);
    ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE).then(settle, settle);
    setAudioModeAsync({ playsInSilentMode: true }).catch(() => undefined);
    return () => {
      mounted = false;
      clearTimeout(graceTimer);
      clearTimers();
      stopAudioIfOwnedBy(owner);
      ScreenOrientation.unlockAsync().catch(() => undefined);
    };
  }, [clearTimers, owner]);

  // Preload EVERYTHING the play can use before it starts (no rounds -> whole-play preload, preferences skill /
  // `_LetterTraining_PROMPTS.md` / "## Follow-up prompt 9 — mobile-apps-preferences", user decision 6):
  // - train pictures come from the backend archive `train/train.zip` (user decision 2) and must be hot before the
  //   board shows (the screen is gated on 'ready' below);
  // - letter audio stays BUNDLED (decision 2) and is only warmed via expo-asset here.
  const { status: resourceStatus, archives, retry: retryResources } = useArchivePreloading(TRAIN_ARCHIVES);
  const trainArchive = archives[TRAIN_ARCHIVE_PATH];
  // Data URI of a train/train.zip entry; undefined -> the drawn placeholder vehicle.
  const trainFileUri = useCallback(
    (file: string | undefined) => (file === undefined ? undefined : trainArchive?.files[file]?.dataUri),
    [trainArchive]
  );
  useEffect(() => {
    const modules: number[] = [
      ...Object.values(EN_LETTER_AUDIO),
      ...alphabetLetters('cz').map((letter) => LETTER_AUDIO[letter]).filter((module): module is number => module !== undefined),
    ];
    for (const moduleId of modules) {
      try {
        Asset.fromModule(moduleId)
          .downloadAsync()
          .catch(() => undefined); // silent: lazy load later
      } catch {
        // Unknown module id: equally silent.
      }
    }
  }, []);

  // Settings re-read on focus (back from ⚙); a change restarts the play (DECISION).
  const settingsRef = useRef(settings);
  settingsRef.current = settings;
  useFocusEffect(
    useCallback(() => {
      let cancelled = false;
      loadTrainSettings().then((stored) => {
        if (!cancelled && !sameSettings(settingsRef.current, stored)) {
          setSettings(stored);
        }
      });
      return () => {
        cancelled = true;
        stopAudioIfOwnedBy(owner);
      };
    }, [owner])
  );

  const layout = useMemo(
    () =>
      settings !== null && play !== null && boardSize.width > 0
        ? computeTrainLayout(boardSize.width, boardSize.height, settings.waitingWagons, play.engineIndex)
        : null,
    [settings, play, boardSize]
  );
  const layoutRef = useRef(layout);
  layoutRef.current = layout;

  const placedCount = play?.game.placedCount ?? 0;

  const resetMotion = useCallback(
    (offset: number) => {
      cancelAnimation(motionElapsed);
      cancelAnimation(exitOffset);
      motionFrom.value = offset;
      motionTo.value = offset;
      motionVelocity.value = 0;
      motionAcceleration.value = 0;
      motionElapsed.value = SHIFT_TOTAL_MILLISECONDS;
      exitOffset.value = 0;
      wiggle.value = 0;
    },
    [motionElapsed, exitOffset, motionFrom, motionTo, motionVelocity, motionAcceleration, wiggle]
  );

  const startPlay = useCallback(
    (current: TrainSettings) => {
      clearTimers();
      stopAudioIfOwnedBy(owner);
      setPlay(newPlay(current));
      setPhase('playing');
    },
    [clearTimers, owner]
  );

  useEffect(() => {
    if (settings !== null) {
      startPlay(settings);
    }
  }, [settings, startPlay]);

  // New play or new board size (rotation / resize): put the train at its target without animation.
  useEffect(() => {
    const currentPlay = playRef.current;
    if (layout !== null && currentPlay !== null && phase === 'playing') {
      resetMotion(targetOffset(layout, currentPlay.game.placedCount));
    }
    // Deliberately only on a new play / layout change, not on every placement (those animate via shiftTrainTo).
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [layout?.width, layout?.height, layout?.engineWidth, layout?.pitch, play?.id]);

  // "the train moves by distance of 1 wagon to the left" - retargeted from the current position and velocity.
  const shiftTrainTo = useCallback(
    (target: number) => {
      const current: ShiftMotion = {
        from: motionFrom.value,
        to: motionTo.value,
        startVelocity: motionVelocity.value,
        startAcceleration: motionAcceleration.value,
      };
      cancelAnimation(motionElapsed);
      const next = retargetShift(current, motionElapsed.value, target);
      motionFrom.value = next.from;
      motionTo.value = next.to;
      motionVelocity.value = next.startVelocity;
      motionAcceleration.value = next.startAcceleration;
      motionElapsed.value = 0;
      motionElapsed.value = withTiming(SHIFT_TOTAL_MILLISECONDS, { duration: SHIFT_TOTAL_MILLISECONDS, easing: Easing.linear });
    },
    [motionFrom, motionTo, motionVelocity, motionAcceleration, motionElapsed]
  );

  // Displayed train offset incl. the wiggle (an attach during a wiggle starts exactly where the train is drawn).
  const currentTrainOffset = useCallback(
    () =>
      sampleShift(
        { from: motionFrom.value, to: motionTo.value, startVelocity: motionVelocity.value, startAcceleration: motionAcceleration.value },
        motionElapsed.value
      ).position +
      exitOffset.value +
      wiggle.value,
    [motionFrom, motionTo, motionVelocity, motionAcceleration, motionElapsed, exitOffset, wiggle]
  );

  const speakLetter = useCallback(
    (letter: string) => {
      const current = settingsRef.current;
      if (current === null) {
        return;
      }
      const audio = letterAudio(current, letter);
      if (audio === undefined) {
        return;
      }
      playAudio(audio, { key: `train-letter:${current.alphabet}:${letter}`, owner, rate: 1, safetyTimeoutMilliseconds: LETTER_SOUND_SAFETY_TIMEOUT_MILLISECONDS });
    },
    [owner]
  );

  const startExit = useCallback(() => {
    const current = layoutRef.current;
    const currentPlay = playRef.current;
    if (current === null || currentPlay === null) {
      return;
    }
    // Move the whole train (its end) past the left edge.
    const tailX = currentTrainOffset() + current.engineWidth + currentPlay.game.placedCount * current.pitch;
    exitOffset.value = withTiming(exitOffset.value - tailX - current.gap, { duration: EXIT_MILLISECONDS, easing: Easing.in(Easing.cubic) });
    timers.current.push(setTimeout(() => setPhase('done'), EXIT_MILLISECONDS));
  }, [currentTrainOffset, exitOffset]);

  // Release of a waiting wagon: true = attached to the train, false = slides back.
  const handleRelease = useCallback(
    (letter: string, rectangle: Rectangle, releaseScale: number): boolean => {
      const current = layoutRef.current;
      const currentPlay = playRef.current;
      if (current === null || currentPlay === null || phase !== 'playing') {
        return false;
      }
      const offset = currentTrainOffset();
      const tailX = offset + current.engineWidth + currentPlay.game.placedCount * current.pitch;
      const zone = dropZone(tailX, current.trainTop, current.engineHeight, current.wagonWidth, current.wagonHeight);
      if (!isDropHit(rectangle, zone)) {
        return false;
      }
      const result = placeLetter(currentPlay.game, letter, Math.random);
      if (result === null) {
        // Wrong letter: the train shakes slightly, NO sound ("## Q&A 7").
        wiggle.value = withSequence(
          withTiming(-6, { duration: 90, easing: Easing.inOut(Easing.sin) }),
          withTiming(6, { duration: 150, easing: Easing.inOut(Easing.sin) }),
          withTiming(-4, { duration: 130, easing: Easing.inOut(Easing.sin) }),
          withTiming(0, { duration: 110, easing: Easing.inOut(Easing.sin) })
        );
        return false;
      }
      const nextPlay: Play = {
        ...currentPlay,
        game: result.state,
        grownLetter: result.insertedLetter,
        // Unscaled top-left of the released wagon (its real size = rectangle / releaseScale); it starts at releaseScale.
        attachedFrom: {
          letter,
          x: rectangle.x + (rectangle.width - rectangle.width / releaseScale) / 2 - offset,
          y: rectangle.y + (rectangle.height - rectangle.height / releaseScale) / 2,
          scale: releaseScale,
        },
      };
      playRef.current = nextPlay;
      setPlay(nextPlay);
      if (isGameFinished(result.state)) {
        setPhase('leaving');
        timers.current.push(setTimeout(startExit, ATTACH_MILLISECONDS));
      } else {
        shiftTrainTo(targetOffset(current, result.state.placedCount));
      }
      return true;
    },
    [phase, currentTrainOffset, wiggle, shiftTrainTo, startExit]
  );

  const trainStyle = useAnimatedStyle(() => {
    const sample = sampleShift(
      { from: motionFrom.value, to: motionTo.value, startVelocity: motionVelocity.value, startAcceleration: motionAcceleration.value },
      motionElapsed.value
    );
    return { transform: [{ translateX: sample.position + exitOffset.value + wiggle.value }] };
  });

  const goBack = useCallback(() => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/');
    }
  }, [router]);

  const restart = useCallback(() => {
    if (settings !== null) {
      startPlay(settings);
    }
  }, [settings, startPlay]);

  const applyBoardSize = useCallback((width: number, height: number) => {
    setBoardSize((previous) => (previous.width === width && previous.height === height ? previous : { width, height }));
  }, []);

  const onBoardLayout = (event: LayoutChangeEvent) => {
    const { width, height } = event.nativeEvent.layout;
    measuredSize.current = { width, height };
    // While the (async) landscape lock is pending, a portrait measure is skipped (the pool would slide/resize at start).
    if (shouldDeferBoardSize(width, height, lockSettled)) {
      return;
    }
    applyBoardSize(width, height);
  };

  // Lock settled (or grace over): lay out whatever was measured last, portrait included (verification round 2 H1).
  useEffect(() => {
    if (lockSettled && measuredSize.current.width > 0) {
      applyBoardSize(measuredSize.current.width, measuredSize.current.height);
    }
  }, [lockSettled, applyBoardSize]);

  if (phase === 'done') {
    return (
      <SafeAreaView style={styles.centered}>
        <Text style={styles.doneTitle}>Hotovo!</Text>
        <View style={styles.doneButtons}>
          <Pressable style={styles.restartButton} onPress={restart} accessibilityRole="button">
            <Text style={styles.restartButtonLabel}>Znovu</Text>
          </Pressable>
          <Pressable style={styles.homeButton} onPress={goBack} accessibilityRole="button">
            <Text style={styles.homeButtonLabel}>Zpět</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  if (resourceStatus === 'offline') {
    // Backend unreachable AND train.zip not cached (decision 7: child-friendly Czech error + retry).
    return (
      <SafeAreaView style={styles.centered}>
        <OfflineRetry onRetry={retryResources} />
        <Pressable style={styles.homeButton} onPress={goBack} accessibilityRole="button">
          <Text style={styles.homeButtonLabel}>Zpět</Text>
        </Pressable>
      </SafeAreaView>
    );
  }

  if (resourceStatus !== 'ready') {
    // Whole-play resources are ready before the play shows (preferences skill); the themed start animation is a
    // separate later step (plan Phase D).
    return (
      <SafeAreaView style={styles.centered}>
        <Text style={styles.loadingText}>Načítám vláčky…</Text>
      </SafeAreaView>
    );
  }

  const poolSlots =
    layout !== null && play !== null ? poolSlotPositions(layout.width, play.game.pool.length, layout.wagonWidth, layout.gap) : [];
  const attachedLetters = play !== null ? play.game.letters.slice(0, placedCount) : [];

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom', 'left', 'right']}>
      <View style={styles.header}>
        <Pressable onPress={goBack} accessibilityRole="button" accessibilityLabel="Zpět na výběr" style={styles.backButton} hitSlop={8}>
          <Text style={styles.backButtonText}>‹ Zpět</Text>
        </Pressable>
        <Text style={styles.headerTitle} numberOfLines={1}>
          Abecedový vlak
        </Text>
        <Pressable
          onPress={() => router.push('/train-settings')}
          accessibilityRole="button"
          accessibilityLabel="Nastavení"
          style={styles.settingsButton}
          hitSlop={8}
        >
          <Text style={styles.settingsButtonText}>⚙</Text>
        </Pressable>
      </View>
      <View style={styles.board} onLayout={onBoardLayout}>
        {layout !== null && play !== null && settings !== null && (
          <>
            <View pointerEvents="none" style={[styles.rail, { top: layout.trainRail }]} />
            <Animated.View pointerEvents="none" style={[styles.train, trainStyle]}>
              <View style={{ position: 'absolute', left: 0, top: layout.trainRail - engineGeometry(play.engineIndex).baseline * layout.engineHeight }}>
                <Engine engineIndex={play.engineIndex} width={layout.engineWidth} imageUri={trainFileUri(ENGINE_IMAGES[play.engineIndex]?.file)} />
              </View>
              {attachedLetters.map((letter, index) => (
                <AttachedWagon
                  key={letter}
                  letter={letter}
                  label={letterLabel(letter, settings.letterCase)}
                  wagonIndex={play.wagonImages[letter] ?? 0}
                  colorSeed={index}
                  layout={layout}
                  slotX={layout.engineWidth + COUPLING_GAP_PIXELS + index * layout.pitch}
                  attachedFrom={play.attachedFrom?.letter === letter ? play.attachedFrom : null}
                  imageUri={trainFileUri(WAGON_IMAGES[play.wagonImages[letter] ?? 0]?.file)}
                />
              ))}
              {phase === 'playing' && (
                // Drop target hint at the train's end ("## Q&A 6": big drop zone).
                <View
                  style={[
                    styles.dropHint,
                    {
                      left: layout.engineWidth + COUPLING_GAP_PIXELS + placedCount * layout.pitch,
                      top: layout.trainRail - layout.wagonHeight, // tallest real wagon
                      width: layout.wagonWidth,
                      height: layout.wagonHeight,
                    },
                  ]}
                />
              )}
            </Animated.View>
            {play.game.pool.map((letter, index) => (
              <PoolWagon
                key={letter}
                letter={letter}
                label={letterLabel(letter, settings.letterCase)}
                wagonIndex={play.wagonImages[letter] ?? 0}
                colorSeed={play.game.letters.indexOf(letter)}
                x={poolSlots[index] ?? 0}
                y={wagonTop(layout.poolRail, play.wagonImages[letter] ?? 0, layout.wagonWidth)}
                width={layout.wagonWidth}
                grow={play.grownLetter === letter}
                enabled={phase === 'playing'}
                onDragStart={speakLetter}
                onRelease={handleRelease}
                imageUri={trainFileUri(WAGON_IMAGES[play.wagonImages[letter] ?? 0]?.file)}
              />
            ))}
          </>
        )}
      </View>
    </SafeAreaView>
  );
}

interface AttachedWagonProps {
  letter: string;
  label: string;
  wagonIndex: number;
  colorSeed: number;
  layout: TrainLayout;
  slotX: number;
  // x relative to the train offset (train-relative), y board-relative.
  attachedFrom: { x: number; y: number; scale: number } | null;
  // Hot in-memory wagon picture from train/train.zip ("## Follow-up prompt 9"); undefined -> drawn placeholder.
  imageUri?: string;
}

// Wagon on the train; a just-attached one eases from its release point onto the train's end.
function AttachedWagon({ label, wagonIndex, colorSeed, layout, slotX, attachedFrom, imageUri }: AttachedWagonProps) {
  const top = wagonTop(layout.trainRail, wagonIndex, layout.wagonWidth);
  // Initial offset/scale = the release point, already in the first rendered frame (no flash at the final slot).
  const [initial] = useState(() =>
    attachedFrom !== null
      ? { x: attachedFrom.x - slotX, y: attachedFrom.y - top, scale: attachedFrom.scale }
      : { x: 0, y: 0, scale: 1 }
  );
  const offsetX = useSharedValue(initial.x);
  const offsetY = useSharedValue(initial.y);
  const scale = useSharedValue(initial.scale);
  useEffect(() => {
    if (attachedFrom !== null) {
      offsetX.value = withTiming(0, { duration: ATTACH_MILLISECONDS, easing: EASE_IN_OUT });
      offsetY.value = withTiming(0, { duration: ATTACH_MILLISECONDS, easing: EASE_IN_OUT });
      // Release scale (dragged, up to 1.08) -> 1, eased.
      scale.value = withTiming(1, { duration: ATTACH_MILLISECONDS, easing: EASE_IN_OUT });
    }
    // Only on mount (attach moment).
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const style = useAnimatedStyle(() => ({ transform: [{ translateX: offsetX.value }, { translateY: offsetY.value }, { scale: scale.value }] }));
  return (
    <Animated.View style={[{ position: 'absolute', left: slotX, top }, style]}>
      <Wagon wagonIndex={wagonIndex} width={layout.wagonWidth} label={label} colorSeed={colorSeed} imageUri={imageUri} />
    </Animated.View>
  );
}

interface PoolWagonProps {
  letter: string;
  label: string;
  wagonIndex: number;
  colorSeed: number;
  x: number;
  y: number;
  width: number;
  grow: boolean;
  enabled: boolean;
  onDragStart: (letter: string) => void;
  // scale = the live drawn drag scale at release (verification round 3 L1).
  onRelease: (letter: string, rectangle: Rectangle, scale: number) => boolean;
  // Hot in-memory wagon picture from train/train.zip ("## Follow-up prompt 9"); undefined -> drawn placeholder.
  imageUri?: string;
}

function randomFloatTarget(): number {
  return (Math.random() * 2 - 1) * FLOAT_AMPLITUDE_PIXELS;
}

function PoolWagon({ letter, label, wagonIndex, colorSeed, x, y, width, grow, enabled, onDragStart, onRelease, imageUri }: PoolWagonProps) {
  const height = width / wagonGeometry(wagonIndex).aspect;
  const baseX = useSharedValue(x);
  const baseY = useSharedValue(y);
  const dragX = useSharedValue(0);
  const dragY = useSharedValue(0);
  const floatX = useSharedValue(0);
  const floatY = useSharedValue(0);
  const scale = useSharedValue(grow ? 0 : 1);
  const dragging = useSharedValue(0);
  // Verification round 2 M1: drag scale eased 1 <-> DRAG_SCALE (pick-up and slide-back), never snapped.
  const dragScale = useSharedValue(1);
  // Float frozen while dragged (the wagon stays under the finger).
  const frozenFloatX = useSharedValue(0);
  const frozenFloatY = useSharedValue(0);
  const gestureState = useRef({ grabX: 0, grabY: 0, maximumDistance: 0, attached: false });

  // Grow from a point at its new place, after the neighbours started making space.
  useEffect(() => {
    if (grow) {
      scale.value = withDelay(GROW_DELAY_MILLISECONDS, withTiming(1, { duration: GROW_MILLISECONDS, easing: EASE_IN_OUT }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Neighbours "make space" / close the gap: ease to the new slot.
  useEffect(() => {
    baseX.value = withTiming(x, { duration: MAKE_SPACE_MILLISECONDS, easing: EASE_IN_OUT });
    baseY.value = withTiming(y, { duration: MAKE_SPACE_MILLISECONDS, easing: EASE_IN_OUT });
  }, [x, y, baseX, baseY]);

  // "slightly floating: slowly moving left and right and up and down a few pixels randomly".
  useEffect(() => {
    const handles: ReturnType<typeof setTimeout>[] = [];
    let active = true;
    const loop = (axis: typeof floatX) => {
      if (!active) {
        return;
      }
      const duration = 2000 + Math.random() * 2000;
      axis.value = withTiming(randomFloatTarget(), { duration, easing: Easing.inOut(Easing.sin) });
      handles.push(setTimeout(() => loop(axis), duration));
    };
    loop(floatX);
    loop(floatY);
    return () => {
      active = false;
      handles.forEach(clearTimeout);
      cancelAnimation(floatX);
      cancelAnimation(floatY);
    };
  }, [floatX, floatY]);

  const callbacks = useRef({ onDragStart, onRelease, width, height });
  callbacks.current = { onDragStart, onRelease, width, height };

  const pan = useMemo(() => {
    const state = gestureState.current;
    // Back to the live float + eased slide back to the slot, without a jump (frozen -> live float compensated).
    const slideBack = () => {
      dragX.value = dragX.value + frozenFloatX.value - floatX.value;
      dragY.value = dragY.value + frozenFloatY.value - floatY.value;
      dragging.value = 0;
      dragScale.value = withTiming(1, { duration: DRAG_SCALE_MILLISECONDS, easing: EASE_IN_OUT });
      // "returns to its original position" - eased slide back.
      dragX.value = withTiming(0, { duration: SLIDE_BACK_MILLISECONDS, easing: EASE_IN_OUT });
      dragY.value = withTiming(0, { duration: SLIDE_BACK_MILLISECONDS, easing: EASE_IN_OUT });
    };
    return Gesture.Pan()
      .runOnJS(true)
      .enabled(enabled)
      .minDistance(0)
      .maxPointers(1)
      .onBegin(() => {
        // Letter name at touch-down: covers both a tap and a drag start, exactly once ("## Q&A 7").
        callbacks.current.onDragStart(letter);
      })
      .onStart(() => {
        // Grabbing during a slide-back continues from where the wagon is (no jump).
        cancelAnimation(dragX);
        cancelAnimation(dragY);
        state.grabX = dragX.value;
        state.grabY = dragY.value;
        state.maximumDistance = 0;
        state.attached = false;
        frozenFloatX.value = floatX.value;
        frozenFloatY.value = floatY.value;
        dragging.value = 1;
        dragScale.value = withTiming(DRAG_SCALE, { duration: DRAG_SCALE_MILLISECONDS, easing: EASE_IN_OUT });
      })
      .onUpdate((event) => {
        dragX.value = state.grabX + event.translationX;
        dragY.value = state.grabY + event.translationY;
        state.maximumDistance = Math.max(state.maximumDistance, Math.hypot(event.translationX, event.translationY));
      })
      .onEnd((_event, success) => {
        const current = callbacks.current;
        // Cancelled by the system, or a tap / tiny move: never a drop (verification round 1 H1, L1).
        if (!success || state.maximumDistance < MINIMUM_DRAG_DISTANCE_PIXELS) {
          slideBack();
          return;
        }
        // Live drawn scale (a quick flick may release before the scale-up finished; verification round 3 L1).
        const releaseScale = dragScale.value;
        const scaledWidth = current.width * releaseScale;
        const scaledHeight = current.height * releaseScale;
        const rectangle: Rectangle = {
          x: baseX.value + dragX.value + frozenFloatX.value - (scaledWidth - current.width) / 2,
          y: baseY.value + dragY.value + frozenFloatY.value - (scaledHeight - current.height) / 2,
          width: scaledWidth,
          height: scaledHeight,
        };
        if (current.onRelease(letter, rectangle, releaseScale)) {
          // Attached: this pool wagon is replaced by the AttachedWagon starting at the same place and scale.
          state.attached = true;
        } else {
          slideBack();
        }
      })
      .onFinalize(() => {
        // Safety: a gesture that ended without onEnd (e.g. cancelled before activation) never leaves a frozen wagon.
        if (dragging.value === 1 && !state.attached) {
          slideBack();
        }
      });
  }, [enabled, letter, baseX, baseY, dragX, dragY, floatX, floatY, frozenFloatX, frozenFloatY, dragging, dragScale]);

  const style = useAnimatedStyle(() => {
    const isDragging = dragging.value === 1;
    const currentFloatX = isDragging ? frozenFloatX.value : floatX.value;
    const currentFloatY = isDragging ? frozenFloatY.value : floatY.value;
    return {
      transform: [
        { translateX: baseX.value + dragX.value + currentFloatX },
        { translateY: baseY.value + dragY.value + currentFloatY },
        { scale: scale.value * dragScale.value },
      ],
      zIndex: isDragging ? 20 : 2,
    };
  });

  return (
    <GestureDetector gesture={pan}>
      <Animated.View style={[styles.poolWagon, style]} accessibilityLabel={label}>
        <Wagon wagonIndex={wagonIndex} width={width} label={label} colorSeed={colorSeed} imageUri={imageUri} />
      </Animated.View>
    </GestureDetector>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#EAF6FF' },
  centered: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#FFF6E5', padding: 20 },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 4 },
  backButton: { paddingHorizontal: 12, paddingVertical: 5, borderRadius: 12, backgroundColor: '#FFFFFF' },
  backButtonText: { fontSize: 17, fontWeight: '700', color: '#6B5B7B' },
  headerTitle: { flex: 1, marginHorizontal: 10, fontSize: 20, fontWeight: '800', color: '#5B3E96', textAlign: 'center' },
  settingsButton: { paddingHorizontal: 12, paddingVertical: 4, borderRadius: 12, backgroundColor: '#FFFFFF' },
  settingsButtonText: { fontSize: 22, color: '#6B5B7B' },
  board: { flex: 1, overflow: 'hidden' },
  rail: { position: 'absolute', left: 0, right: 0, height: 5, backgroundColor: '#8B6B4A', borderRadius: 2 },
  train: { position: 'absolute', left: 0, top: 0, right: 0, bottom: 0 },
  dropHint: { position: 'absolute', borderWidth: 3, borderStyle: 'dashed', borderColor: '#B9A7DA', borderRadius: 12 },
  poolWagon: { position: 'absolute', left: 0, top: 0 },
  loadingText: { fontSize: 28, fontWeight: '700', color: '#5B3E96' },
  doneTitle: { fontSize: 44, fontWeight: '900', color: '#5B3E96', marginBottom: 24 },
  doneButtons: { flexDirection: 'row', gap: 16 },
  restartButton: { backgroundColor: '#FFB23F', paddingHorizontal: 32, paddingVertical: 14, borderRadius: 20 },
  restartButtonLabel: { fontSize: 24, fontWeight: '800', color: '#FFFFFF' },
  homeButton: { backgroundColor: '#FFFFFF', paddingHorizontal: 32, paddingVertical: 14, borderRadius: 20, borderWidth: 3, borderColor: '#E8D9BC' },
  homeButtonLabel: { fontSize: 24, fontWeight: '800', color: '#6B5B7B' },
});
