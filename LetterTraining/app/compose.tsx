// "Skládání slov" (word composing) game screen, variants via the `variant` route param (letters | syllables) -
// `_LetterTraining_PROMPTS.md` / "## Follow-up prompt 4 — new game "Skládání slov" (verbatim)",
// "## Q&A 4 — Skládání slov round 1", "## Q&A 5 — Skládání slov round 2". Pure logic: src/compose/logic.ts.
//
// Behaviour:
// - picture + plain word speech on round start + 🔊 replay ("the same as in the první písmenko excercise");
// - shuffled tiles row, one placeholder box per letter/syllable below it;
// - arrow from a tile carrying the word's first letter/syllable to the first box, hidden once box 1 is filled;
// - drag start: the tile's letter name / syllable is spoken once ("## Q&A 4": at drag start);
// - release with ANY intersection with an eligible (empty, same value) box: centred into it and locked (largest
//   overlap wins); otherwise it slides back to its place in 500 ms and the round is scored wrong ("## Q&A 4");
// - word complete: green ✓ next to the word (directly above its last box, in the then-empty arrow gap) + green tiles,
//   next round after max(500 ms, end of the last tile sound) ("## Q&A 5").
// Autonomous decisions (NOT user-specified; listed in README.md):
// - DECISION: a release after moving < 12 px is treated as a tap (slides back, NOT a wrong drop).
// - DECISION: a release with > 50 % overlap of the tile's own home spot is NOT a wrong drop (softens "## Q&A 4").
// - DECISION: completion waits at most 3000 ms for the last tile sound (COMPLETION_MAXIMUM_WAIT_MILLISECONDS).
// - DECISION: the screen is locked to portrait while mounted.
// - DECISION: tile case default CAPITALS (src/compose/settings.ts).

import { Asset } from 'expo-asset';
import * as ScreenOrientation from 'expo-screen-orientation';
import { setAudioModeAsync } from 'expo-audio';
import { useFocusEffect, useLocalSearchParams, useRouter } from 'expo-router';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Image, LayoutChangeEvent, Pressable, StyleSheet, Text, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

import { playAudio, stopAudioIfOwnedBy } from '../src/audioController';
import {
  ComposeLayout,
  ComposeProgress,
  ComposeRound,
  ComposeVariant,
  INITIAL_COMPOSE_PROGRESS,
  Rectangle,
  TileCase,
  arrowSourceTileId,
  buildComposePlan,
  collectComposeAssetModules,
  completeRound,
  computeLayout,
  isReleasedOnHome,
  isWordComplete,
  recordWrongDrop,
  resolveDrop,
  scaleRectangle,
  tileAudio,
  tileLabel,
} from '../src/compose/logic';
import { loadTileCase } from '../src/compose/settings';
import { WordStartsDataset } from '../src/wordStarts/types';
import { LETTER_AUDIO, REAL_SYLLABLES, SYLLABLE_AUDIO, WORDS } from '../src/words';

const DATASET: WordStartsDataset = { words: WORDS, letterAudio: LETTER_AUDIO, syllableAudio: SYLLABLE_AUDIO, realSyllables: REAL_SYLLABLES };

const FEEDBACK_DURATION_MILLISECONDS = 500;
const SLIDE_BACK_MILLISECONDS = 500; // "sliding animation which shall last 0.5 seconds"
const SNAP_MILLISECONDS = 150;
const TAP_DISTANCE_PIXELS = 12;
const TILE_SOUND_SAFETY_TIMEOUT_MILLISECONDS = 5000;
// DECISION (not user-specified): completion never waits longer than this for the last tile sound (verification compose R1 H1: no stuck round even if
// the sound's end callback is lost).
const COMPLETION_MAXIMUM_WAIT_MILLISECONDS = 3000;
const DRAG_SCALE = 1.08;
const WORD_SOUND_SAFETY_TIMEOUT_MILLISECONDS = 15000;
const PLAYBACK_RATE = 1;

const TITLES: Record<ComposeVariant, string> = {
  letters: 'Slož slovo z písmen',
  syllables: 'Slož slovo ze slabik',
};

function parseVariant(raw: string | string[] | undefined): ComposeVariant {
  const value = Array.isArray(raw) ? raw[0] : raw;
  return value === 'syllables' ? 'syllables' : 'letters';
}

export default function ComposeScreen() {
  const router = useRouter();
  const { variant: variantParam } = useLocalSearchParams<{ variant?: string }>();
  const variant = parseVariant(variantParam);

  const [roundPlan, setRoundPlan] = useState<ComposeRound[]>(() => buildComposePlan(WORDS, variant));
  const [progress, setProgress] = useState<ComposeProgress>(INITIAL_COMPOSE_PROGRESS);
  const [filledSlots, setFilledSlots] = useState<(number | null)[]>(() => roundPlan[0]?.slots.map(() => null) ?? []);
  const [completed, setCompleted] = useState(false);
  // null until the stored setting is loaded: tiles are rendered only then (no CAPITALS flash, verification compose R1 LOW).
  const [tileCase, setTileCase] = useState<TileCase | null>(null);
  const [focused, setFocused] = useState(true);
  const [audioModeReady, setAudioModeReady] = useState(false);
  const [boardWidth, setBoardWidth] = useState(0);
  // Tile currently dragged: the arrow skips it (verification compose R2 N4).
  const [draggedTileId, setDraggedTileId] = useState<number | null>(null);
  const mounted = useRef(true);

  const progressRef = useRef(progress);
  progressRef.current = progress;
  const filledRef = useRef(filledSlots);
  filledRef.current = filledSlots;
  const generation = useRef(0);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  // Id of the tile sound the completion waits for; null = none pending. Cleared by the sound's end callbacks AND by
  // everything in this screen that stops / supersedes it (verification compose R1 H1).
  const pendingTileSound = useRef<number | null>(null);
  const tileSoundCounter = useRef(0);
  const onTileSoundEnded = useRef<(() => void) | null>(null);
  const completedRef = useRef(completed);
  completedRef.current = completed;
  const advanceNow = useRef<(() => void) | null>(null);

  const releasePendingTileSound = useCallback(() => {
    pendingTileSound.current = null;
    onTileSoundEnded.current?.();
  }, []);
  const owner = useRef({}).current;

  const clearTimers = useCallback(() => {
    for (const timer of timers.current) {
      clearTimeout(timer);
    }
    timers.current = [];
  }, []);

  const finished = progress.roundIndex >= roundPlan.length;
  const currentRound = finished ? null : roundPlan[progress.roundIndex];

  // Tile case setting ("## Q&A 5") - re-read whenever the screen gets focus (e.g. back from the settings page).
  // Focus / blur (e.g. the settings page): on blur stop audio + timers; a completed round advances at once (silently,
  // the word is played on return) - verification compose R1 LOW.
  useFocusEffect(
    useCallback(() => {
      setFocused(true);
      return () => {
        setFocused(false);
        clearTimers();
        stopAudioIfOwnedBy(owner);
        pendingTileSound.current = null;
        if (completedRef.current) {
          // Deferred + mounted check: this cleanup also runs on unmount, where advancing is pointless (verification compose R2 N5).
          queueMicrotask(() => {
            if (mounted.current) {
              advanceNow.current?.();
            }
          });
        }
      };
    }, [clearTimers, owner])
  );

  // DECISION (not user-specified): portrait only (verification compose R1 M2), like Pexeso locks landscape: lock while mounted, unlock on leave.
  useEffect(() => {
    ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP).catch(() => undefined);
    return () => {
      ScreenOrientation.unlockAsync().catch(() => undefined);
    };
  }, []);

  useFocusEffect(
    useCallback(() => {
      let cancelled = false;
      loadTileCase().then((stored) => {
        if (!cancelled) {
          setTileCase(stored);
        }
      });
      return () => {
        cancelled = true;
      };
    }, [])
  );

  // Prefetch current + next 2 rounds - same mechanism as app/words.tsx / TreninkPorozumeni ("every data which are needed
  // in the next rounds of current training shall be pre-fetched 2 rounds in advance", "## Initial request (2026-10-01)").
  const prefetchedModuleIdsRef = useRef<Set<number>>(new Set());
  useEffect(() => {
    for (let index = progress.roundIndex; index <= progress.roundIndex + 2 && index < roundPlan.length; index++) {
      for (const moduleId of collectComposeAssetModules(roundPlan[index], DATASET)) {
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
          // Unknown module id: equally silent.
        }
      }
    }
  }, [roundPlan, progress.roundIndex]);

  useEffect(() => {
    setAudioModeAsync({ playsInSilentMode: true })
      .catch(() => {
        // Nicety only.
      })
      .then(() => setAudioModeReady(true));
  }, []);

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
      generation.current += 1;
      clearTimers();
      stopAudioIfOwnedBy(owner);
    };
  }, [clearTimers, owner]);

  const playWord = useCallback(
    (round: ComposeRound) => {
      releasePendingTileSound(); // the word supersedes (stops) any tile sound
      // Evaluator default (Q&A 5, not objected): both variants play the plain word.
      playAudio(round.word.audio, {
        key: `compose-word:${round.word.id}`,
        owner,
        rate: PLAYBACK_RATE,
        startWatchdog: true,
        retryOnceOnStartFailure: true,
        safetyTimeoutMilliseconds: WORD_SOUND_SAFETY_TIMEOUT_MILLISECONDS,
      });
    },
    [owner, releasePendingTileSound]
  );

  useEffect(() => {
    if (currentRound !== null && audioModeReady && focused) {
      playWord(currentRound);
    }
  }, [currentRound, audioModeReady, focused, playWord]);

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
    pendingTileSound.current = null;
    const plan = buildComposePlan(WORDS, variant);
    setRoundPlan(plan);
    setProgress(INITIAL_COMPOSE_PROGRESS);
    setFilledSlots(plan[0]?.slots.map(() => null) ?? []);
    setCompleted(false);
  }, [clearTimers, owner, variant]);

  // Drag start: speak the tile once ("every letter that is dragged ... shall be pronounced"; "## Q&A 4": at drag start).
  const handleDragStart = useCallback(
    (tileId: number) => {
      if (currentRound === null) {
        return;
      }
      setDraggedTileId(tileId);
      const value = currentRound.tiles[tileId].value;
      const audio = tileAudio(variant, value, DATASET);
      // A new tile sound supersedes the previous one (latest-wins audio): the completion now waits for this one.
      tileSoundCounter.current += 1;
      const soundId = tileSoundCounter.current;
      if (audio === undefined) {
        releasePendingTileSound();
        return;
      }
      pendingTileSound.current = soundId;
      const onEnd = () => {
        if (pendingTileSound.current === soundId) {
          releasePendingTileSound();
        }
      };
      playAudio(audio, {
        key: `compose-tile:${value}`,
        owner,
        rate: PLAYBACK_RATE,
        onFinish: onEnd,
        onFailure: onEnd,
        startWatchdog: true,
        safetyTimeoutMilliseconds: TILE_SOUND_SAFETY_TIMEOUT_MILLISECONDS,
      });
    },
    [currentRound, variant, owner, releasePendingTileSound]
  );

  const handleDragEnd = useCallback((tileId: number) => {
    setDraggedTileId((current) => (current === tileId ? null : current));
  }, []);

  const layout = useMemo(
    () => (currentRound !== null && boardWidth > 0 ? computeLayout(boardWidth, currentRound.slots.length, variant) : null),
    [currentRound, boardWidth, variant]
  );

  // Word complete: ✓ next to the word, next round after max(500 ms, end of the last tile sound) ("## Q&A 5").
  const startCompletion = useCallback(() => {
    setCompleted(true);
    generation.current += 1;
    const completionGeneration = generation.current;
    let minimumElapsed = false;
    const advance = () => {
      if (completionGeneration !== generation.current) {
        return;
      }
      generation.current += 1;
      onTileSoundEnded.current = null;
      advanceNow.current = null;
      clearTimers();
      const next = completeRound(progressRef.current);
      progressRef.current = next;
      setProgress(next);
      setCompleted(false);
      setFilledSlots(roundPlan[next.roundIndex]?.slots.map(() => null) ?? []);
    };
    const tryAdvance = () => {
      if (minimumElapsed && pendingTileSound.current === null) {
        advance();
      }
    };
    onTileSoundEnded.current = tryAdvance;
    advanceNow.current = advance;
    timers.current.push(
      setTimeout(() => {
        minimumElapsed = true;
        tryAdvance();
      }, FEEDBACK_DURATION_MILLISECONDS),
      setTimeout(advance, COMPLETION_MAXIMUM_WAIT_MILLISECONDS)
    );
  }, [clearTimers, roundPlan]);

  // Release: returns the box index the tile snaps into, or null (slide back).
  const handleRelease = useCallback(
    (tileId: number, tileRectangle: Rectangle, movedDistance: number): number | null => {
      if (currentRound === null || layout === null || completed) {
        return null;
      }
      const slotRectangles = layout.columnX.map((x) => ({ x, y: layout.slotsRowY, width: layout.tileWidth, height: layout.tileHeight }));
      const slotIndex = resolveDrop(currentRound, filledRef.current, tileId, tileRectangle, slotRectangles);
      if (slotIndex === null) {
        const homeRectangle = { x: layout.columnX[tileId], y: layout.tilesRowY, width: layout.tileWidth, height: layout.tileHeight };
        // DECISIONS (not user-specified): tap (< 12 px) and release on the own home spot are not wrong drops.
        if (movedDistance >= TAP_DISTANCE_PIXELS && !isReleasedOnHome(tileRectangle, homeRectangle)) {
          const next = recordWrongDrop(progressRef.current);
          progressRef.current = next;
          setProgress(next);
        }
        return null;
      }
      const nextFilled = [...filledRef.current];
      nextFilled[slotIndex] = tileId;
      filledRef.current = nextFilled;
      setFilledSlots(nextFilled);
      if (isWordComplete(nextFilled)) {
        startCompletion();
      }
      return slotIndex;
    },
    [currentRound, layout, completed, startCompletion]
  );

  const onBoardLayout = (event: LayoutChangeEvent) => setBoardWidth(event.nativeEvent.layout.width);

  if (roundPlan.length === 0) {
    return (
      <SafeAreaView style={styles.centered}>
        <Text style={styles.scoreLine}>Pro tuto hru zatím nejsou žádná slova.</Text>
        <Pressable style={styles.homeButton} onPress={goBackToSelection} accessibilityRole="button">
          <Text style={styles.homeButtonLabel}>Zpět na výběr</Text>
        </Pressable>
      </SafeAreaView>
    );
  }

  if (currentRound === null) {
    // Results page ("## Q&A 4": "Správně: X/10", round correct only if no wrong drop).
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

  const arrowTileId = arrowSourceTileId(currentRound, filledSlots, draggedTileId);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={goBackToSelection} accessibilityRole="button" accessibilityLabel="Zpět na výběr" style={styles.backButton} hitSlop={8}>
          <Text style={styles.backButtonText}>‹ Zpět</Text>
        </Pressable>
        <Text style={styles.headerTitle} numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.6}>
          {TITLES[variant]}
        </Text>
        <Text style={styles.roundCounter}>
          {progress.roundIndex + 1}/{roundPlan.length}
        </Text>
        <Pressable
          onPress={() => router.push('/compose-settings')}
          accessibilityRole="button"
          accessibilityLabel="Nastavení"
          style={styles.settingsButton}
          hitSlop={8}
        >
          <Text style={styles.settingsButtonText}>⚙</Text>
        </Pressable>
      </View>
      <View style={styles.body}>
        <View style={styles.pictureRow}>
          <Image source={currentRound.word.image} style={styles.picture} resizeMode="contain" />
          <Pressable
            style={({ pressed }) => [styles.replayButton, pressed && styles.replayButtonPressed, completed && styles.replayButtonDisabled]}
            onPress={() => playWord(currentRound)}
            disabled={completed}
            accessibilityRole="button"
            accessibilityLabel="Přehrát slovo znovu"
          >
            <Text style={styles.replayButtonIcon}>🔊</Text>
          </Pressable>
        </View>
        <View style={[styles.board, layout !== null && { height: layout.totalHeight }]} onLayout={onBoardLayout}>
          {layout !== null && tileCase !== null && (
            <>
              {layout.columnX.map((x, index) => (
                <View
                  key={`slot-${progress.roundIndex}-${index}`}
                  style={[
                    styles.slot,
                    { left: x, top: layout.slotsRowY, width: layout.tileWidth, height: layout.tileHeight },
                    completed && styles.slotCompleted,
                  ]}
                />
              ))}
              {arrowTileId !== null && <Arrow layout={layout} fromColumn={arrowTileId} />}
              {currentRound.tiles.map((tile) => {
                const slotIndex = filledSlots.indexOf(tile.id);
                return (
                  <DraggableTile
                    key={`tile-${progress.roundIndex}-${tile.id}`}
                    tileId={tile.id}
                    label={tileLabel(tile.value, tileCase)}
                    layout={layout}
                    homeColumn={tile.id}
                    placedColumn={slotIndex >= 0 ? slotIndex : null}
                    enabled={slotIndex < 0 && !completed}
                    completed={completed}
                    isSyllable={variant === 'syllables'}
                    onDragStart={handleDragStart}
                    onDragEnd={handleDragEnd}
                    onRelease={handleRelease}
                  />
                );
              })}
              {completed && (
                // Rendered AFTER the tiles, above the last box in the then-empty arrow gap (verification compose R1 H2, R2 N1).
                <Text pointerEvents="none" style={[styles.checkmark, { left: layout.checkmarkX, top: layout.checkmarkY }]}>
                  ✓
                </Text>
              )}
            </>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
}

// Straight arrow with a head (evaluator default, Q&A 5) from the bottom of the first-letter tile to the top of box 1.
function Arrow({ layout, fromColumn }: { layout: ComposeLayout; fromColumn: number }) {
  const startX = layout.columnX[fromColumn] + layout.tileWidth / 2;
  const startY = layout.tilesRowY + layout.tileHeight + 6;
  const endX = layout.columnX[0] + layout.tileWidth / 2;
  const endY = layout.slotsRowY - 4;
  const deltaX = endX - startX;
  const deltaY = endY - startY;
  const length = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
  const angle = Math.atan2(deltaY, deltaX);
  const headLength = 14;
  const lineLength = Math.max(0, length - headLength);
  const lineEndX = startX + Math.cos(angle) * lineLength;
  const lineEndY = startY + Math.sin(angle) * lineLength;
  const headCenterX = startX + Math.cos(angle) * (length - headLength / 2);
  const headCenterY = startY + Math.sin(angle) * (length - headLength / 2);
  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFill}>
      <View
        style={[
          styles.arrowLine,
          {
            left: (startX + lineEndX) / 2 - lineLength / 2,
            top: (startY + lineEndY) / 2 - 2,
            width: lineLength,
            transform: [{ rotate: `${angle}rad` }],
          },
        ]}
      />
      <View
        style={[
          styles.arrowHead,
          {
            left: headCenterX - headLength / 2,
            top: headCenterY - 9,
            transform: [{ rotate: `${angle}rad` }],
          },
        ]}
      />
    </View>
  );
}

interface DraggableTileProps {
  tileId: number;
  label: string;
  layout: ComposeLayout;
  homeColumn: number;
  placedColumn: number | null;
  enabled: boolean;
  completed: boolean;
  isSyllable: boolean;
  onDragStart: (tileId: number) => void;
  onDragEnd: (tileId: number) => void;
  onRelease: (tileId: number, tileRectangle: Rectangle, movedDistance: number) => number | null;
}

function DraggableTile({ tileId, label, layout, homeColumn, placedColumn, enabled, completed, isSyllable, onDragStart, onDragEnd, onRelease }: DraggableTileProps) {
  const homeX = layout.columnX[homeColumn];
  const homeY = layout.tilesRowY;
  const targetX = placedColumn === null ? homeX : layout.columnX[placedColumn];
  const targetY = placedColumn === null ? homeY : layout.slotsRowY;
  const positionX = useSharedValue(targetX);
  const positionY = useSharedValue(targetY);
  const dragging = useSharedValue(0);
  const start = useRef({ x: 0, y: 0 });

  // Placement (centre into the box) and layout changes (rotation / resize) move the tile to its target.
  useEffect(() => {
    positionX.value = withTiming(targetX, { duration: SNAP_MILLISECONDS });
    positionY.value = withTiming(targetY, { duration: SNAP_MILLISECONDS });
  }, [targetX, targetY, positionX, positionY]);

  const callbacks = useRef({ onDragStart, onDragEnd, onRelease, homeX, homeY, layout });
  callbacks.current = { onDragStart, onDragEnd, onRelease, homeX, homeY, layout };

  const pan = useMemo(
    () =>
      Gesture.Pan()
        .runOnJS(true)
        .enabled(enabled)
        .minDistance(0)
        .onStart(() => {
          start.current = { x: positionX.value, y: positionY.value };
          dragging.value = 1;
          callbacks.current.onDragStart(tileId);
        })
        .onUpdate((event) => {
          positionX.value = start.current.x + event.translationX;
          positionY.value = start.current.y + event.translationY;
        })
        .onEnd((event) => {
          const current = callbacks.current;
          const rectangle = scaleRectangle(
            { x: positionX.value, y: positionY.value, width: current.layout.tileWidth, height: current.layout.tileHeight },
            DRAG_SCALE
          );
          const moved = Math.sqrt(event.translationX * event.translationX + event.translationY * event.translationY);
          const slotIndex = current.onRelease(tileId, rectangle, moved);
          if (slotIndex === null) {
            // "move it back to its original location by sliding animation which shall last 0.5 seconds"
            positionX.value = withTiming(current.homeX, { duration: SLIDE_BACK_MILLISECONDS });
            positionY.value = withTiming(current.homeY, { duration: SLIDE_BACK_MILLISECONDS });
          }
        })
        .onFinalize(() => {
          dragging.value = 0;
          callbacks.current.onDragEnd(tileId);
        }),
    [enabled, tileId, positionX, positionY, dragging]
  );

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: positionX.value }, { translateY: positionY.value }, { scale: dragging.value === 1 ? DRAG_SCALE : 1 }],
    zIndex: dragging.value === 1 ? 10 : 1,
  }));

  return (
    <GestureDetector gesture={pan}>
      <Animated.View
        accessibilityLabel={label}
        style={[styles.tile, { width: layout.tileWidth, height: layout.tileHeight }, placedColumn !== null && styles.tilePlaced, completed && styles.tileCompleted, animatedStyle]}
      >
        <Text style={[styles.tileText, isSyllable && styles.tileTextSyllable]} numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.4}>
          {label}
        </Text>
      </Animated.View>
    </GestureDetector>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF6E5' },
  centered: { flex: 1, backgroundColor: '#FFF6E5', alignItems: 'center', justifyContent: 'center', padding: 24 },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 8 },
  backButton: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12, backgroundColor: '#FFFFFF' },
  backButtonText: { fontSize: 18, fontWeight: '700', color: '#6B5B7B' },
  headerTitle: { flex: 1, marginHorizontal: 10, fontSize: 20, fontWeight: '800', color: '#5B3E96', textAlign: 'center' },
  roundCounter: { fontSize: 18, fontWeight: '700', color: '#6B5B7B' },
  settingsButton: { marginLeft: 10, paddingHorizontal: 8, paddingVertical: 2, borderRadius: 12, backgroundColor: '#FFFFFF' },
  settingsButtonText: { fontSize: 24, color: '#6B5B7B' },
  body: { flex: 1, padding: 12 },
  pictureRow: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
  picture: { flex: 1, height: '100%', borderRadius: 20 },
  replayButton: {
    marginLeft: 12,
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#FFB84D',
    alignItems: 'center',
    justifyContent: 'center',
  },
  replayButtonPressed: { backgroundColor: '#F09A20' },
  replayButtonDisabled: { opacity: 0.4 },
  replayButtonIcon: { fontSize: 30 },
  board: { width: '100%', minHeight: 120, marginTop: 12 },
  slot: {
    position: 'absolute',
    borderRadius: 14,
    borderWidth: 3,
    borderStyle: 'dashed',
    borderColor: '#C9B48A',
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
  },
  slotCompleted: { borderColor: '#1F8A3B', backgroundColor: 'rgba(70, 190, 90, 0.25)' },
  tile: {
    position: 'absolute',
    left: 0,
    top: 0,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 3,
    borderColor: '#FFB23F',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 2,
  },
  tilePlaced: { borderColor: '#7CC58A' },
  tileCompleted: { borderColor: '#1F8A3B', backgroundColor: '#DDF5E1' },
  tileText: { fontSize: 34, fontWeight: '800', color: '#E0457B' },
  tileTextSyllable: { fontSize: 28 },
  arrowLine: { position: 'absolute', height: 4, borderRadius: 2, backgroundColor: '#5B3E96' },
  arrowHead: {
    position: 'absolute',
    width: 0,
    height: 0,
    borderTopWidth: 9,
    borderBottomWidth: 9,
    borderLeftWidth: 14,
    borderTopColor: 'transparent',
    borderBottomColor: 'transparent',
    borderLeftColor: '#5B3E96',
  },
  checkmark: { position: 'absolute', zIndex: 20, width: 44, height: 44, lineHeight: 44, textAlign: 'center', fontSize: 40, color: '#1F8A3B', fontWeight: 'bold' },
  scoreTitle: { fontSize: 44, fontWeight: 'bold', color: '#4C4536', marginBottom: 24 },
  scoreLine: { fontSize: 32, color: '#4C4536', marginBottom: 8, textAlign: 'center' },
  restartButton: { marginTop: 32, backgroundColor: '#FFB84D', borderRadius: 32, paddingHorizontal: 48, paddingVertical: 20 },
  restartButtonLabel: { fontSize: 28, fontWeight: 'bold', color: '#4C3000' },
  homeButton: { marginTop: 16, backgroundColor: '#FFE9A8', borderRadius: 28, paddingHorizontal: 40, paddingVertical: 14 },
  homeButtonLabel: { fontSize: 22, fontWeight: 'bold', color: '#4C4536' },
});
