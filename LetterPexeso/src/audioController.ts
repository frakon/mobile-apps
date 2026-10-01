// Central audio controller — the ONLY place in the app that creates, plays, pauses or
// releases audio players. See _TreninkPorozumeni_Fields123_PROMPTS.md, section "User
// follow-up request 22 — every play: latest request wins".
//
// "Latest request wins": every playAudio() call and every stopAllAudio() call bumps a
// monotonically increasing play token FIRST (synchronously), then stops everything that is
// playing or pending (pause() BEFORE remove() — remove() alone does not stop the sound, see
// "request 19"). Every asynchronous continuation (listener events, watchdog timers)
// re-checks its own token and does nothing when a newer request has arrived meanwhile — a
// stale continuation can never start, stop or report on a newer sound.
//
// Root-cause fix ("request 22"): every player is created with keepAudioSessionActive: true.
// Without it, expo-audio's iOS pause() (node_modules/expo-audio/ios/AudioModule.swift,
// Function("pause") → deactivateSession()) schedules AVAudioSession.setActive(false) 100 ms
// later unless SOME player then reports timeControlStatus == .playing. A just-created player
// whose mp3 is still loading is only "waiting to play", so pausing the old sound and starting
// a new one deactivated the session under the new player → HYPOTHESIS (code-derived, not
// confirmed on a device): the new sound stayed silent.

import { AudioSource, createAudioPlayer, setAudioModeAsync } from 'expo-audio';

type AudioPlayerInstance = ReturnType<typeof createAudioPlayer>;

// "Must have started playing" watchdog ("User follow-up request 7"): expo-audio emits
// `status.error` only when the native item FAILS; a source that never finishes loading emits
// neither error nor didJustFinish. Checked shortly after play(): isLoaded && playing.
const START_WATCHDOG_MILLISECONDS = 2500;

export type PlayAudioOptions = {
  // Identity of the sound (e.g. "sentence:3"); used only for logging — every request gets a fresh player.
  key: string;
  // The requesting screen instance (see stopAudioIfOwnedBy).
  owner?: object;
  // Speech speed ("User follow-up request 21"): pitch-corrected setPlaybackRate(rate, 'high').
  rate: number;
  // Called (only while this play is still the latest) when the sound finished normally.
  onFinish?: () => void;
  // Called (only while this play is still the latest) when the sound failed: creation threw,
  // status.error arrived, or the start watchdog found it not playing. The sound is already
  // stopped when this runs.
  onFailure?: () => void;
  // Watchdog: if not isLoaded && playing after 2.5 s → stop + onFailure. Callers without an
  // onFailure fallback leave it off.
  startWatchdog?: boolean;
  // With startWatchdog: instead of failing, retry ONCE with a fresh player (the sentence;
  // "User follow-up request 22 (verbatim) — every play: latest request wins").
  retryOnceOnStartFailure?: boolean;
  // Internal: set on the single retry. Its watchdog ONLY logs (console.warn) and never stops
  // the retry: a slow sentence that plays late beats silence (verification AudioFix R3-1).
  isStartFailureRetry?: boolean;
  // Last-resort cap (e.g. 15 s for explanations): treated as a finish if no finish arrived.
  safetyTimeoutMilliseconds?: number;
};

type CurrentSound = {
  token: number;
  source: AudioSource;
  player: AudioPlayerInstance;
  subscription: { remove: () => void } | null;
  timers: ReturnType<typeof setTimeout>[];
  options: PlayAudioOptions;
  // Set from status events once the sound was seen playing, advanced (currentTime > 0) or
  // finished: a sentence that ended naturally near 2.5 s (didJustFinish still in flight) must
  // never be retried (verification AudioFix R2, N1/F2).
  started: boolean;
};

let latestToken = 0;
let current: CurrentSound | null = null;

function clearTimers(sound: CurrentSound): void {
  for (const timer of sound.timers) {
    clearTimeout(timer);
  }
  sound.timers = [];
}

// Pause FIRST, then unsubscribe, remove() and release(). Every step tolerates an already
// released native player.
function releaseSound(sound: CurrentSound): void {
  clearTimers(sound);
  try {
    sound.player.pause();
  } catch {
    // already released
  }
  try {
    sound.subscription?.remove();
  } catch {
    // already removed
  }
  try {
    sound.player.remove(); // unregisters from expo-audio's registry only
  } catch {
    // already released
  }
  try {
    sound.player.release(); // frees the native AVPlayer / ExoPlayer now instead of at JS GC
  } catch {
    // already released
  }
}

// iOS: until setAudioModeAsync({ playsInSilentMode: true }) runs, expo-audio sets no session category, so the
// AVAudioSession stays at the iOS default .soloAmbient, which the ring/silent switch mutes (PexesoSoundFix: the
// pexeso never called it -> silent card sounds). Called ONCE per app run (memoized promise): screens call it on
// mount, and playAudio() awaits it before the first play, so no screen can forget it.
let silentModePromise: Promise<void> | null = null;
let silentModeSettled = false;

export function enablePlaybackInSilentMode(): Promise<void> {
  if (silentModePromise === null) {
    silentModePromise = setAudioModeAsync({ playsInSilentMode: true }).then(
      () => {
        silentModeSettled = true;
      },
      (error: unknown) => {
        // Not retried; playback proceeds anyway (audible at least with the switch on ring).
        console.warn('audioController: setAudioModeAsync({ playsInSilentMode: true }) failed', error);
        silentModeSettled = true;
      }
    );
  }
  return silentModePromise;
}

// Test-only: forget the memoized audio-mode call (jest module state survives between tests of one file).
export function resetSilentModeForTests(): void {
  silentModePromise = null;
  silentModeSettled = false;
}

// Stops everything that sounds or is pending, and invalidates every pending continuation.
// Used before every play (internally), on correct tap, restart, pause/beforeRemove, unmount.
export function stopAllAudio(): void {
  latestToken += 1;
  const sound = current;
  current = null;
  if (sound !== null) {
    releaseSound(sound);
  }
}

// Stops the current sound only if it was requested by `owner` (one game screen instance): a
// cleanup of a leaving screen (unmount, round change) must never silence the sound of another
// (e.g. a resumed) screen. "User follow-up request 22 (verbatim) — every play: latest request wins".
export function stopAudioIfOwnedBy(owner: object): void {
  if (current !== null && current.options.owner === owner) {
    stopAllAudio();
  }
}

function applyRate(player: AudioPlayerInstance, rate: number): void {
  try {
    player.shouldCorrectPitch = true;
    player.setPlaybackRate(rate, 'high');
  } catch {
    // Rate is a nicety: if the native call fails, play at natural speed.
  }
}

function failIfCurrent(token: number): void {
  if (current === null || current.token !== token) {
    return;
  }
  const onFailure = current.options.onFailure;
  stopAllAudio();
  onFailure?.();
}

function finishIfCurrent(token: number): void {
  if (current === null || current.token !== token) {
    return;
  }
  const onFinish = current.options.onFinish;
  stopAllAudio();
  onFinish?.();
}

// Start failure (watchdog, status.error before start, creation or play() threw): the sentence
// gets ONE retry with a FRESH player (still this same latest request: callers check the token
// first). The retry's watchdog only logs (see armTimers); everything else fails via onFailure.
// Returns the token of the retry when one was started (verification AudioFix R3-4).
function handleStartFailure(sound: CurrentSound): number | undefined {
  if (sound.options.retryOnceOnStartFailure === true) {
    return playAudio(sound.source, { ...sound.options, retryOnceOnStartFailure: false, isStartFailureRetry: true });
  }
  if (sound.options.isStartFailureRetry === true) {
    console.warn(`audioController: retry of "${sound.options.key}" did not start either; giving up`);
  }
  failIfCurrent(sound.token);
  return undefined;
}

function armTimers(sound: CurrentSound): void {
  const token = sound.token;
  if (sound.options.startWatchdog === true) {
    sound.timers.push(
      setTimeout(() => {
        if (current === null || current.token !== token) {
          return; // a newer request already won
        }
        let startedPlaying = false;
        try {
          // On Android `playing` mirrors the INTENDED state while buffering, but `isLoaded`
          // is false until STATE_READY, so a stuck-buffering player is caught on both platforms.
          startedPlaying = sound.player.isLoaded && sound.player.playing;
        } catch {
          // native player already released → treat as not playing
        }
        const isSentenceStartCheck =
          sound.options.retryOnceOnStartFailure === true || sound.options.isStartFailureRetry === true;
        if (!startedPlaying && isSentenceStartCheck) {
          // Sentence only (the explanation check of "request 7" stays isLoaded && playing):
          // an already advanced or finished sentence counts as started.
          startedPlaying = sound.started;
          try {
            startedPlaying = startedPlaying || sound.player.currentTime > 0;
          } catch {
            // native player already released → keep the event-derived flag
          }
        }
        if (!startedPlaying && sound.options.isStartFailureRetry === true) {
          // The retry is only logged, never stopped: late playback beats silence (AudioFix R3-1).
          console.warn(`audioController: retry of "${sound.options.key}" has not started after ${START_WATCHDOG_MILLISECONDS} ms; still waiting`);
        } else if (!startedPlaying) {
          handleStartFailure(sound);
        }
      }, START_WATCHDOG_MILLISECONDS)
    );
  }
  if (sound.options.safetyTimeoutMilliseconds !== undefined) {
    sound.timers.push(setTimeout(() => finishIfCurrent(token), sound.options.safetyTimeoutMilliseconds));
  }
}

// Starts `source`, stopping everything else first. Returns the play token of this request (the
// retry's token when a synchronous start-failure retry was started).
// Always a FRESH player per request (no player re-use / seekTo replay): a re-used player's
// in-flight didJustFinish of the previous playback could kill the replay, and a re-used
// still-loading player had no watchdog during seekTo. _TreninkPorozumeni_Fields123_PROMPTS.md,
// "User follow-up request 22 (verbatim) — every play: latest request wins".
export function playAudio(source: AudioSource, options: PlayAudioOptions): number {
  stopAllAudio(); // bumps the token and releases the previous sound (pause, then remove)
  const token = latestToken;
  let player: AudioPlayerInstance;
  try {
    // keepAudioSessionActive: see the root-cause note at the top of this file.
    player = createAudioPlayer(source, { keepAudioSessionActive: true });
  } catch (error) {
    console.warn(`audioController: createAudioPlayer for "${options.key}" failed`, error);
    if (options.retryOnceOnStartFailure === true) {
      // Same single retry as the other start failures (verification AudioFix R3-3).
      return playAudio(source, { ...options, retryOnceOnStartFailure: false, isStartFailureRetry: true });
    }
    options.onFailure?.();
    return token;
  }
  const sound: CurrentSound = { token, source, player, subscription: null, timers: [], options, started: false };
  current = sound;
  try {
    applyRate(player, options.rate);
    sound.subscription = player.addListener('playbackStatusUpdate', (status) => {
      if (current !== sound) {
        return; // stale listener of an already-released player
      }
      if (status.playing || status.currentTime > 0 || status.didJustFinish) {
        sound.started = true;
      }
      if (status.didJustFinish) {
        finishIfCurrent(sound.token);
      } else if (status.error !== null && status.error !== undefined) {
        if (!sound.started) {
          handleStartFailure(sound); // not started yet → the sentence's single retry (AudioFix R3-2)
        } else {
          failIfCurrent(sound.token);
        }
      }
    });
  } catch (error) {
    console.warn(`audioController: preparing "${options.key}" failed`, error);
    if (current === sound) {
      // the sentence retries once; others fail via onFailure
      return handleStartFailure(sound) ?? token;
    }
    return token;
  }
  if (silentModeSettled) {
    return startPlayback(sound) ?? token;
  }
  // First play(s) of the app run: wait for the silent-mode audio session, then start unless a newer request won.
  // Raced against a timeout: if setAudioModeAsync hangs, the first sound must still play (PexesoSoundFix).
  let silentModeTimer: ReturnType<typeof setTimeout> | undefined;
  const silentModeTimeout = new Promise<void>((resolve) => {
    silentModeTimer = setTimeout(() => {
      console.warn(`audioController: enabling silent-mode playback timed out after ${SILENT_MODE_WAIT_TIMEOUT_MS} ms; playing "${options.key}" anyway`);
      resolve();
    }, SILENT_MODE_WAIT_TIMEOUT_MS);
  });
  void Promise.race([enablePlaybackInSilentMode(), silentModeTimeout]).then(() => {
    clearTimeout(silentModeTimer);
    if (current === sound) {
      startPlayback(sound);
    }
  });
  return token;
}

const SILENT_MODE_WAIT_TIMEOUT_MS = 1000;

// play() + watchdog/safety timers. Returns the retry's token when a synchronous start-failure retry was started.
function startPlayback(sound: CurrentSound): number | undefined {
  try {
    sound.player.play();
    armTimers(sound);
  } catch (error) {
    console.warn(`audioController: play() of "${sound.options.key}" failed`, error);
    if (current === sound) {
      // the sentence retries once; others fail via onFailure
      return handleStartFailure(sound);
    }
  }
  return undefined;
}
