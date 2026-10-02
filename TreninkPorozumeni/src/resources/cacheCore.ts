// TreninkPorozumeni copy (adapted): _TreninkPorozumeni_Fields123_PROMPTS.md — "User request 26" (mobile-apps-preferences skill).
// Compressed on-device archive cache — pure logic (no Expo imports) so unit tests can run it
// against an in-memory filesystem mock. Implements the mobile-apps-preferences device cache:
// 200MB limit counted on COMPRESSED files only, last-used tracking, LRU eviction on overflow,
// and checksum/version invalidation (a changed backend checksum replaces the old cached copy).
// `_LetterTraining_PROMPTS.md` / "## Follow-up prompt 9 — mobile-apps-preferences (backend resources, cache, preload)".

import {
  ArchiveDownloader,
  CacheFileSystem,
  CacheIndex,
  CacheIndexEntry,
  ManifestArchiveEntry,
} from './types';
import { sha256HexAsync } from './sha256';

export const CACHE_LIMIT_BYTES = 200 * 1024 * 1024; // 200MB, compressed size on device only.

// App-specific name so it can never clash with LetterTraining's index (_TreninkPorozumeni_Fields123_PROMPTS.md — User request 26).
const INDEX_FILE_NAME = 'treninkPorozumeniCacheIndex.json';

// "words/auto.zip" → "words__auto.zip": cached files live flat in one directory.
export function cacheFileNameForArchivePath(archivePath: string): string {
  return archivePath.replace(/[^A-Za-z0-9._-]/g, '__');
}

export type ArchiveCacheOptions = {
  fileSystem: CacheFileSystem;
  download: ArchiveDownloader;
  // Injected clock for deterministic tests; defaults to Date.now.
  nowMs?: () => number;
  // Overridable limit for tests; defaults to CACHE_LIMIT_BYTES.
  limitBytes?: number;
};

// Download did not match the manifest checksum: the in-memory manifest may be stale (backend redeployed
// mid-session), so the caller refetches the manifest once and retries (repair R2,
// _TreninkPorozumeni_Fields123_PROMPTS.md — User request 26).
export class ChecksumMismatchError extends Error {
  name = 'ChecksumMismatchError'; // name check below survives transpiled Error subclassing
}

export class ArchiveCache {
  private readonly _fileSystem: CacheFileSystem;
  private readonly _download: ArchiveDownloader;
  private readonly _nowMs: () => number;
  private readonly _limitBytes: number;
  private _index: CacheIndex | null = null;
  // One shared in-flight load: concurrent first calls must get the SAME index object, otherwise the
  // losing call's entries are lost and its zips become orphans (_TreninkPorozumeni_Fields123_PROMPTS.md — User request 26).
  private _indexLoad: Promise<CacheIndex> | null = null;

  constructor(options: ArchiveCacheOptions) {
    this._fileSystem = options.fileSystem;
    this._download = options.download;
    this._nowMs = options.nowMs ?? (() => Date.now());
    this._limitBytes = options.limitBytes ?? CACHE_LIMIT_BYTES;
  }

  // Compressed bytes of an archive, from cache when fresh, downloaded (and cached) otherwise.
  // `manifestEntry` is the CURRENT backend manifest entry: a cached copy with a different
  // sha256 is stale and is replaced ("new version must always replace the old cached version").
  async getArchiveBytes(
    archivePath: string,
    manifestEntry: ManifestArchiveEntry,
    hashPriority = false
  ): Promise<Uint8Array> {
    const index = await this.loadIndex();
    const fileName = cacheFileNameForArchivePath(archivePath);
    const existing = index.entries.find((entry) => entry.archivePath === archivePath);

    if (existing && existing.sha256 === manifestEntry.sha256) {
      try {
        const bytes = await this._fileSystem.readBinary(fileName);
        existing.lastUsedMs = this._nowMs();
        await this.saveIndex();
        return bytes;
      } catch {
        // File missing/corrupt on disk although indexed — fall through to a fresh download.
        this.removeEntry(index, archivePath);
      }
    } else if (existing) {
      // Stale version: replace (delete first so a failed download cannot leave the old version live).
      await this._fileSystem.deleteFile(fileName);
      this.removeEntry(index, archivePath);
      await this.saveIndex();
    }

    const downloadedBytes = await this._download(archivePath);
    // Integrity check against the manifest (_TreninkPorozumeni_Fields123_PROMPTS.md — User request 26):
    // a wrong size/sha256 (e.g. backend redeployed between manifest fetch and archive GET) is a failure;
    // nothing is written or indexed, so the bad download is dropped and the next retry starts clean.
    if (downloadedBytes.byteLength !== manifestEntry.bytes) {
      throw new ChecksumMismatchError(`${archivePath}: size ${downloadedBytes.byteLength} != manifest ${manifestEntry.bytes}`);
    }
    // Chunked + queued hashing so the JS thread stays responsive (repair R2).
    const downloadedSha256 = await sha256HexAsync(downloadedBytes, hashPriority);
    if (downloadedSha256 !== manifestEntry.sha256.toLowerCase()) {
      throw new ChecksumMismatchError(`${archivePath}: sha256 ${downloadedSha256} != manifest ${manifestEntry.sha256}`);
    }
    await this._fileSystem.writeBinary(fileName, downloadedBytes);
    index.entries.push({
      archivePath,
      sha256: manifestEntry.sha256,
      bytes: downloadedBytes.byteLength,
      lastUsedMs: this._nowMs(),
    });
    await this.evictOverLimit(index);
    await this.saveIndex();
    return downloadedBytes;
  }

  // True when a fresh (checksum-matching) copy is cached — used for offline decisions.
  async isCachedFresh(archivePath: string, manifestEntry: ManifestArchiveEntry): Promise<boolean> {
    const index = await this.loadIndex();
    const existing = index.entries.find((entry) => entry.archivePath === archivePath);
    return existing !== undefined && existing.sha256 === manifestEntry.sha256;
  }

  // Removes exactly one archive from disk + index. Used when its cached bytes turned out unusable
  // (e.g. a corrupt zip): without this, a retry would re-serve the same corrupt bytes forever.
  async evictArchive(archivePath: string): Promise<void> {
    const index = await this.loadIndex();
    await this._fileSystem.deleteFile(cacheFileNameForArchivePath(archivePath));
    this.removeEntry(index, archivePath);
    await this.saveIndex();
  }

  async totalCachedBytes(): Promise<number> {
    const index = await this.loadIndex();
    return index.entries.reduce((sum, entry) => sum + entry.bytes, 0);
  }

  // Exposed for tests/diagnostics; returns a copy.
  async snapshotIndex(): Promise<CacheIndexEntry[]> {
    const index = await this.loadIndex();
    return index.entries.map((entry) => ({ ...entry }));
  }

  private loadIndex(): Promise<CacheIndex> {
    if (!this._indexLoad) {
      this._indexLoad = this.loadIndexOnce();
    }
    return this._indexLoad;
  }

  private async loadIndexOnce(): Promise<CacheIndex> {
    let loaded: CacheIndex = { entries: [] };
    try {
      const text = await this._fileSystem.readText(INDEX_FILE_NAME);
      if (text) {
        const parsed = JSON.parse(text) as CacheIndex;
        if (Array.isArray(parsed.entries)) {
          loaded = parsed;
        }
      }
    } catch {
      // Unreadable/corrupt index → start empty; orphaned zips are overwritten on next download.
    }
    this._index = loaded;
    return loaded;
  }

  private async saveIndex(): Promise<void> {
    if (!this._index) {
      return;
    }
    await this._fileSystem.writeText(INDEX_FILE_NAME, JSON.stringify(this._index));
  }

  private removeEntry(index: CacheIndex, archivePath: string): void {
    index.entries = index.entries.filter((entry) => entry.archivePath !== archivePath);
  }

  // LRU eviction: delete least-recently-used files (one by one, each delete targets exactly one
  // file) until the compressed total is back under the limit.
  private async evictOverLimit(index: CacheIndex): Promise<void> {
    let totalBytes = index.entries.reduce((sum, entry) => sum + entry.bytes, 0);
    while (totalBytes > this._limitBytes && index.entries.length > 1) {
      let leastRecentlyUsed = index.entries[0];
      for (const entry of index.entries) {
        if (entry.lastUsedMs < leastRecentlyUsed.lastUsedMs) {
          leastRecentlyUsed = entry;
        }
      }
      await this._fileSystem.deleteFile(cacheFileNameForArchivePath(leastRecentlyUsed.archivePath));
      this.removeEntry(index, leastRecentlyUsed.archivePath);
      totalBytes -= leastRecentlyUsed.bytes;
    }
    // Note: a single archive larger than the limit stays (entries.length > 1 guard) — we never
    // evict the archive that was just requested and is about to be used.
  }
}
