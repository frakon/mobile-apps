// Game screen — "pictures, one sentence" rounds for the field passed as route param.
// Ported from the original single-screen App.tsx (see git history); behavior preserved:
// auto-play audio, replay button, red/green tint feedback, first-mistake scoring,
// end screen with counts + replay. New: 2-image or 4-image regime (2×2 grid) per the
// setting requested in _TreninkPorozumeni_Fields123_PROMPTS.md (section "User request").
// Layout: controls (pause, round counter, replay) sit in a vertical column LEFT of the
// pictures; the 4-image regime shows two columns of two pictures ("User follow-up request 15").
// New: spoken "why it is wrong" explanation on a wrong tap — red tint kept for the whole
// explanation playback (see _TreninkPorozumeni_Fields123_PROMPTS.md, section "User
// follow-up request — spoken explanation of a wrong picture"). Per "User follow-up
// request 19": EVERY picture is tappable at ALL times (a second wrong tap switches the red
// tint + explanation to the newly tapped picture; the correct tap advances as before), and
// a GLOBAL SINGLE-AUDIO RULE holds — at most one audio plays at any time, enforced by
// stopAllAudio() invoked before EVERY audio start (sentence auto-play, replay, explanation).
// Per "User follow-up request 21": the field is split into two sub-tests of 10 (route params
// field + part), and every player plays at the persisted speech speed (setPlaybackRate).

import { Asset } from 'expo-asset';
import { createAudioPlayer, setAudioModeAsync } from 'expo-audio';
import { useLocalSearchParams, useNavigation, useRouter } from 'expo-router';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FieldId } from '../src/items';
import { clearPausedGame, consumePausedGame, savePausedGame } from '../src/pausedGame';
import { buildRoundPlan, collectRoundAssetModules, explanationForSlot, GameRound, Regime, TestPart } from '../src/rounds';
import { loadRegime, loadSpeechSpeedPercent } from '../src/settings';

const FEEDBACK_DURATION_MILLISECONDS = 500;
// Safety cap for the explanation playback: if the finish event never arrives (corrupt file,
// audio session hiccup), unblock the game after this long instead of staying stuck.
const EXPLANATION_SAFETY_TIMEOUT_MILLISECONDS = 15000;
// "Must have started playing" watchdog (see _TreninkPorozumeni_Fields123_PROMPTS.md,
// "User follow-up request 7"): expo-audio emits `status.error` ONLY when the native item
// actually FAILS (iOS: AVPlayerItem.status == .failed, node_modules/expo-audio/ios/
// AudioPlayer.swift setupPublisher; Android: onPlayerError, .../android/.../AudioPlayer.kt).
// An asset that merely never finishes loading (e.g. Metro/Expo Go still downloading the mp3
// over the LAN/VPN link, or a stalled fetch) keeps the item in the "unknown"/buffering state
// forever: NO error, NO didJustFinish — the old code then held the red tint and blocked taps
// for the full 15 s. This watchdog checks shortly after play() whether playback truly started
// (isLoaded && playing) and, if not, falls back to the plain 500 ms tint. The 15 s cap stays
// as the last resort for audio that DID start but never reports finishing.
const EXPLANATION_START_WATCHDOG_MILLISECONDS = 2500;

const VALID_FIELDS: FieldId[] = ['field51', 'field52', 'field53'];

export default function GameScreen() {
  const router = useRouter();
  const navigation = useNavigation();
  const params = useLocalSearchParams<{ field?: string; part?: string; resume?: string }>();
  const resumeRequested = !Array.isArray(params.resume) && params.resume === '1';
  const fieldIsValid = !Array.isArray(params.field) && VALID_FIELDS.includes(params.field as FieldId);
  const field: FieldId = fieldIsValid ? (params.field as FieldId) : 'field51';
  // Sub-test part ("User follow-up request 21"): each field is split into two tests of 10.
  // Backward-safe fallback: a missing/invalid part param (old deep link /game?field=...)
  // plays part 1 — the first 10 examples, closest to the old behavior.
  const part: TestPart = !Array.isArray(params.part) && params.part === '2' ? 2 : 1;

  // Invalid/missing field param (deep link like /game?field=xyz): go back to the field
  // selection instead of silently playing 5.1.
  useEffect(() => {
    if (!fieldIsValid) {
      router.replace('/');
    }
  }, [fieldIsValid, router]);

  const [regime, setRegime] = useState<Regime | null>(null); // null until AsyncStorage read
  // Speech speed ("User follow-up request 21"): read ONCE at game start (same pattern as the
  // regime above — a settings change mid-game applies only to the NEXT game, mirroring the
  // regime behavior; unlike the regime it does NOT invalidate a paused test, because the
  // round plan does not depend on it — a resume simply picks up the current speed).
  // null until AsyncStorage read: the sentence auto-play effect waits for it, so even the
  // very first sentence plays at the selected speed.
  const [speechRate, setSpeechRate] = useState<number | null>(null);
  useEffect(() => {
    let cancelled = false;
    loadSpeechSpeedPercent().then((percent) => {
      if (!cancelled) {
        setSpeechRate(percent / 100);
      }
    });
    return () => {
      cancelled = true;
    };
  }, []);
  const [roundPlan, setRoundPlan] = useState<GameRound[] | null>(null);
  const [roundIndex, setRoundIndex] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [wrongCount, setWrongCount] = useState(0);
  const [wrongTappedIndex, setWrongTappedIndex] = useState<number | null>(null);
  const [correctTapped, setCorrectTapped] = useState(false);
  const [audioModeReady, setAudioModeReady] = useState(false);
  const mistakeMadeThisRound = useRef(false);
  const roundAdvancePending = useRef(false); // synchronous guard against double/simultaneous taps
  // Stale-press guard (see _TreninkPorozumeni_Fields123_PROMPTS.md, section "User follow-up
  // request 3 — held tap silences the next round"): Pressable fires onPress at finger RELEASE
  // (react-native Pressability, RESPONDER_RELEASE), so a press held while the 500 ms advance
  // timer swaps the round gets its release (or a natively synthesized late click) delivered
  // AFTER the guards below were reset — it then lands as a fresh tap on the NEW round and,
  // on a distractor slot, pauses the just-started sentence player (explanation flow), leaving
  // the round silent. Every round change bumps roundGeneration; a press only counts if it
  // BEGAN (onPressIn) in the current generation.
  const roundGeneration = useRef(0);
  const pressStartGeneration = useRef(-1); // -1: no press seen yet
  const correctFeedbackTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const wrongFeedbackTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const playerRef = useRef<ReturnType<typeof createAudioPlayer> | null>(null);
  // Wrong-answer explanation playback: the red tint stays on the tapped picture for the
  // whole explanation. Per "User follow-up request 19" taps are NOT blocked while it runs:
  // any other picture tap (or the replay button) first stops this explanation via
  // stopAllAudio() and then proceeds — wrong tap switches the red + explanation, correct
  // tap advances ("request 7"). explanationPendingRef marks "an explanation is active"
  // synchronously (a ref, not state — readable mid-async, e.g. in replayAudio's post-await
  // re-check, without waiting for a re-render).
  const explanationPendingRef = useRef(false);
  const explanationPlayerRef = useRef<ReturnType<typeof createAudioPlayer> | null>(null);
  const explanationSafetyTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const explanationStartWatchdogTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const stopExplanation = useCallback(() => {
    explanationPendingRef.current = false;
    if (explanationSafetyTimer.current !== null) {
      clearTimeout(explanationSafetyTimer.current);
      explanationSafetyTimer.current = null;
    }
    if (explanationStartWatchdogTimer.current !== null) {
      clearTimeout(explanationStartWatchdogTimer.current);
      explanationStartWatchdogTimer.current = null;
    }
    const explanationPlayer = explanationPlayerRef.current;
    if (explanationPlayer !== null) {
      explanationPlayerRef.current = null;
      try {
        // pause() BEFORE remove(): remove() only schedules the native release, so on iOS a
        // playing AVPlayer could keep sounding for a moment — the user-reported overlap of
        // an explanation under the next round's sentence ("User follow-up request 19").
        explanationPlayer.pause();
      } catch {
        // Player may already be released; nothing to do.
      }
      try {
        explanationPlayer.remove();
      } catch {
        // Player may already be released; nothing to do.
      }
    }
  }, []);

  const finishExplanation = useCallback(() => {
    stopExplanation();
    setWrongTappedIndex(null); // red tint ends together with the explanation speech
  }, [stopExplanation]);

  // GLOBAL SINGLE-AUDIO RULE ("User follow-up request 19"): the ONE central "stop all
  // audio" step, invoked before EVERY audio start (sentence auto-play on round advance /
  // restart / resume, sentence replay, explanation start) and on pause/beforeRemove — at
  // most one audio may ever sound at a time. Stops + releases a running explanation and
  // pauses the sentence player (the sentence player itself is NOT released here: its
  // lifecycle belongs to the auto-play effect, and replay reuses it via seekTo(0)).
  const stopAllAudio = useCallback(() => {
    stopExplanation();
    const sentencePlayer = playerRef.current;
    if (sentencePlayer !== null) {
      try {
        sentencePlayer.pause();
      } catch {
        // Player may already be released; nothing to do.
      }
    }
  }, [stopExplanation]);

  // Fallback when no explanation is (or will be) heard: the plain 500 ms red tint.
  const showPlainWrongTint = useCallback(() => {
    if (wrongFeedbackTimer.current !== null) {
      clearTimeout(wrongFeedbackTimer.current); // re-arm so the tint gets the full duration
    }
    wrongFeedbackTimer.current = setTimeout(() => {
      wrongFeedbackTimer.current = null;
      setWrongTappedIndex(null);
    }, FEEDBACK_DURATION_MILLISECONDS);
  }, []);

  // If the child navigates away mid-audio, stop everything (the sentence player itself is
  // additionally released by its own effect's cleanup).
  useEffect(() => {
    return stopAllAudio;
  }, [stopAllAudio]);

  // Read the persisted regime, then build the round plan for the selected field — or, when
  // opened in resume mode ("Pokračuj v testu"), CONSUME the paused test and continue it with
  // the exact same rounds order, index, counts and current-round mistake flag (see
  // _TreninkPorozumeni_Fields123_PROMPTS.md, "User follow-up request 4"). The current round's
  // sentence then auto-plays again via the currentRound effect — desired.
  useEffect(() => {
    let cancelled = false;
    if (resumeRequested) {
      const paused = consumePausedGame();
      // Paused-test identity is field + part ("User follow-up request 21"): a paused
      // "5.1 ... 2" must never continue under a "5.1 ... 1" route (and vice versa).
      if (paused !== null && paused.field === field && paused.part === part) {
        // Re-validate the regime here too: the initial page's own check is asynchronous, so a
        // tap on a momentarily stale "Pokračuj v testu" button (regime just changed in
        // settings) could otherwise resume an incompatible test. Mismatch → the paused test is
        // invalid; start fresh (the store is already consumed = cleared).
        loadRegime().then((storedRegime) => {
          if (cancelled) {
            return;
          }
          if (storedRegime === paused.regime) {
            setRegime(paused.regime);
            setRoundPlan(paused.roundPlan);
            setRoundIndex(paused.roundIndex);
            setCorrectCount(paused.correctCount);
            setWrongCount(paused.wrongCount);
            mistakeMadeThisRound.current = paused.mistakeMadeThisRound;
          } else {
            setRegime(storedRegime);
            setRoundPlan(buildRoundPlan(field, storedRegime, part));
          }
        });
        return () => {
          cancelled = true;
        };
      }
      // Empty/mismatched store (stale deep link): fall through to a fresh start of this field.
    } else {
      clearPausedGame(); // starting a new test invalidates any paused one
    }
    loadRegime().then((storedRegime) => {
      if (!cancelled) {
        setRegime(storedRegime);
        setRoundPlan(buildRoundPlan(field, storedRegime, part));
      }
    });
    return () => {
      cancelled = true;
    };
  }, [field, part, resumeRequested]);

  const finished = roundPlan !== null && roundIndex >= roundPlan.length;
  const currentRound = roundPlan === null || finished ? null : roundPlan[roundIndex];

  // Asset prefetching of the upcoming rounds (see _TreninkPorozumeni_Fields123_PROMPTS.md,
  // section "User follow-up request 16 — prefetch upcoming rounds' assets"): in Expo Go with
  // a remote Metro every FIRST use of an image/mp3 is an HTTP fetch, which caused the
  // user-visible stalls the lazy load + watchdog only mitigate. On every round start (and on
  // plan build / resume, since roundIndex is a dependency too) fire-and-forget download of the
  // assets of rounds [roundIndex .. roundIndex + 2]: the next TWO rounds per the request, plus
  // the CURRENT round so the very first round (and the restored round after a resume) gets its
  // explanation audios warmed as well — its sentence/images still load the old way, they are
  // being displayed/played right now anyway. Asset.fromModule(id).downloadAsync() works
  // uniformly for images and audio module ids; in a release build the assets are already
  // bundled and it resolves immediately. Failures are IGNORED — prefetching is an optimization
  // only, the existing lazy load + watchdog remain the fallback, and it must never block the
  // UI or the round advance. The Set de-duplicates per session so nothing is fetched twice.
  const prefetchedModuleIdsRef = useRef<Set<number>>(new Set());
  useEffect(() => {
    if (roundPlan === null) {
      return;
    }
    for (let index = roundIndex; index <= roundIndex + 2 && index < roundPlan.length; index++) {
      for (const moduleId of collectRoundAssetModules(roundPlan[index])) {
        if (prefetchedModuleIdsRef.current.has(moduleId)) {
          continue;
        }
        prefetchedModuleIdsRef.current.add(moduleId);
        try {
          Asset.fromModule(moduleId)
            .downloadAsync()
            .catch(() => {
              // Silent by design: the round will lazy-load the asset as before.
            });
        } catch {
          // fromModule threw synchronously (unknown module id): equally silent.
        }
      }
    }
  }, [roundPlan, roundIndex]);

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

  // Speech speed ("User follow-up request 21"): the existing mp3s are played slower/faster —
  // expo-audio AudioPlayer.setPlaybackRate(rate, 'high') (node_modules/expo-audio/build/
  // AudioModule.types.d.ts) with the 'high' PitchCorrectionQuality; shouldCorrectPitch keeps
  // the voice at its natural pitch while only the tempo changes. Applied right after creating
  // EVERY player (sentence AND explanation).
  const applySpeechRate = useCallback(
    (player: ReturnType<typeof createAudioPlayer>) => {
      try {
        player.shouldCorrectPitch = true;
        player.setPlaybackRate(speechRate ?? 1, 'high');
      } catch {
        // Rate is a nicety: if the native call fails, play at natural speed.
      }
    },
    [speechRate]
  );

  // Auto-play the sentence audio whenever a new round starts (once the audio mode is applied
  // and the speech-speed setting is loaded — so even the FIRST sentence plays at the set speed).
  useEffect(() => {
    if (!currentRound || !audioModeReady || speechRate === null) {
      return;
    }
    stopAllAudio(); // single-audio rule ("request 19"): e.g. a still-running explanation must not sound under the new sentence
    const player = createAudioPlayer(currentRound.example.audio);
    playerRef.current = player;
    applySpeechRate(player);
    player.play();
    return () => {
      playerRef.current = null;
      try {
        player.pause(); // remove() alone does not stop sound (expo-audio only unregisters the player) — single-audio rule ("request 19")
      } catch {
        // already released
      }
      player.remove();
    };
  }, [currentRound, audioModeReady, speechRate, applySpeechRate, stopAllAudio]);

  const replayAudio = useCallback(async () => {
    const player = playerRef.current;
    if (!player || roundAdvancePending.current) {
      return; // no replay during the green-feedback window: the old sentence would keep sounding under the next round's sentence ("request 19")
    }
    // Single-audio rule ("request 19"): replay is an audio START, so it stops a running
    // explanation first (the red tint ends with its speech, hence finishExplanation).
    finishExplanation();
    try {
      await player.seekTo(0); // must complete before play(), otherwise iOS may play at end-of-item (silence)
    } catch {
      return; // player was likely removed meanwhile
    }
    if (playerRef.current === player && !explanationPendingRef.current && !roundAdvancePending.current) {
      // the pending re-check guards a wrong tap made while seekTo was awaiting: the explanation
      // has paused the sentence player and playing it now would overlap the explanation speech
      player.play();
    }
  }, [finishExplanation]);

  const handlePictureTap = useCallback(
    (index: number) => {
      // roundAdvancePending is checked/set synchronously: React state (correctTapped) alone
      // cannot block two taps delivered before a re-render (double/two-finger taps by children).
      if (!currentRound || correctTapped || roundAdvancePending.current) {
        return;
      }
      // "User follow-up request 19": while a "why it is wrong" speech runs, EVERY picture
      // stays tappable (blocking the wrong ones let the child find the correct picture by
      // elimination). A tap on ANOTHER wrong picture un-reds the former one, stops its
      // explanation (stopAllAudio below) and starts the new red + explanation immediately;
      // a re-tap of the SAME red picture restarts its explanation from the beginning (same
      // code path — chosen over ignoring so the child can hear the explanation again); the
      // CORRECT picture stops the explanation and advances the round like a normal correct
      // tap ("request 7"; the round is already scored wrong via mistakeMadeThisRound).
      // Ignore a release/click of a press that began in a previous round (finger held across
      // the round advance) — see the stale-press guard comment at the ref declarations and
      // _TreninkPorozumeni_Fields123_PROMPTS.md, "User follow-up request 3".
      if (pressStartGeneration.current !== roundGeneration.current) {
        return;
      }
      if (index === currentRound.correctIndex) {
        // Correct tap: stop ALL audio immediately (a running explanation and any sentence
        // remainder — single-audio rule, "request 19") and clear the red tint so only the
        // green feedback shows ("User follow-up request 7"). Idempotent no-ops otherwise.
        stopAllAudio();
        setWrongTappedIndex(null);
        if (wrongFeedbackTimer.current !== null) {
          clearTimeout(wrongFeedbackTimer.current); // a pending 500 ms tint timer has nothing left to clear
          wrongFeedbackTimer.current = null;
        }
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
          setWrongTappedIndex(null);
          mistakeMadeThisRound.current = false;
          roundAdvancePending.current = false;
          roundGeneration.current += 1; // presses that began before this advance are now stale
          setRoundIndex((currentIndex) => currentIndex + 1);
        }, FEEDBACK_DURATION_MILLISECONDS);
      } else {
        mistakeMadeThisRound.current = true; // scored wrong on FIRST mistake only; further wrong taps do not re-score ("request 19")
        // Single-audio rule + tap switching ("request 19"): stop whatever sounds right now —
        // the sentence, or the PREVIOUS red picture's explanation (its timers, watchdog and
        // player included) — BEFORE this tap's own explanation starts. The former red clears
        // via setWrongTappedIndex(index) replacing it (only one red at a time by design).
        stopAllAudio();
        setWrongTappedIndex(index);
        if (wrongFeedbackTimer.current !== null) {
          clearTimeout(wrongFeedbackTimer.current); // re-arm so a repeated wrong tap gets the full tint duration
        }
        // Spoken "why it is wrong" explanation: red tint stays for the whole playback; when
        // the audio is missing (null) or fails, fall back to the plain 500 ms tint.
        const explanation = explanationForSlot(currentRound.example, currentRound.slots[index].kind);
        let explanationStarted = false;
        if (explanation !== null && explanation.audio !== null) {
          try {
            explanationPendingRef.current = true; // set AFTER stopAllAudio above (which resets it) and BEFORE anything can throw
            const explanationPlayer = createAudioPlayer(explanation.audio);
            explanationPlayerRef.current = explanationPlayer;
            applySpeechRate(explanationPlayer); // speech-speed setting applies to explanations too ("request 21")
            explanationPlayer.addListener('playbackStatusUpdate', (status) => {
              if (explanationPlayerRef.current !== explanationPlayer) {
                return; // stale listener of an already-released player
              }
              if (status.didJustFinish) {
                finishExplanation();
              } else if (status.error !== null && status.error !== undefined) {
                // Asynchronous load/playback failure (missing/corrupt file): fall back to the
                // old 500 ms tint instead of locking wrong taps until the 15 s safety timeout.
                stopExplanation();
                showPlainWrongTint();
              }
            });
            explanationPlayer.play();
            // Safety cap + start watchdog are RE-ARMED per explanation: the previous
            // explanation's timers were cleared by stopAllAudio → stopExplanation above.
            explanationSafetyTimer.current = setTimeout(finishExplanation, EXPLANATION_SAFETY_TIMEOUT_MILLISECONDS);
            // "Must have started playing" watchdog ("User follow-up request 7"): a source that
            // never finishes loading emits NEITHER didJustFinish NOR status.error (evidence in
            // the constant's comment above), which used to leave the red tint + tap block for
            // the whole 15 s with no speech. If playback has not truly started by now, give up
            // and fall back to the plain 500 ms tint. `isLoaded && playing` are synchronous
            // native properties (expo-audio AudioModule Property definitions); on Android
            // `playing` mirrors the INTENDED state while buffering, but `isLoaded` is false
            // until STATE_READY, so a stuck-buffering player is caught on both platforms.
            explanationStartWatchdogTimer.current = setTimeout(() => {
              explanationStartWatchdogTimer.current = null;
              if (explanationPlayerRef.current !== explanationPlayer) {
                return; // explanation already ended/stopped meanwhile
              }
              let startedPlaying = false;
              try {
                startedPlaying = explanationPlayer.isLoaded && explanationPlayer.playing;
              } catch {
                // native player already released → treat as not playing
              }
              if (!startedPlaying) {
                stopExplanation();
                showPlainWrongTint();
              }
            }, EXPLANATION_START_WATCHDOG_MILLISECONDS);
            explanationStarted = true;
          } catch {
            stopExplanation(); // creation/playback failed → plain 500 ms tint below (also resets explanationPendingRef)
          }
        }
        if (!explanationStarted) {
          showPlainWrongTint();
        }
      }
    },
    [currentRound, correctTapped, applySpeechRate, finishExplanation, stopExplanation, stopAllAudio, showPlainWrongTint]
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
    roundGeneration.current += 1; // restart also invalidates presses begun before it
    stopAllAudio(); // single-audio rule: nothing may keep sounding into the restarted game
    setRoundPlan(regime === null ? null : buildRoundPlan(field, regime, part));
    setRoundIndex(0);
    setCorrectCount(0);
    setWrongCount(0);
    setWrongTappedIndex(null);
    setCorrectTapped(false);
    mistakeMadeThisRound.current = false;
  }, [field, part, regime, stopAllAudio]);

  // Back with a history guard: opened cold via deep link there is nothing to pop, so
  // replace with the field-selection page instead of a no-op (iOS) / app exit (Android).
  const goBackToSelection = useCallback(() => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/');
    }
  }, [router]);

  // Pause on leave (see _TreninkPorozumeni_Fields123_PROMPTS.md, "User follow-up request 4"):
  // leaving a RUNNING test does not stop it, it pauses it — the state is saved to the
  // module-level store (src/pausedGame.ts) so the initial page can offer "Pokračuj v testu".
  // Saved from the navigation 'beforeRemove' event, so the pause button, the iOS swipe-back
  // gesture and the Android hardware back all pause identically. The snapshot lives in a ref
  // (re-assigned every render) so a single listener always sees the latest state.
  // Nothing is saved when there is nothing to continue: plan not built yet, empty field, or
  // the finished/score screen. Pausing during the 500 ms correct-feedback saves the ALREADY
  // SCORED advance (index + 1, mistake flag reset) so the round cannot be scored twice.
  const pauseSnapshotRef = useRef<() => void>(() => {});
  pauseSnapshotRef.current = () => {
    if (roundPlan === null || regime === null || roundPlan.length === 0 || !fieldIsValid) {
      return;
    }
    const advancePending = roundAdvancePending.current;
    const effectiveRoundIndex = advancePending ? roundIndex + 1 : roundIndex;
    if (effectiveRoundIndex >= roundPlan.length) {
      return; // finished (or finishing) test — nothing to continue, no paused test created
    }
    savePausedGame({
      field,
      part, // sub-test identity ("User follow-up request 21")
      regime,
      roundPlan,
      roundIndex: effectiveRoundIndex,
      correctCount,
      wrongCount,
      // A mistake made in the current round survives the pause; a pending advance means the
      // next round starts fresh.
      mistakeMadeThisRound: advancePending ? false : mistakeMadeThisRound.current,
    });
  };
  // Timers are cleared AFTER the snapshot (the snapshot reads roundAdvancePending): with a
  // native-stack the React component stays mounted for the exit animation (~350 ms), so a
  // correctFeedbackTimer armed inside the 500 ms window would otherwise still fire, advance
  // the round and briefly auto-play the NEXT sentence while leaving. Same for the wrong-tint
  // timer and the explanation (its safety/watchdog timers) — nothing may fire after the pause.
  const clearPendingTimersRef = useRef<() => void>(() => {});
  clearPendingTimersRef.current = () => {
    if (correctFeedbackTimer.current !== null) {
      clearTimeout(correctFeedbackTimer.current);
      correctFeedbackTimer.current = null;
    }
    if (wrongFeedbackTimer.current !== null) {
      clearTimeout(wrongFeedbackTimer.current);
      wrongFeedbackTimer.current = null;
    }
    stopAllAudio();
  };
  useEffect(() => {
    return navigation.addListener('beforeRemove', () => {
      pauseSnapshotRef.current();
      clearPendingTimersRef.current();
    });
  }, [navigation]);

  // Pause button handler: a running explanation is stopped cleanly (the round stays current,
  // the mistake flag is preserved by the snapshot above), then pop back to the field selection.
  const pauseAndGoBack = useCallback(() => {
    stopAllAudio();
    goBackToSelection();
  }, [goBackToSelection, stopAllAudio]);

  if (roundPlan === null || regime === null || speechRate === null || !fieldIsValid) {
    return <SafeAreaView style={styles.container} />; // brief blank while AsyncStorage loads (or while redirecting an invalid field param)
  }

  if (roundPlan.length === 0) {
    // Field without examples yet (its start-page button is disabled, but a deep link can
    // still land here): a friendly empty state instead of a fake "Hotovo!" score screen.
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.scoreTitle}>Zatím tu nejsou žádné příklady</Text>
        <Pressable style={styles.homeButton} onPress={goBackToSelection}>
          <Text style={styles.homeButtonLabel}>Zpět na výběr</Text>
        </Pressable>
      </SafeAreaView>
    );
  }

  if (finished || !currentRound) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.scoreTitle}>Hotovo!</Text>
        <Text style={styles.scoreLine}>Správně: {correctCount}</Text>
        <Text style={styles.scoreLine}>Špatně: {wrongCount}</Text>
        <Pressable style={styles.restartButton} onPress={restartGame}>
          <Text style={styles.restartButtonLabel}>Hrát znovu</Text>
        </Pressable>
        <Pressable style={styles.homeButton} onPress={goBackToSelection}>
          <Text style={styles.homeButtonLabel}>Zpět na výběr</Text>
        </Pressable>
      </SafeAreaView>
    );
  }

  const renderPicture = (index: number) => {
    const showGreen = correctTapped && index === currentRound.correctIndex;
    const showRed = wrongTappedIndex === index;
    return (
      <Pressable
        key={index}
        style={styles.pictureSlot}
        onPressIn={() => {
          pressStartGeneration.current = roundGeneration.current; // press begins in THIS round
        }}
        onPress={() => handlePictureTap(index)}
      >
        <Image source={currentRound.slots[index].image} style={styles.picture} resizeMode="contain" />
        {showRed && <View style={[styles.pictureOverlay, styles.redOverlay]} />}
        {showGreen && (
          <View style={[styles.pictureOverlay, styles.greenOverlay]}>
            <Text style={styles.checkmark}>✓</Text>
          </View>
        )}
      </Pressable>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Controls in a VERTICAL column to the LEFT of the pictures (was a top bar) so the
          pictures get the full screen height in landscape — see
          _TreninkPorozumeni_Fields123_PROMPTS.md, "User follow-up request 15". SafeAreaView
          keeps the column clear of the landscape notch/home-indicator side insets. */}
      <View style={styles.gameRow}>
        <View style={styles.controlsColumn}>
          {/* Pause-and-go-back button (not a stop): saves the running test and returns to the
              field selection, which then shows "Pokračuj v testu" — see
              _TreninkPorozumeni_Fields123_PROMPTS.md, "User follow-up request 4". Shown as a
              back arrow + pause glyph pair so it reads "go back AND pause", not pause alone
              ("User follow-up request 17"). */}
          <Pressable style={styles.pauseButton} onPress={pauseAndGoBack} accessibilityLabel="Přestávka a zpět">
            <Text style={styles.pauseIcon}>◀⏸</Text>
          </Pressable>
          <Text style={styles.progressLabel}>
            {roundIndex + 1} / {roundPlan.length}
          </Text>
          <Pressable style={styles.replayButton} onPress={replayAudio} accessibilityLabel="Přehrát znovu">
            <Text style={styles.replayIcon}>🔊</Text>
          </Pressable>
        </View>
        {regime === 2 ? (
          // 2-image regime: target + grammatical distractor side by side. The left controls
          // column benefits this regime too: the app is landscape-only, so picture size is
          // height-limited and removing the old top bar makes the pictures bigger here as well.
          <View style={styles.picturesRow}>{[0, 1].map(renderPicture)}</View>
        ) : (
          // 4-image regime: two COLUMNS of two ("request 15": 2nd column = first two
          // pictures, 3rd column = last two) instead of the old two rows of two.
          <View style={styles.picturesGrid}>
            <View style={styles.picturesGridColumn}>{[0, 1].map(renderPicture)}</View>
            <View style={styles.picturesGridColumn}>{[2, 3].map(renderPicture)}</View>
          </View>
        )}
      </View>
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
  // Controls left of the pictures ("request 15"): the whole game is one horizontal row —
  // controls column + pictures — so the pictures use the full available height in landscape.
  gameRow: {
    flex: 1,
    alignSelf: 'stretch',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  controlsColumn: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 24,
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
  // "Pause and go back" pill ("request 17"): wide enough for the two-glyph "◀⏸" pair,
  // width matched to the replay button below so the controls column reads as one family.
  pauseButton: {
    backgroundColor: '#FFE9A8',
    borderRadius: 28,
    width: 72,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pauseIcon: {
    fontSize: 24,
    color: '#4C4536', // text glyphs (not emoji) need an explicit friendly dark-brown color
  },
  picturesRow: {
    flexDirection: 'row',
    gap: 24,
    flex: 1,
    alignSelf: 'stretch',
    maxHeight: 640, // tablet cap (was 560; the freed top-bar height goes to the pictures)
  },
  // 4-image regime, "request 15": pictures as two COLUMNS of two (grid row = the two
  // columns side by side), so together with the controls column the screen reads:
  // controls | pictures 0+1 | pictures 2+3.
  picturesGrid: {
    flexDirection: 'row',
    flex: 1,
    alignSelf: 'stretch',
    gap: 12,
    maxHeight: 640,
  },
  picturesGridColumn: {
    flexDirection: 'column',
    gap: 12,
    flex: 1,
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
