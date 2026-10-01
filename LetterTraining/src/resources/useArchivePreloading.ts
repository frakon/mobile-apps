// React hook over resourceStore.ts implementing the preferences-skill preload model for a game screen
// (`_LetterTraining_PROMPTS.md` / "## Follow-up prompt 9 — mobile-apps-preferences (backend resources, cache,
// preload)"): the REQUIRED archives (current round / whole play) are downloaded + disk-cached + unpacked hot in
// memory before the screen shows them ('ready'); the PREFETCH archives (next 5 rounds) are warmed fire-and-forget;
// archives that left the window (past rounds) are released from memory ("Once out of the round, its resources may
// be dropped"); backend unreachable and not cached -> 'offline' (the screen renders OfflineRetry).

import { useCallback, useEffect, useRef, useState } from 'react';

import { getUnpackedArchive, getUnpackedArchiveIfHot, refreshManifest, releaseUnpackedArchive } from './resourceStore';
import { UnpackedArchive } from './types';

export type ArchivePreloadStatus = 'loading' | 'ready' | 'offline';

export interface ArchivePreloadResult {
  readonly status: ArchivePreloadStatus;
  // The REQUIRED archives, fully unpacked, keyed by archive path — filled only when status === 'ready'.
  readonly archives: Readonly<Record<string, UnpackedArchive>>;
  // Retries after an offline failure ("Zkusit znovu").
  readonly retry: () => void;
}

export function useArchivePreloading(
  requiredArchives: readonly string[],
  prefetchArchives: readonly string[] = []
): ArchivePreloadResult {
  // Stable identity keys: callers may pass fresh array instances per render.
  const requiredKey = requiredArchives.join('\n');
  const prefetchKey = prefetchArchives.join('\n');

  const [retryToken, setRetryToken] = useState(0);
  const [state, setState] = useState<{ status: ArchivePreloadStatus; archives: Record<string, UnpackedArchive> }>(
    () => ({ status: requiredArchives.length === 0 ? 'ready' : 'loading', archives: {} })
  );
  // Archives this screen holds hot in memory (superset of the required ones: includes resolved prefetches).
  const heldRef = useRef<Map<string, UnpackedArchive>>(new Map());
  const disposedRef = useRef(false);
  const manifestRefreshedRef = useRef(false);

  useEffect(() => {
    disposedRef.current = false;
    return () => {
      // Leaving the screen: drop every hot archive (the compressed disk-cache copies stay).
      disposedRef.current = true;
      for (const archivePath of heldRef.current.keys()) {
        releaseUnpackedArchive(archivePath);
      }
      heldRef.current.clear();
    };
  }, []);

  useEffect(() => {
    let cancelled = false;
    const required = requiredKey === '' ? [] : requiredKey.split('\n');
    const prefetch = prefetchKey === '' ? [] : prefetchKey.split('\n');

    // Drop archives that left the preload window (past rounds) — per-word zips shared with upcoming rounds stay.
    const keep = new Set([...required, ...prefetch]);
    for (const archivePath of [...heldRef.current.keys()]) {
      if (!keep.has(archivePath)) {
        releaseUnpackedArchive(archivePath);
        heldRef.current.delete(archivePath);
      }
    }

    if (required.length === 0 && prefetch.length === 0) {
      setState({ status: 'ready', archives: {} });
      return;
    }

    const acquired = new Map<string, UnpackedArchive>();
    let failed = false;
    // Mirrors the stale-run handling below: merely cancelled (screen alive) -> hold, so a newer run reusing the
    // archive is not robbed (the unmount cleanup releases it later); otherwise release unless already held.
    const disposeFailedRunArchive = (archivePath: string, archive: UnpackedArchive) => {
      if (cancelled && !disposedRef.current) {
        heldRef.current.set(archivePath, archive);
      } else if (!heldRef.current.has(archivePath)) {
        releaseUnpackedArchive(archivePath);
      }
    };

    const run = async () => {
      // One manifest refresh per screen visit (decision 1: a changed backend version replaces stale cached copies).
      // A failure here is not fatal: getUnpackedArchive refetches the manifest / falls back to the cached archives.
      if (!manifestRefreshedRef.current) {
        try {
          await refreshManifest();
          manifestRefreshedRef.current = true;
        } catch {
          // Offline with nothing cached surfaces below as ResourceUnavailableError.
        }
      }
      try {
        if (required.some((archivePath) => !heldRef.current.has(archivePath))) {
          setState((previous) => (previous.status === 'loading' ? previous : { status: 'loading', archives: {} }));
        }
        // Per-run acquisitions (Phase G low "mid-preload failure hold"): when the Promise.all below REJECTS (e.g. the
        // VPN drops mid board load), archives this run already unpacked must not stay hot-but-unregistered.
        const unpacked = await Promise.all(
          required.map((archivePath) =>
            getUnpackedArchive(archivePath).then((archive) => {
              if (failed) {
                disposeFailedRunArchive(archivePath, archive); // resolved after the run already failed
              } else {
                acquired.set(archivePath, archive);
              }
              return archive;
            })
          )
        );
        if (cancelled || disposedRef.current) {
          // Mid-load cancellation (verification Phase C R1 M3): archives acquired by this stale run must not leak.
          // Disposed (screen left): release everything not already held — mirrors the prefetch disposal handling.
          // Merely cancelled (round swapped, screen alive): hold them instead — a newer run's window filter or the
          // unmount cleanup releases the ones that left the window (releasing here could drop archives the newer
          // run is just reusing).
          required.forEach((archivePath, index) => {
            if (disposedRef.current) {
              if (!heldRef.current.has(archivePath)) {
                releaseUnpackedArchive(archivePath);
              }
            } else {
              heldRef.current.set(archivePath, unpacked[index]);
            }
          });
          return;
        }
        const archives: Record<string, UnpackedArchive> = {};
        required.forEach((archivePath, index) => {
          heldRef.current.set(archivePath, unpacked[index]);
          archives[archivePath] = unpacked[index];
        });
        setState({ status: 'ready', archives });
      } catch {
        failed = true;
        for (const [archivePath, archive] of acquired) {
          disposeFailedRunArchive(archivePath, archive);
        }
        acquired.clear();
        if (!cancelled && !disposedRef.current) {
          setState({ status: 'offline', archives: {} });
        }
        return; // no prefetch while offline — the retry button re-runs everything
      }
      // Fire-and-forget warm-up of the upcoming rounds ("preload the next 5 rounds ... unzip in memory").
      for (const archivePath of prefetch) {
        if (heldRef.current.has(archivePath)) {
          continue;
        }
        getUnpackedArchive(archivePath)
          .then((archive) => {
            if (disposedRef.current) {
              releaseUnpackedArchive(archivePath); // resolved after the screen left: do not leak hot memory
            } else {
              heldRef.current.set(archivePath, archive);
            }
          })
          .catch(() => {
            // Silent: the archive becomes REQUIRED when its round comes and failures surface there as 'offline'.
          });
      }
    };
    void run();
    return () => {
      cancelled = true;
    };
  }, [requiredKey, prefetchKey, retryToken]);

  // Phase G low "retry feedback": switch to 'loading' synchronously so the start animation replaces the offline
  // screen immediately (the manifest fetch alone may take up to its 8 s timeout before the run sets 'loading').
  const retry = useCallback(() => {
    setState({ status: 'loading', archives: {} });
    setRetryToken((token) => token + 1);
  }, []);

  // Synchronous hot path (verification Phase C R1 M1): when the required archives swap (next round) and all of them
  // are already hot in resourceStore (they were prefetched), report 'ready' with those archives in the SAME render —
  // the async effect's state update lands a frame later and would otherwise unmount the board for >= 1 frame.
  const stateCoversRequired =
    state.status === 'ready' && requiredArchives.every((archivePath) => state.archives[archivePath] !== undefined);
  if (!stateCoversRequired) {
    const hotArchives: Record<string, UnpackedArchive> = {};
    let allHot = true;
    for (const archivePath of requiredArchives) {
      const hot = getUnpackedArchiveIfHot(archivePath);
      if (hot === undefined) {
        allHot = false;
        break;
      }
      hotArchives[archivePath] = hot;
    }
    if (allHot) {
      return { status: 'ready', archives: hotArchives, retry };
    }
  }
  return { status: state.status, archives: state.archives, retry };
}
