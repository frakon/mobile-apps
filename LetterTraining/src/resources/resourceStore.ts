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
import { ResourceManifest, UnpackedArchive, UnpackedFile } from './types';

// Backend base URL: EndgameServer reached VPN-only over WireGuard (10.67.0.1); port 9080 is the
// reserved, conflict-checked backend port (see ResourceBackend/README.md and
// src/resources/README.md). Override via configureResourceBackend.
export const DEFAULT_RESOURCE_BACKEND_BASE_URL = 'http://10.67.0.1:9080';

const MANIFEST_FETCH_TIMEOUT_MILLISECONDS = 8000;

let baseUrl = DEFAULT_RESOURCE_BACKEND_BASE_URL;
let manifest: ResourceManifest | null = null;
let archiveCache: ArchiveCache | null = null;
// Hot in-memory unpacked archives (does NOT count toward the 200MB disk limit — that limit is
// for compressed on-device files only). Entries are dropped by releaseUnpackedArchive.
const unpackedArchives = new Map<string, UnpackedArchive>();
// De-duplicates concurrent preloads of the same archive.
const pendingUnpacks = new Map<string, Promise<UnpackedArchive>>();

export function configureResourceBackend(options: { baseUrl: string }): void {
  baseUrl = options.baseUrl.replace(/\/+$/, '');
}

// Thrown when the backend is unreachable AND the resource is not cached — the screen then shows
// the child-friendly OfflineRetry component (decision 7) and calls back in on "Zkusit znovu".
export class ResourceUnavailableError extends Error {
  constructor(message: string, readonly archivePath?: string) {
    super(message);
    this.name = 'ResourceUnavailableError';
  }
}

async function fetchWithTimeout(url: string): Promise<Response> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), MANIFEST_FETCH_TIMEOUT_MILLISECONDS);
  try {
    return await fetch(url, { signal: controller.signal });
  } finally {
    clearTimeout(timer);
  }
}

// Fetches the backend manifest. A changed global version/per-archive checksum automatically
// invalidates stale cached copies on their next use (cacheCore compares sha256 per archive).
// When the backend is unreachable but an older manifest was already fetched this app run, the
// old manifest stays usable (cached archives keep working offline); with no manifest at all a
// ResourceUnavailableError is thrown.
export async function refreshManifest(): Promise<ResourceManifest> {
  try {
    const response = await fetchWithTimeout(`${baseUrl}/manifest.json`);
    if (!response.ok) {
      throw new Error(`manifest.json HTTP ${response.status}`);
    }
    const fetched = (await response.json()) as ResourceManifest;
    if (typeof fetched.version !== 'string' || typeof fetched.archives !== 'object') {
      throw new Error('manifest.json has an unexpected shape');
    }
    manifest = fetched;
    return fetched;
  } catch (error) {
    if (manifest) {
      return manifest; // Offline with a manifest from earlier in this run: keep using it.
    }
    throw new ResourceUnavailableError(`Backend manifest unavailable: ${String(error)}`);
  }
}

export function currentManifest(): ResourceManifest | null {
  return manifest;
}

function cache(): ArchiveCache {
  if (!archiveCache) {
    archiveCache = new ArchiveCache({
      fileSystem: createExpoCacheFileSystem(),
      download: async (archivePath: string) => {
        const response = await fetchWithTimeout(`${baseUrl}/${archivePath}`);
        if (!response.ok) {
          throw new Error(`${archivePath} HTTP ${response.status}`);
        }
        return new Uint8Array(await response.arrayBuffer());
      },
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
  const unzipped = unzipSync(compressedBytes);
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
