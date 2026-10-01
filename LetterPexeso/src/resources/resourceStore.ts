// Facade of the backend-resource module: manifest fetch + compare, archive download through the
// 200MB LRU disk cache (cacheCore.ts), in-memory unpack (pure-JS fflate — native zip modules do
// not run in Expo Go) into ready-to-use image data URIs and hot in-memory audio sources.
// `_LetterTraining_PROMPTS.md` / "## Follow-up prompt 9 — mobile-apps-preferences (backend resources, cache, preload)".
//
// Usage (Phase C integration):
//   await refreshManifest();                      // on game start / before preloading
//   const archive = await getUnpackedArchive('words/auto.zip');   // preload (5 rounds ahead)
//   <Image source={{ uri: archive.files['auto.png'].dataUri }} />
//   playAudio({ source: { uri: archive.files['auto.mp3'].dataUri }, ... })  // via audioController
//   releaseUnpackedArchive('words/auto.zip');     // when the round is past (drop hot memory)

import { unzipSync } from 'fflate';

import { bytesToDataUri } from './base64';
import { ArchiveCache } from './cacheCore';
import { createExpoCacheFileSystem } from './expoFileSystemAdapter';
import { CacheFileSystem, ResourceManifest, UnpackedArchive, UnpackedFile } from './types';

// Backend base URL: EndgameServer reached VPN-only over WireGuard (10.67.0.1); port 9080 is the
// reserved, conflict-checked backend port (see ResourceBackend/README.md and
// src/resources/README.md). Override via configureResourceBackend.
export const DEFAULT_RESOURCE_BACKEND_BASE_URL = 'http://10.67.0.1:9080';

const MANIFEST_FETCH_TIMEOUT_MILLISECONDS = 8000;
// Archives are up to a few hundred KB; the timeout covers connect + body read (the AbortController
// signal also aborts a hanging body read, not only a hanging connect).
const ARCHIVE_FETCH_TIMEOUT_MILLISECONDS = 20000;
// Last good manifest, persisted in the cache directory: a cold start with no network must still be
// able to play fully-cached games (verification Phase C R1 H1). Used ONLY as a fallback when the
// fresh fetch fails — a reachable backend's manifest always wins ("new version always replaces old").
const PERSISTED_MANIFEST_FILE_NAME = 'lastManifest.json';

let baseUrl = DEFAULT_RESOURCE_BACKEND_BASE_URL;
let manifest: ResourceManifest | null = null;
let archiveCache: ArchiveCache | null = null;
let cacheFileSystem: CacheFileSystem | null = null;
// De-duplicates concurrent manifest refreshes (e.g. two screens mounting at once): one network hit.
let pendingManifestRefresh: Promise<ResourceManifest> | null = null;
// Hot in-memory unpacked archives (does NOT count toward the 200MB disk limit — that limit is
// for compressed on-device files only). Entries are dropped by releaseUnpackedArchive.
const unpackedArchives = new Map<string, UnpackedArchive>();
// De-duplicates concurrent preloads of the same archive.
const pendingUnpacks = new Map<string, Promise<UnpackedArchive>>();

export function configureResourceBackend(options: { baseUrl?: string; fileSystem?: CacheFileSystem }): void {
  if (options.baseUrl !== undefined) {
    baseUrl = options.baseUrl.replace(/\/+$/, '');
  }
  if (options.fileSystem !== undefined) {
    // Injectable filesystem for unit tests; on device the expo adapter is created lazily.
    cacheFileSystem = options.fileSystem;
    archiveCache = null;
  }
}

// Unit-test hook: back to a pristine module state (module-level singletons otherwise leak between tests).
export function resetResourceStoreForTests(): void {
  baseUrl = DEFAULT_RESOURCE_BACKEND_BASE_URL;
  manifest = null;
  archiveCache = null;
  cacheFileSystem = null;
  pendingManifestRefresh = null;
  unpackedArchives.clear();
  pendingUnpacks.clear();
}

function fileSystem(): CacheFileSystem {
  if (!cacheFileSystem) {
    cacheFileSystem = createExpoCacheFileSystem();
  }
  return cacheFileSystem;
}

// Thrown when the backend is unreachable AND the resource is not cached — the screen then shows
// the child-friendly OfflineRetry component (decision 7) and calls back in on "Zkusit znovu".
export class ResourceUnavailableError extends Error {
  constructor(message: string, readonly archivePath?: string) {
    super(message);
    this.name = 'ResourceUnavailableError';
  }
}

// One timeout window covers connect AND body read (aborting the controller also aborts a hanging
// response.json()/arrayBuffer() — a stalled body must not hang a preload forever).
async function fetchWithTimeout<T>(
  url: string,
  timeoutMilliseconds: number,
  readBody: (response: Response) => Promise<T>
): Promise<T> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMilliseconds);
  try {
    const response = await fetch(url, { signal: controller.signal });
    if (!response.ok) {
      throw new Error(`${url} HTTP ${response.status}`);
    }
    return await readBody(response);
  } finally {
    clearTimeout(timer);
  }
}

// Fetches the backend manifest. A changed global version/per-archive checksum automatically
// invalidates stale cached copies on their next use (cacheCore compares sha256 per archive).
// A fresh fetch is attempted on every call ("new version must always replace the old"); when the
// backend is unreachable, the fallback order is: manifest from earlier in this run → the last good
// manifest persisted on disk (so a cold start with no network can still play fully-cached games) →
// ResourceUnavailableError. Concurrent calls share one in-flight request.
export function refreshManifest(): Promise<ResourceManifest> {
  if (pendingManifestRefresh) {
    return pendingManifestRefresh;
  }
  const work = doRefreshManifest().finally(() => {
    pendingManifestRefresh = null;
  });
  pendingManifestRefresh = work;
  return work;
}

async function doRefreshManifest(): Promise<ResourceManifest> {
  try {
    const fetched = (await fetchWithTimeout(
      `${baseUrl}/manifest.json`,
      MANIFEST_FETCH_TIMEOUT_MILLISECONDS,
      (response) => response.json()
    )) as ResourceManifest;
    if (typeof fetched.version !== 'string' || typeof fetched.archives !== 'object') {
      throw new Error('manifest.json has an unexpected shape');
    }
    manifest = fetched;
    try {
      // Best effort: the persisted copy only serves offline cold starts (verification Phase C R1 H1).
      await fileSystem().writeText(PERSISTED_MANIFEST_FILE_NAME, JSON.stringify(fetched));
    } catch {
      // A failed persistence never fails the refresh.
    }
    return fetched;
  } catch (error) {
    if (manifest) {
      return manifest; // Offline with a manifest from earlier in this run: keep using it.
    }
    const persisted = await loadPersistedManifest();
    if (persisted) {
      manifest = persisted; // Offline cold start: last good manifest, cached archives keep working.
      return persisted;
    }
    throw new ResourceUnavailableError(`Backend manifest unavailable: ${String(error)}`);
  }
}

async function loadPersistedManifest(): Promise<ResourceManifest | null> {
  try {
    const text = await fileSystem().readText(PERSISTED_MANIFEST_FILE_NAME);
    if (!text) {
      return null;
    }
    const parsed = JSON.parse(text) as ResourceManifest;
    if (typeof parsed.version !== 'string' || typeof parsed.archives !== 'object') {
      return null;
    }
    return parsed;
  } catch {
    return null; // Corrupt/unreadable persisted manifest behaves like none.
  }
}

export function currentManifest(): ResourceManifest | null {
  return manifest;
}

function cache(): ArchiveCache {
  if (!archiveCache) {
    archiveCache = new ArchiveCache({
      fileSystem: fileSystem(),
      download: (archivePath: string) =>
        fetchWithTimeout(`${baseUrl}/${archivePath}`, ARCHIVE_FETCH_TIMEOUT_MILLISECONDS, async (response) =>
          new Uint8Array(await response.arrayBuffer())
        ),
    });
  }
  return archiveCache;
}

// Main entry point: returns the archive fully unpacked in memory (image data URIs ready to
// show, audio data URIs hot — nothing is read from disk or network when the round starts).
// Downloads + disk-caches on first use; refreshes a stale cached copy; throws
// ResourceUnavailableError when offline and not cached.
export async function getUnpackedArchive(archivePath: string): Promise<UnpackedArchive> {
  const alreadyUnpacked = unpackedArchives.get(archivePath);
  if (alreadyUnpacked) {
    return alreadyUnpacked;
  }
  const pending = pendingUnpacks.get(archivePath);
  if (pending) {
    return pending;
  }
  const work = unpackArchive(archivePath).finally(() => pendingUnpacks.delete(archivePath));
  pendingUnpacks.set(archivePath, work);
  return work;
}

async function unpackArchive(archivePath: string): Promise<UnpackedArchive> {
  const activeManifest = manifest ?? (await refreshManifest());
  const manifestEntry = activeManifest.archives[archivePath];
  if (!manifestEntry) {
    throw new ResourceUnavailableError(`Archive not in manifest: ${archivePath}`, archivePath);
  }
  let compressedBytes: Uint8Array;
  try {
    compressedBytes = await cache().getArchiveBytes(archivePath, manifestEntry);
  } catch (error) {
    throw new ResourceUnavailableError(
      `Archive neither downloadable nor cached: ${archivePath} (${String(error)})`,
      archivePath
    );
  }
  let unzipped: ReturnType<typeof unzipSync>;
  try {
    unzipped = unzipSync(compressedBytes);
  } catch (unzipError) {
    // Corrupt zip (bad cached bytes or a bad download): evict it from the disk cache and
    // re-download ONCE — otherwise a retry would re-serve the same corrupt cached bytes forever
    // (verification Phase C R1 M5).
    await cache()
      .evictArchive(archivePath)
      .catch(() => undefined);
    try {
      compressedBytes = await cache().getArchiveBytes(archivePath, manifestEntry);
      unzipped = unzipSync(compressedBytes);
    } catch (retryError) {
      // Also drop the re-downloaded bytes: the NEXT user retry starts from a clean cache again.
      await cache()
        .evictArchive(archivePath)
        .catch(() => undefined);
      throw new ResourceUnavailableError(
        `Archive unusable even after evict + re-download: ${archivePath} (first: ${String(unzipError)}; retry: ${String(retryError)})`,
        archivePath
      );
    }
  }
  const files: Record<string, UnpackedFile> = {};
  for (const [fileName, bytes] of Object.entries(unzipped)) {
    if (bytes.length === 0) {
      continue; // Directory entries inside the zip.
    }
    files[fileName] = { bytes, dataUri: bytesToDataUri(fileName, bytes) };
  }
  const archive: UnpackedArchive = { archivePath, files };
  unpackedArchives.set(archivePath, archive);
  return archive;
}

// Synchronous view of an already-hot archive (no promise, no IO): lets useArchivePreloading report
// 'ready' in the SAME render when a round swaps to archives that were preloaded — no one-frame
// loading flash between rounds (verification Phase C R1 M1).
export function getUnpackedArchiveIfHot(archivePath: string): UnpackedArchive | undefined {
  return unpackedArchives.get(archivePath);
}

// Drops the hot in-memory copy of a past round's archive (the compressed disk-cache copy stays,
// so replays re-unpack without network). "Once out of the round, its resources may be dropped."
export function releaseUnpackedArchive(archivePath: string): void {
  unpackedArchives.delete(archivePath);
}

export function releaseAllUnpackedArchives(): void {
  unpackedArchives.clear();
}

// True when every given archive is either already hot in memory or freshly cached on disk —
// screens use it to decide whether a play can start offline.
export async function areArchivesAvailableOffline(archivePaths: string[]): Promise<boolean> {
  if (!manifest) {
    return false;
  }
  for (const archivePath of archivePaths) {
    if (unpackedArchives.has(archivePath)) {
      continue;
    }
    const manifestEntry = manifest.archives[archivePath];
    if (!manifestEntry || !(await cache().isCachedFresh(archivePath, manifestEntry))) {
      return false;
    }
  }
  return true;
}
