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
//   overlap wins; "## Q&A 11" "Keep out-of-order direct drops" - also a later box);
// - "## Follow-up prompt 11" (tap-to-place): otherwise a tile belonging to the FIRST EMPTY box from the left - tapped,
//   moved a little or released anywhere - slides into that box automatically (PLACE_MILLISECONDS, eased, never reduced);
// - any other release (also a pure tap, "## Q&A 11" "Wrong tap counts too") is a wrong selection: slides back in
//   500 ms, the round is scored wrong, red shade on it fading in 2 s + permanent green shade on the correct tile until
//   it is placed ("## Q&A 11" "Train-style red+green shades"; logic: composeSelectionOutcome / composeShades*);
// - word complete: green ✓ next to the word (directly above its last box, in the then-empty arrow gap) + green tiles,
//   next round after max(500 ms, end of the last tile sound) ("## Q&A 5"), counted from the moment the last tile LANDS in
//   its box (repair M1: the ✓ appears with the complete word on screen, which then stays visible >= 500 ms).
// - L3 (known, kept as the train): a second wrong selection while a red shade is fading cuts that fade (red moves on).
// Autonomous decisions (NOT user-specified; listed in README.md):
// - SUPERSEDED by "## Q&A 11" ("Wrong tap counts too"): the old DECISIONS "a release after moving < 12 px is a tap
//   (slides back, NOT a wrong drop)" and "a release with > 50 % overlap of the tile's own home spot is NOT a wrong drop".
// - DECISION: a direct-hit placement also uses the 0.5 s eased slide (was a 150 ms snap) - one placement animation.
// - DECISION: completion waits at most 3000 ms for the last tile sound (COMPLETION_MAXIMUM_WAIT_MILLISECONDS).
// - DECISION: the screen is locked to portrait while mounted.
// - DECISION: tile case default CAPITALS (src/compose/settings.ts).

import * as ScreenOrientation from 'expo-screen-orientation';
import { setAudioModeAsync } from 'expo-audio';
import { useFocusEffect, useLocalSearchParams, useRouter } from 'expo-router';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Image, LayoutChangeEvent, Pressable, StyleSheet, Text, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, { Easing, ReduceMotion, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

import { playAudio, stopAudioIfOwnedBy } from '../src/audioController';
import { OfflineRetry } from '../src/resources/OfflineRetry';
import { useArchivePreloading } from '../src/resources/useArchivePreloading';
import { StartAnimation } from '../src/startAnimation/StartAnimation';
import { warmBundledAudioModules } from '../src/resources/warmBundledAudio';
import { WORD_PICTURE_FILE, resolveAudioSource, wordArchivePath } from '../src/wordStarts/logic';
import {
  ComposeLayout,
  ComposeProgress,
  ComposeRound,
  ComposeShadeState,
  ComposeVariant,
  INITIAL_COMPOSE_PROGRESS,
  NO_COMPOSE_SHADES,
  Rectangle,
  TileCase,
  arrowSourceTileId,
  buildComposePlan,
  collectComposeArchives,
  collectComposePreloadArchives,
  completeRound,
  composeSelectionOutcome,
  composeShadesAfterPlacement,
  composeShadesAfterWrongSelection,
  computeLayout,
  isWordComplete,
  recordWrongDrop,
  resolveDrop,
  scaleRectangle,
  tileAudioResource,
  tileLabel,
} from '../src/compose/logic';
import { loadTileCase } from '../src/compose/settings';
import { RED_SHADE_FADE_MILLISECONDS, configureSelectTap, configureWagonPan } from '../src/train/logic';
import { ATTACH_MILLISECONDS } from '../src/train/motion';
import { WordStartsDataset } from '../src/wordStarts/types';
import { LETTER_AUDIO, REAL_SYLLABLES, SYLLABLE_AUDIO, WORDS } from '../src/words';

const DATASET: WordStartsDataset = { words: WORDS, letterAudio: LETTER_AUDIO, syllableAudio: SYLLABLE_AUDIO, realSyllables: REAL_SYLLABLES };

const FEEDBACK_DURATION_MILLISECONDS = 500;
const SLIDE_BACK_MILLISECONDS = 500; // "sliding animation which shall last 0.5 seconds"
// "## Follow-up prompt 11": automatic slide into the box, consistent with the train's 0.5 s attach slide.
const PLACE_MILLISECONDS = ATTACH_MILLISECONDS;
// Repair M1: the completion feedback starts when the last tile's placement slide has landed.
const COMPLETION_START_AFTER_RELEASE_MILLISECONDS = PLACE_MILLISECONDS;
const GREEN_SHADE_MILLISECONDS = 250; // DECISION (as train.tsx): the green shade fades in / out quickly
const EASE_IN_OUT = Easing.inOut(Easing.cubic);
// As train.tsx NEVER_REDUCED: Reanimated's default ReduceMotion.System would jump straight to the end value when the
// device's Reduce Motion setting is on; the placement slide must stay continuous.
const NEVER_REDUCED = ReduceMotion.Never;
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
  // "## Q&A 11" "Train-style red+green shades" (reset per round; tiles are keyed per round, so they remount clean).
  const [shades, setShades] = useState<ComposeShadeState>(NO_COMPOSE_SHADES);
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
  // Repair M1: completion start scheduled for the landing of the last tile (null when none pending).
  const pendingCompletion = useRef<(() => void) | null>(null);
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
        // A completing word whose last tile is still sliding (repair M1: its landing timer was just cleared) advances too.
        const landingCompletion = pendingCompletion.current;
        pendingCompletion.current = null;
        if (completedRef.current || landingCompletion !== null) {
          // Deferred + mounted check: this cleanup also runs on unmount, where advancing is pointless (verification compose R2 N5).
          queueMicrotask(() => {
            if (mounted.current) {
              landingCompletion?.();
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

  // Backend-archive preloading (`_LetterTraining_PROMPTS.md` / "## Follow-up prompt 9 — mobile-apps-preferences",
  // user decision 3: 5 rounds ahead supersedes the earlier 2-rounds-ahead Asset prefetch): the CURRENT round's
  // archives must be hot before the round shows; the next 5 rounds are warmed; passed rounds' archives are released.
  const requiredArchives = useMemo(
    () => (currentRound === null ? [] : collectComposeArchives(currentRound, DATASET)),
    [currentRound]
  );
  const windowArchives = useMemo(
    () => collectComposePreloadArchives(roundPlan, progress.roundIndex, DATASET),
    [roundPlan, progress.roundIndex]
  );
  const { status: resourceStatus, archives, retry: retryResources } = useArchivePreloading(requiredArchives, windowArchives);
  const archivesRef = useRef(archives);
  archivesRef.current = archives;
  // 'ready' can momentarily still refer to the PREVIOUS round while the hook swaps rounds — the round shows only
  // when ITS archives are actually hot (usually instant: they were preloaded 5 rounds ahead).
  const roundResourcesReady = resourceStatus === 'ready' && requiredArchives.every((archivePath) => archives[archivePath] !== undefined);

  useEffect(() => {
    setAudioModeAsync({ playsInSilentMode: true })
      .catch(() => {
        // Nicety only.
      })
      .then(() => setAudioModeReady(true));
  }, []);

  // Letters-variant tiles play BUNDLED letter audio (decision 2) — warm it on mount so the first drag never
  // waits on the Metro download in Expo Go (verification Phase C R1 M2). The syllables variant plays from
  // the backend archives, which the preloading hook already makes hot.
  useEffect(() => {
    if (variant === 'letters') {
      warmBundledAudioModules(Object.values(LETTER_AUDIO));
    }
  }, [variant]);

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
      // Evaluator default (Q&A 5, not objected): both variants play the plain word — hot in memory from the word's
      // backend archive ("## Follow-up prompt 9").
      const source = archivesRef.current[wordArchivePath(round.word)]?.files['word.mp3']?.dataUri;
      if (source === undefined) {
        return; // archive not ready (never while the round is shown — rounds are gated on 'ready')
      }
      playAudio({ uri: source }, {
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
    if (currentRound !== null && audioModeReady && focused && roundResourcesReady) {
      playWord(currentRound);
    }
  }, [currentRound, audioModeReady, focused, roundResourcesReady, playWord]);

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
    pendingCompletion.current = null;
    const plan = buildComposePlan(WORDS, variant);
    setRoundPlan(plan);
    setProgress(INITIAL_COMPOSE_PROGRESS);
    setFilledSlots(plan[0]?.slots.map(() => null) ?? []);
    setShades(NO_COMPOSE_SHADES);
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
      // Letter names play from the bundle; syllables from the hot in-memory archive entry ("## Follow-up prompt 9").
      const audio = resolveAudioSource(tileAudioResource(variant, value, DATASET), archivesRef.current);
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
  // Repair M1: called when the last tile LANDS (PLACE_MILLISECONDS after its release, see handleRelease), so the ✓ appears
  // with the word complete on screen and the completed word stays visible >= FEEDBACK_DURATION_MILLISECONDS.
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
      setShades(NO_COMPOSE_SHADES);
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

  // Release (tap, small move or drag): returns the box index the tile slides into, or null (slide back).
  // "## Follow-up prompt 11" / "## Q&A 11": direct hit on an eligible box -> that box; else the first-empty-box tile
  // auto-places there; else a wrong selection (counts for the score, red + green shades).
  const handleRelease = useCallback(
    (tileId: number, tileRectangle: Rectangle): number | null => {
      if (currentRound === null || layout === null) {
        return null;
      }
      const slotRectangles = layout.columnX.map((x) => ({ x, y: layout.slotsRowY, width: layout.tileWidth, height: layout.tileHeight }));
      const directHitSlot = resolveDrop(currentRound, filledRef.current, tileId, tileRectangle, slotRectangles);
      const outcome = composeSelectionOutcome(currentRound, filledRef.current, tileId, directHitSlot, !completed);
      if (outcome.kind === 'ignored') {
        return null;
      }
      if (outcome.kind === 'wrong') {
        const next = recordWrongDrop(progressRef.current);
        progressRef.current = next;
        setProgress(next);
        const filledNow = filledRef.current;
        setShades((previous) => composeShadesAfterWrongSelection(previous, tileId, currentRound, filledNow));
        return null;
      }
      const slotIndex = outcome.slotIndex;
      const nextFilled = [...filledRef.current];
      nextFilled[slotIndex] = tileId;
      filledRef.current = nextFilled;
      setFilledSlots(nextFilled);
      setShades((previous) => composeShadesAfterPlacement(previous, tileId, currentRound, nextFilled));
      if (isWordComplete(nextFilled)) {
        // Repair M1: every placement slides PLACE_MILLISECONDS, so the completion window (✓ + max(500 ms, sound end),
        // "## Q&A 5") starts at landing, not at release. Meanwhile further releases are ignored (no empty box left).
        const landed = () => {
          pendingCompletion.current = null;
          startCompletion();
        };
        pendingCompletion.current = landed;
        timers.current.push(setTimeout(landed, COMPLETION_START_AFTER_RELEASE_MILLISECONDS));
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

  if (resourceStatus === 'offline') {
    // Backend unreachable AND the round's archives are not cached (decision 7: child-friendly Czech error + retry).
    return (
      <SafeAreaView style={styles.container}>
        <OfflineRetry onRetry={retryResources} />
        <Pressable style={[styles.homeButton, styles.homeButtonBottom]} onPress={goBackToSelection} accessibilityRole="button">
          <Text style={styles.homeButtonLabel}>Zpět na výběr</Text>
        </Pressable>
      </SafeAreaView>
    );
  }

  if (!roundResourcesReady) {
    // Current round's resources are always hot before the round shows (preferences skill); the themed start animation
    // plays meanwhile and is cut immediately once they are ready — `_LetterTraining_PROMPTS.md` / "### Phase D — start
    // animations".
    return (
      <SafeAreaView style={styles.centered}>
        <StartAnimation scene="compose" />
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
          <Image
            // Hot in-memory picture from the word's backend archive ("## Follow-up prompt 9").
            source={{ uri: archives[wordArchivePath(currentRound.word)]?.files[WORD_PICTURE_FILE]?.dataUri }}
            style={styles.picture}
            resizeMode="contain"
          />
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
                    greenShade={shades.green === tile.id && slotIndex < 0}
                    redShadeSerial={shades.red?.tileId === tile.id ? shades.red.serial : 0}
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
  // "## Q&A 11" train-style shades: permanent green (the correct tile after a wrong selection) and the red shade
  // serial (> 0 and changed -> the red shade appears and fades out over RED_SHADE_FADE_MILLISECONDS).
  greenShade: boolean;
  redShadeSerial: number;
  onDragStart: (tileId: number) => void;
  onDragEnd: (tileId: number) => void;
  onRelease: (tileId: number, tileRectangle: Rectangle) => number | null;
}

function DraggableTile({ tileId, label, layout, homeColumn, placedColumn, enabled, completed, isSyllable, greenShade, redShadeSerial, onDragStart, onDragEnd, onRelease }: DraggableTileProps) {
  const homeX = layout.columnX[homeColumn];
  const homeY = layout.tilesRowY;
  const targetX = placedColumn === null ? homeX : layout.columnX[placedColumn];
  const targetY = placedColumn === null ? homeY : layout.slotsRowY;
  const positionX = useSharedValue(targetX);
  const positionY = useSharedValue(targetY);
  const dragging = useSharedValue(0);
  const start = useRef({ x: 0, y: 0 });

  const greenOpacity = useSharedValue(greenShade ? 1 : 0);
  const redOpacity = useSharedValue(0);

  // Placement (slide into the box from wherever it was released - "## Follow-up prompt 11") and layout changes
  // (rotation / resize) move the tile to its target.
  useEffect(() => {
    positionX.value = withTiming(targetX, { duration: PLACE_MILLISECONDS, easing: EASE_IN_OUT, reduceMotion: NEVER_REDUCED });
    positionY.value = withTiming(targetY, { duration: PLACE_MILLISECONDS, easing: EASE_IN_OUT, reduceMotion: NEVER_REDUCED });
  }, [targetX, targetY, positionX, positionY]);

  // "## Q&A 11" (as train.tsx PoolWagon): green permanent while this is the correct tile after a wrong selection.
  useEffect(() => {
    greenOpacity.value = withTiming(greenShade ? 1 : 0, { duration: GREEN_SHADE_MILLISECONDS, easing: EASE_IN_OUT, reduceMotion: NEVER_REDUCED });
  }, [greenShade, greenOpacity]);

  // Red shade on a wrong selection, fading out in 2 s; a new serial restarts the fade.
  useEffect(() => {
    if (redShadeSerial > 0) {
      redOpacity.value = 1;
      redOpacity.value = withTiming(0, { duration: RED_SHADE_FADE_MILLISECONDS, easing: Easing.out(Easing.quad), reduceMotion: NEVER_REDUCED });
    } else {
      redOpacity.value = 0;
    }
  }, [redShadeSerial, redOpacity]);

  const callbacks = useRef({ onDragStart, onDragEnd, onRelease, homeX, homeY, layout });
  callbacks.current = { onDragStart, onDragEnd, onRelease, homeX, homeY, layout };

  const pan = useMemo(() => {
    // Cancelled by the system: never a selection (as train.tsx). A tap / small move counts like a drag-and-release
    // ("## Follow-up prompt 11"; the old 12 px free-tap rule is superseded by "## Q&A 11").
    const release = (success: boolean, scale: number) => {
      const current = callbacks.current;
      const rectangle = scaleRectangle(
        { x: positionX.value, y: positionY.value, width: current.layout.tileWidth, height: current.layout.tileHeight },
        scale
      );
      const slotIndex = success ? current.onRelease(tileId, rectangle) : null;
      if (slotIndex === null) {
        // "move it back to its original location by sliding animation which shall last 0.5 seconds"
        positionX.value = withTiming(current.homeX, { duration: SLIDE_BACK_MILLISECONDS, easing: EASE_IN_OUT, reduceMotion: NEVER_REDUCED });
        positionY.value = withTiming(current.homeY, { duration: SLIDE_BACK_MILLISECONDS, easing: EASE_IN_OUT, reduceMotion: NEVER_REDUCED });
      }
    };
    const drag = configureWagonPan(Gesture.Pan(), enabled)
      .onBegin(() => {
        // Tile sound at touch-down: covers both a tap and a drag start, exactly once (as train.tsx, "## Q&A 4").
        callbacks.current.onDragStart(tileId);
      })
      .onStart(() => {
        start.current = { x: positionX.value, y: positionY.value };
        dragging.value = 1;
      })
      .onUpdate((event) => {
        positionX.value = start.current.x + event.translationX;
        positionY.value = start.current.y + event.translationY;
      })
      .onEnd((_event, success) => release(success, DRAG_SCALE))
      .onFinalize(() => {
        dragging.value = 0;
        callbacks.current.onDragEnd(tileId);
      });
    // "## Bug report 13": a release WITHOUT movement never activates the Pan (onEnd never runs) - the raced Tap
    // handles it as a release at the tile's home position (not scaled: the tile never grew).
    const tap = configureSelectTap(Gesture.Tap(), enabled).onEnd((_event, success) => {
      if (success) {
        release(true, 1);
      }
    });
    return Gesture.Race(drag, tap);
  }, [enabled, tileId, positionX, positionY, dragging]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: positionX.value }, { translateY: positionY.value }, { scale: dragging.value === 1 ? DRAG_SCALE : 1 }],
    zIndex: dragging.value === 1 ? 10 : 1,
  }));
  const greenStyle = useAnimatedStyle(() => ({ opacity: greenOpacity.value }));
  const redStyle = useAnimatedStyle(() => ({ opacity: redOpacity.value }));

  return (
    <GestureDetector gesture={pan}>
      <Animated.View
        accessibilityLabel={label}
        style={[styles.tile, { width: layout.tileWidth, height: layout.tileHeight }, placedColumn !== null && styles.tilePlaced, completed && styles.tileCompleted, animatedStyle]}
      >
        <Animated.View pointerEvents="none" style={[styles.shade, styles.greenShade, greenStyle]} />
        <Animated.View pointerEvents="none" style={[styles.shade, styles.redShade, redStyle]} />
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
  // "## Q&A 11" train-style shades (copied from train.tsx): soft halo around the tile (iOS glow, Android tint only).
  shade: { position: 'absolute', left: -8, top: -8, right: -8, bottom: -8, borderRadius: 18, shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.9, shadowRadius: 10 },
  greenShade: { backgroundColor: 'rgba(60, 200, 90, 0.45)', shadowColor: '#2EBD4F' },
  redShade: { backgroundColor: 'rgba(235, 60, 60, 0.45)', shadowColor: '#E53935' },
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
  homeButtonBottom: { alignSelf: 'center', marginBottom: 24 },
  homeButtonLabel: { fontSize: 22, fontWeight: 'bold', color: '#4C4536' },
});
