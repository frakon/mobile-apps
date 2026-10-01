// "Abecedový vlak" (alphabet train) game screen - `_LetterTraining_PROMPTS.md` / "## Follow-up prompt 5 — new game
// "Abecedový vlak" (verbatim)", "## Q&A 6 — Abecedový vlak round 1", "## Q&A 7 — Abecedový vlak round 2".
// Pure logic: src/train/logic.ts, motion math: src/train/motion.ts, settings: src/train/settings.ts.
//
// Behaviour:
// - landscape; steam engine + attached wagons across the top, the train's end at ~60 % of the width ("## Q&A 6");
// - N waiting wagons (settings 4–8, default 6) shuffled in one row below, slightly floating (a few px, slowly, random);
// - drag start / tap on a waiting wagon speaks its letter name (CZ or EN voice) ("## Q&A 7");
// - "## Follow-up prompt 10": the correct wagon connects on a mere touch / tap / release ANYWHERE (0.5 s slide behind
//   the last wagon); the train then shifts one wagon left (the 1 s part travels 90 % of the WAGON WIDTH, the rest of
//   the pitch over 10 s, retargeted smoothly); the next letter appears at a random pool position (neighbours ease
//   apart, the new wagon grows from a point);
// - wrong letter (tap or release anywhere) -> slides back (eased), red shade on it fading in 2 s + permanent green
//   shade on the correct wagon until it connects; the train wiggles only when released in the drop zone; NO sound;
// - floating moves go in 1 px gliding steps, ONE axis at a time per wagon, >= 0.5 s pause between steps;
// - last letter connected -> NO shift; after the 0.5 s attach slide the train leaves the screen in 1 s (accelerates,
//   then constant speed, no slow-down), then "Hotovo" (+150 ms) with "Znovu" / "Zpět" ("## Q&A 6");
// - all animations opt out of the system Reduce Motion (NEVER_REDUCED; see the hypothesis note there).
// - random engine per play, random wagon image per letter; all images + letter audio preloaded on open.
// Autonomous decisions (NOT user-specified; listed in README.md):
// - DECISION: drop zone = 1 wagon width left of the train's end to 1.5 widths right of it, 0.4 wagon height above the
//   train down to 0.6 wagon height below it (src/train/logic.ts dropZone), drawn as a dashed outline at the train's end.
// - DECISION: the train wiggles only for a wrong letter released IN the drop zone; a release elsewhere just slides back.
// - DECISION: the last wagon first eases onto the train (ATTACH_MILLISECONDS), then the 1 s exit starts (constant
//   acceleration for the first 30 % of the time, then constant speed); "Hotovo" 150 ms after the exit ended.
// - DECISION: durations of the non-specified motions: slide back 500 ms, neighbours making space 350 ms, grow-in
//   350 ms (after 120 ms), floating ±4 px in 1 px steps (350 ms glide + 0.5–1.2 s pause, random axis order), wiggle
//   ~0.5 s, green shade fade in/out 250 ms; shades = soft halo (iOS coloured glow, Android tint only).
// - DECISION: a settings change (⚙) restarts the play; letter case CAPITALS by default.

import { setAudioModeAsync } from 'expo-audio';
import * as ScreenOrientation from 'expo-screen-orientation';
import { useFocusEffect, useRouter } from 'expo-router';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { LayoutChangeEvent, Pressable, StyleSheet, Text, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  Easing,
  ReduceMotion,
  cancelAnimation,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withDelay,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

import { playAudio, stopAudioIfOwnedBy } from '../src/audioController';
import { OfflineRetry } from '../src/resources/OfflineRetry';
import { useArchivePreloading } from '../src/resources/useArchivePreloading';
import { StartAnimation } from '../src/startAnimation/StartAnimation';
import { warmBundledAudioModules } from '../src/resources/warmBundledAudio';
import { ENGINE_IMAGES, EN_LETTER_AUDIO, WAGON_IMAGES } from '../src/train/assets';
import {
  NO_SHADES,
  RED_SHADE_FADE_MILLISECONDS,
  Rectangle,
  ShadeState,
  TrainGameState,
  TrainLayout,
  alphabetLetters,
  assignWagonImages,
  computeTrainLayout as computePureTrainLayout,
  configureWagonPan,
  createTrainGame,
  dropZone,
  isDropHit,
  shouldDeferBoardSize,
  isGameFinished,
  letterLabel,
  placeLetter,
  poolSlotPositions,
  randomInt,
  releaseReaction,
  selectionOutcome,
  shadesAfterConnect,
  shadesAfterWrongSelection,
} from '../src/train/logic';
import {
  ATTACH_MILLISECONDS,
  EXIT_MILLISECONDS,
  FLOAT_REST,
  FLOAT_STEP_GLIDE_MILLISECONDS,
  SHIFT_TOTAL_MILLISECONDS,
  ShiftMotion,
  exitEasing,
  finishTimeline,
  floatStepInterval,
  floatStepPause,
  nextFloatStep,
  retargetShift,
  sampleShift,
  shiftSlowDistance,
} from '../src/train/motion';
import { TrainSettings, loadTrainSettings } from '../src/train/settings';
import { Engine, PLACEHOLDER_WAGON_ASPECT, Wagon, engineGeometry, wagonGeometry } from '../src/train/Vehicles';
import { LETTER_AUDIO } from '../src/words';

const SLIDE_BACK_MILLISECONDS = 500;
const MAKE_SPACE_MILLISECONDS = 350;
const GROW_DELAY_MILLISECONDS = 120;
const GROW_MILLISECONDS = 350;
// ATTACH_MILLISECONDS / EXIT_MILLISECONDS / finishTimeline: src/train/motion.ts ("## Follow-up prompt 10": 0.5 s attach
// slide; the exit leaves at regular speed - exitEasing - and "Hotovo" comes only after the train is fully gone).
const FLOAT_AMPLITUDE_PIXELS = 4; // "a few pixels"
const DRAG_SCALE = 1.08;
const COUPLING_GAP_PIXELS = 3;
const TAIL_FRACTION = 0.6; // "## Q&A 6": the train's end at ~60 % of the width
const LETTER_SOUND_SAFETY_TIMEOUT_MILLISECONDS = 5000;
// Verification round 1 H1: guaranteed vertical gap between the drop zone and the pool row.
const MINIMUM_POOL_GAP_PIXELS = 12;
const EASE_IN_OUT = Easing.inOut(Easing.cubic);
// Verification round 2 H1: portrait board sizes are ignored only while the landscape lock is pending (at most this long);
// after that (lock done / failed / not honoured, e.g. web, iPad multitasking) any size is laid out.
const ORIENTATION_LOCK_GRACE_MILLISECONDS = 500;
const DRAG_SCALE_MILLISECONDS = 130; // verification round 2 M1: eased pick-up / put-down scale
// "## Follow-up prompt 10" item 4 (train jumped to the target, 1 s move missing, end exit vanished).
// UNCONFIRMED HYPOTHESIS: the jump was caused by the device's "Reduce Motion" accessibility setting. VERIFIED (in
// Reanimated's source, react-native-reanimated/src/animation/util.ts getReduceMotionFromConfig): withTiming /
// withDelay / withSequence default to ReduceMotion.System and jump straight to the end value when that setting is
// on. NOT CONFIRMED: whether the user's device has it on - the dev log line '[train] system Reduce Motion' below
// will tell on the next device run. Either way the user requires every move to be continuous, so all animations of
// this game opt out of it. (Separately CONFIRMED and fixed: the old exit used Easing.in - accelerating the whole time,
// never reaching regular speed - and "Hotovo" fired at exactly EXIT_MILLISECONDS, racing the last frame; exitEasing
// now reaches constant speed after 30 % and "Hotovo" comes 150 ms after the train is off-screen.)
const NEVER_REDUCED = ReduceMotion.Never;
const GREEN_SHADE_MILLISECONDS = 250; // DECISION: the green shade fades in / out quickly

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
  // "## Follow-up prompt 10": red (fading) / green (permanent until connected) shades around waiting wagons.
  const [shades, setShades] = useState<ShadeState>(NO_SHADES);
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
  const motionSlow = useSharedValue(0); // ShiftMotion.slowDistance (repair L3)
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
    warmBundledAudioModules([...Object.values(EN_LETTER_AUDIO), ...alphabetLetters('cz').map((letter) => LETTER_AUDIO[letter])]);
  }, []);

  // Diagnostic for "## Follow-up prompt 10" item 4: logs (dev only, Metro terminal) whether the device asks to reduce
  // motion - UNCONFIRMED HYPOTHESIS that this setting made the train jump (see NEVER_REDUCED); this line confirms or
  // refutes it on the next device run.
  const systemReducedMotion = useReducedMotion();
  useEffect(() => {
    if (__DEV__) {
      console.log(`[train] system Reduce Motion = ${systemReducedMotion} (train animations ignore it)`);
    }
  }, [systemReducedMotion]);

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
      motionSlow.value = 0;
      motionElapsed.value = SHIFT_TOTAL_MILLISECONDS;
      exitOffset.value = 0;
      wiggle.value = 0;
    },
    [motionElapsed, exitOffset, motionFrom, motionTo, motionVelocity, motionAcceleration, motionSlow, wiggle]
  );

  const startPlay = useCallback(
    (current: TrainSettings) => {
      clearTimers();
      stopAudioIfOwnedBy(owner);
      // Repair L4: shades vanish instantly on a new play - the pool wagons are keyed by play id (remounted with the
      // reset shades, no 250 ms green fade-out carried over from the previous play).
      setPlay(newPlay(current));
      setPhase('playing');
      setShades(NO_SHADES);
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
  // Repair L3: the 1 s part travels exactly 90 % of the WAGON WIDTH (spec wording "90% of width of the just connected
  // wagon"), the rest of the pitch (wagon width + coupling gap) goes over the 10 s.
  const shiftTrainTo = useCallback(
    (target: number, slowDistance: number) => {
      const current: ShiftMotion = {
        from: motionFrom.value,
        to: motionTo.value,
        startVelocity: motionVelocity.value,
        startAcceleration: motionAcceleration.value,
        slowDistance: motionSlow.value,
      };
      cancelAnimation(motionElapsed);
      const next = retargetShift(current, motionElapsed.value, target, slowDistance);
      motionFrom.value = next.from;
      motionTo.value = next.to;
      motionVelocity.value = next.startVelocity;
      motionAcceleration.value = next.startAcceleration;
      motionSlow.value = slowDistance;
      motionElapsed.value = 0;
      motionElapsed.value = withTiming(SHIFT_TOTAL_MILLISECONDS, { duration: SHIFT_TOTAL_MILLISECONDS, easing: Easing.linear, reduceMotion: NEVER_REDUCED });
    },
    [motionFrom, motionTo, motionVelocity, motionAcceleration, motionSlow, motionElapsed]
  );

  // Displayed train offset incl. the wiggle (an attach during a wiggle starts exactly where the train is drawn).
  const currentTrainOffset = useCallback(
    () =>
      sampleShift(
        {
          from: motionFrom.value,
          to: motionTo.value,
          startVelocity: motionVelocity.value,
          startAcceleration: motionAcceleration.value,
          slowDistance: motionSlow.value,
        },
        motionElapsed.value
      ).position +
      exitOffset.value +
      wiggle.value,
    [motionFrom, motionTo, motionVelocity, motionAcceleration, motionSlow, motionElapsed, exitOffset, wiggle]
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
    exitOffset.value = withTiming(exitOffset.value - tailX - current.gap, { duration: EXIT_MILLISECONDS, easing: exitEasing, reduceMotion: NEVER_REDUCED });
    timers.current.push(setTimeout(() => setPhase('done'), finishTimeline().doneAfterExitStartMilliseconds));
  }, [currentTrainOffset, exitOffset]);

  // Release (tap, touch or drag-and-release) of a waiting wagon: true = attached to the train, false = slides back.
  // "## Follow-up prompt 10": the correct wagon connects on a mere touch/tap, wherever it is released (fast 0.5 s slide
  // behind the last wagon, ATTACH_MILLISECONDS); a wrong one gets the fading red shade and the correct one the green.
  const handleRelease = useCallback(
    (letter: string, rectangle: Rectangle, releaseScale: number): boolean => {
      const current = layoutRef.current;
      const currentPlay = playRef.current;
      if (current === null || currentPlay === null) {
        return false;
      }
      const outcome = selectionOutcome(currentPlay.game, letter, phase === 'playing');
      if (outcome === 'ignored') {
        return false;
      }
      const offset = currentTrainOffset();
      if (outcome === 'wrong') {
        setShades((previous) => shadesAfterWrongSelection(previous, letter, currentPlay.game.letters[currentPlay.game.placedCount] ?? null));
        const tailX = offset + current.engineWidth + currentPlay.game.placedCount * current.pitch;
        const zone = dropZone(tailX, current.trainTop, current.engineHeight, current.wagonWidth, current.wagonHeight);
        if (releaseReaction(outcome, isDropHit(rectangle, zone), false).wiggle) {
          // Wrong letter dropped at the train: the train shakes slightly, NO sound ("## Q&A 7").
          wiggle.value = withSequence(
            NEVER_REDUCED,
            withTiming(-6, { duration: 90, easing: Easing.inOut(Easing.sin), reduceMotion: NEVER_REDUCED }),
            withTiming(6, { duration: 150, easing: Easing.inOut(Easing.sin), reduceMotion: NEVER_REDUCED }),
            withTiming(-4, { duration: 130, easing: Easing.inOut(Easing.sin), reduceMotion: NEVER_REDUCED }),
            withTiming(0, { duration: 110, easing: Easing.inOut(Easing.sin), reduceMotion: NEVER_REDUCED })
          );
        }
        return false;
      }
      const result = placeLetter(currentPlay.game, letter, Math.random);
      if (result === null) {
        return false;
      }
      setShades((previous) => shadesAfterConnect(previous, letter));
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
      // The last wagon: NO shift, the exit starts after the attach slide (releaseReaction / finishTimeline).
      if (releaseReaction(outcome, false, isGameFinished(result.state)).follow === 'exit') {
        setPhase('leaving');
        timers.current.push(setTimeout(startExit, finishTimeline().exitStartMilliseconds));
      } else {
        shiftTrainTo(targetOffset(current, result.state.placedCount), shiftSlowDistance(current.pitch, current.wagonWidth));
      }
      return true;
    },
    [phase, currentTrainOffset, wiggle, shiftTrainTo, startExit]
  );

  const trainStyle = useAnimatedStyle(() => {
    const sample = sampleShift(
      {
        from: motionFrom.value,
        to: motionTo.value,
        startVelocity: motionVelocity.value,
        startAcceleration: motionAcceleration.value,
        slowDistance: motionSlow.value,
      },
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
    // Whole-play resources are ready before the play shows (preferences skill); the themed start animation plays
    // meanwhile and is cut immediately once they are ready — `_LetterTraining_PROMPTS.md` / "### Phase D — start
    // animations".
    return (
      <SafeAreaView style={styles.centered}>
        <StartAnimation scene="train" />
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
                key={`${play.id}:${letter}`}
                letter={letter}
                label={letterLabel(letter, settings.letterCase)}
                wagonIndex={play.wagonImages[letter] ?? 0}
                colorSeed={play.game.letters.indexOf(letter)}
                x={poolSlots[index] ?? 0}
                y={wagonTop(layout.poolRail, play.wagonImages[letter] ?? 0, layout.wagonWidth)}
                width={layout.wagonWidth}
                grow={play.grownLetter === letter}
                greenShade={shades.green === letter}
                redShadeSerial={shades.red?.letter === letter ? shades.red.serial : 0}
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
      offsetX.value = withTiming(0, { duration: ATTACH_MILLISECONDS, easing: EASE_IN_OUT, reduceMotion: NEVER_REDUCED });
      offsetY.value = withTiming(0, { duration: ATTACH_MILLISECONDS, easing: EASE_IN_OUT, reduceMotion: NEVER_REDUCED });
      // Release scale (dragged, up to 1.08) -> 1, eased.
      scale.value = withTiming(1, { duration: ATTACH_MILLISECONDS, easing: EASE_IN_OUT, reduceMotion: NEVER_REDUCED });
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
  // "## Follow-up prompt 10": permanent green shade (this is the correct wagon after a wrong selection) and the red
  // shade serial (> 0 and changed -> the red shade appears and fades out over RED_SHADE_FADE_MILLISECONDS).
  greenShade: boolean;
  redShadeSerial: number;
  enabled: boolean;
  onDragStart: (letter: string) => void;
  // scale = the live drawn drag scale at release (verification round 3 L1).
  onRelease: (letter: string, rectangle: Rectangle, scale: number) => boolean;
  // Hot in-memory wagon picture from train/train.zip ("## Follow-up prompt 9"); undefined -> drawn placeholder.
  imageUri?: string;
}

function PoolWagon({ letter, label, wagonIndex, colorSeed, x, y, width, grow, greenShade, redShadeSerial, enabled, onDragStart, onRelease, imageUri }: PoolWagonProps) {
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
  const gestureState = useRef({ grabX: 0, grabY: 0, attached: false });
  const greenOpacity = useSharedValue(greenShade ? 1 : 0);
  const redOpacity = useSharedValue(0);

  // "## Follow-up prompt 10": green shade permanent while this is the correct wagon after a wrong selection.
  useEffect(() => {
    greenOpacity.value = withTiming(greenShade ? 1 : 0, { duration: GREEN_SHADE_MILLISECONDS, easing: EASE_IN_OUT, reduceMotion: NEVER_REDUCED });
  }, [greenShade, greenOpacity]);

  // "## Follow-up prompt 10": "the reddish shade shall show around it: the shade shall slowly vanish (in 2 seconds)".
  useEffect(() => {
    if (redShadeSerial > 0) {
      redOpacity.value = 1;
      redOpacity.value = withTiming(0, { duration: RED_SHADE_FADE_MILLISECONDS, easing: Easing.out(Easing.quad), reduceMotion: NEVER_REDUCED });
    }
  }, [redShadeSerial, redOpacity]);

  // Grow from a point at its new place, after the neighbours started making space.
  useEffect(() => {
    if (grow) {
      scale.value = withDelay(
        GROW_DELAY_MILLISECONDS,
        withTiming(1, { duration: GROW_MILLISECONDS, easing: EASE_IN_OUT, reduceMotion: NEVER_REDUCED }),
        NEVER_REDUCED
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Neighbours "make space" / close the gap: ease to the new slot.
  useEffect(() => {
    baseX.value = withTiming(x, { duration: MAKE_SPACE_MILLISECONDS, easing: EASE_IN_OUT, reduceMotion: NEVER_REDUCED });
    baseY.value = withTiming(y, { duration: MAKE_SPACE_MILLISECONDS, easing: EASE_IN_OUT, reduceMotion: NEVER_REDUCED });
  }, [x, y, baseX, baseY]);

  // "slightly floating: slowly moving left and right and up and down a few pixels randomly"; "## Follow-up prompt 10":
  // always by 1 px only (a larger move = several 1 px steps, src/train/motion.ts planFloatSteps), each step glides,
  // and at least 0.5 s pause between consecutive 1 px steps (floatStepInterval). Repair M1: ONE scheduler per wagon,
  // ONE axis per step (nextFloatStep) - X and Y steps never overlap.
  useEffect(() => {
    let handle: ReturnType<typeof setTimeout> | undefined;
    let active = true;
    const loop = (state: typeof FLOAT_REST) => {
      if (!active) {
        return;
      }
      const step = nextFloatStep(state, FLOAT_AMPLITUDE_PIXELS, Math.random);
      const axis = step.axis === 'x' ? floatX : floatY;
      axis.value = withTiming(step.position, { duration: FLOAT_STEP_GLIDE_MILLISECONDS, easing: Easing.inOut(Easing.sin), reduceMotion: NEVER_REDUCED });
      handle = setTimeout(() => loop(step.state), floatStepInterval(Math.random));
    };
    // Random phase so the wagons do not step in sync.
    handle = setTimeout(() => loop(FLOAT_REST), floatStepPause(Math.random));
    return () => {
      active = false;
      if (handle !== undefined) {
        clearTimeout(handle);
      }
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
      dragScale.value = withTiming(1, { duration: DRAG_SCALE_MILLISECONDS, easing: EASE_IN_OUT, reduceMotion: NEVER_REDUCED });
      // "returns to its original position" - eased slide back.
      dragX.value = withTiming(0, { duration: SLIDE_BACK_MILLISECONDS, easing: EASE_IN_OUT, reduceMotion: NEVER_REDUCED });
      dragY.value = withTiming(0, { duration: SLIDE_BACK_MILLISECONDS, easing: EASE_IN_OUT, reduceMotion: NEVER_REDUCED });
    };
    return configureWagonPan(Gesture.Pan(), enabled)
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
        state.attached = false;
        frozenFloatX.value = floatX.value;
        frozenFloatY.value = floatY.value;
        dragging.value = 1;
        dragScale.value = withTiming(DRAG_SCALE, { duration: DRAG_SCALE_MILLISECONDS, easing: EASE_IN_OUT, reduceMotion: NEVER_REDUCED });
      })
      .onUpdate((event) => {
        dragX.value = state.grabX + event.translationX;
        dragY.value = state.grabY + event.translationY;
      })
      .onEnd((_event, success) => {
        const current = callbacks.current;
        // Cancelled by the system: never a selection. A tap / touch counts like a drag-and-release ("## Follow-up
        // prompt 10" - supersedes verification round 1 H1 "a tap never attaches").
        if (!success) {
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

  const greenStyle = useAnimatedStyle(() => ({ opacity: greenOpacity.value }));
  const redStyle = useAnimatedStyle(() => ({ opacity: redOpacity.value }));

  return (
    <GestureDetector gesture={pan}>
      <Animated.View style={[styles.poolWagon, style]} accessibilityLabel={label}>
        <Animated.View pointerEvents="none" style={[styles.shade, styles.greenShade, greenStyle]} />
        <Animated.View pointerEvents="none" style={[styles.shade, styles.redShade, redStyle]} />
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
  // "## Follow-up prompt 10" shades: a soft halo around the wagon (iOS: coloured shadow glow; Android: the tint only).
  shade: { position: 'absolute', left: -8, top: -8, right: -8, bottom: -8, borderRadius: 18, shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.9, shadowRadius: 10 },
  greenShade: { backgroundColor: 'rgba(60, 200, 90, 0.45)', shadowColor: '#2EBD4F' },
  redShade: { backgroundColor: 'rgba(235, 60, 60, 0.45)', shadowColor: '#E53935' },
  loadingText: { fontSize: 28, fontWeight: '700', color: '#5B3E96' },
  doneTitle: { fontSize: 44, fontWeight: '900', color: '#5B3E96', marginBottom: 24 },
  doneButtons: { flexDirection: 'row', gap: 16 },
  restartButton: { backgroundColor: '#FFB23F', paddingHorizontal: 32, paddingVertical: 14, borderRadius: 20 },
  restartButtonLabel: { fontSize: 24, fontWeight: '800', color: '#FFFFFF' },
  homeButton: { backgroundColor: '#FFFFFF', paddingHorizontal: 32, paddingVertical: 14, borderRadius: 20, borderWidth: 3, borderColor: '#E8D9BC' },
  homeButtonLabel: { fontSize: 24, fontWeight: '800', color: '#6B5B7B' },
});
