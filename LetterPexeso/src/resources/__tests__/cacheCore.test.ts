// Unit tests for the compressed LRU archive cache (cacheCore.ts) with a mocked in-memory
// filesystem: last-used tracking, LRU eviction over the limit, checksum invalidation, index
// persistence. `_LetterTraining_PROMPTS.md` /
// "## Follow-up prompt 9 — mobile-apps-preferences (backend resources, cache, preload)".

import { ArchiveCache, cacheFileNameForArchivePath, CACHE_LIMIT_BYTES } from '../cacheCore';
import { CacheFileSystem, ManifestArchiveEntry } from '../types';

class InMemoryFileSystem implements CacheFileSystem {
  readonly files = new Map<string, Uint8Array>();
  readonly texts = new Map<string, string>();
  readonly deletedFileNames: string[] = [];

  async readText(fileName: string): Promise<string | null> {
    return this.texts.get(fileName) ?? null;
  }
  async writeText(fileName: string, content: string): Promise<void> {
    this.texts.set(fileName, content);
  }
  async readBinary(fileName: string): Promise<Uint8Array> {
    const data = this.files.get(fileName);
    if (!data) {
      throw new Error(`missing ${fileName}`);
    }
    return data;
  }
  async writeBinary(fileName: string, data: Uint8Array): Promise<void> {
    this.files.set(fileName, data);
  }
  async deleteFile(fileName: string): Promise<void> {
    this.deletedFileNames.push(fileName);
    this.files.delete(fileName);
  }
}

function bytesOf(size: number, fill: number): Uint8Array {
  return new Uint8Array(size).fill(fill);
}

function manifestEntry(sha256: string, bytes: number): ManifestArchiveEntry {
  return { sha256, bytes };
}

type Setup = {
  fileSystem: InMemoryFileSystem;
  cache: ArchiveCache;
  downloads: string[];
  setNow: (ms: number) => void;
  setServed: (archivePath: string, data: Uint8Array) => void;
};

function createCache(limitBytes: number): Setup {
  const fileSystem = new InMemoryFileSystem();
  const served = new Map<string, Uint8Array>();
  const downloads: string[] = [];
  let nowMs = 1000;
  const cache = new ArchiveCache({
    fileSystem,
    limitBytes,
    nowMs: () => nowMs,
    download: async (archivePath: string) => {
      downloads.push(archivePath);
      const data = served.get(archivePath);
      if (!data) {
        throw new Error(`network down for ${archivePath}`);
      }
      return data;
    },
  });
  return {
    fileSystem,
    cache,
    downloads,
    setNow: (ms: number) => {
      nowMs = ms;
    },
    setServed: (archivePath: string, data: Uint8Array) => served.set(archivePath, data),
  };
}

describe('ArchiveCache', () => {
  test('downloads on first use, serves from cache on second use', async () => {
    const setup = createCache(1000);
    setup.setServed('words/auto.zip', bytesOf(100, 1));
    const entry = manifestEntry('aaa', 100);

    const first = await setup.cache.getArchiveBytes('words/auto.zip', entry);
    const second = await setup.cache.getArchiveBytes('words/auto.zip', entry);

    expect(first).toEqual(bytesOf(100, 1));
    expect(second).toEqual(bytesOf(100, 1));
    expect(setup.downloads).toEqual(['words/auto.zip']); // One network hit only.
    expect(await setup.cache.totalCachedBytes()).toBe(100);
  });

  test('changed checksum replaces the old cached copy (invalidation)', async () => {
    const setup = createCache(1000);
    setup.setServed('words/auto.zip', bytesOf(100, 1));
    await setup.cache.getArchiveBytes('words/auto.zip', manifestEntry('oldSha', 100));

    setup.setServed('words/auto.zip', bytesOf(120, 2)); // Backend has a new version.
    const refreshed = await setup.cache.getArchiveBytes('words/auto.zip', manifestEntry('newSha', 120));

    expect(refreshed).toEqual(bytesOf(120, 2));
    expect(setup.downloads).toEqual(['words/auto.zip', 'words/auto.zip']);
    // Old file was deleted before the re-download, exactly one file per delete.
    expect(setup.fileSystem.deletedFileNames).toContain(cacheFileNameForArchivePath('words/auto.zip'));
    const index = await setup.cache.snapshotIndex();
    expect(index).toHaveLength(1);
    expect(index[0].sha256).toBe('newSha');
    expect(index[0].bytes).toBe(120);
  });

  test('evicts least-recently-USED (not least-recently-downloaded) files over the limit', async () => {
    const setup = createCache(250);
    setup.setServed('a.zip', bytesOf(100, 1));
    setup.setServed('b.zip', bytesOf(100, 2));
    setup.setServed('c.zip', bytesOf(100, 3));

    setup.setNow(1000);
    await setup.cache.getArchiveBytes('a.zip', manifestEntry('a', 100));
    setup.setNow(2000);
    await setup.cache.getArchiveBytes('b.zip', manifestEntry('b', 100));
    setup.setNow(3000);
    await setup.cache.getArchiveBytes('a.zip', manifestEntry('a', 100)); // Touch a → b is now LRU.
    setup.setNow(4000);
    await setup.cache.getArchiveBytes('c.zip', manifestEntry('c', 100)); // 300 > 250 → evict b.

    expect(setup.fileSystem.deletedFileNames).toEqual([cacheFileNameForArchivePath('b.zip')]);
    const cachedPaths = (await setup.cache.snapshotIndex()).map((entry) => entry.archivePath).sort();
    expect(cachedPaths).toEqual(['a.zip', 'c.zip']);
    expect(await setup.cache.totalCachedBytes()).toBe(200);
  });

  test('evicts multiple files until under the limit, never the just-downloaded one', async () => {
    const setup = createCache(250);
    setup.setServed('a.zip', bytesOf(100, 1));
    setup.setServed('b.zip', bytesOf(100, 2));
    setup.setServed('big.zip', bytesOf(240, 3));

    setup.setNow(1000);
    await setup.cache.getArchiveBytes('a.zip', manifestEntry('a', 100));
    setup.setNow(2000);
    await setup.cache.getArchiveBytes('b.zip', manifestEntry('b', 100));
    setup.setNow(3000);
    await setup.cache.getArchiveBytes('big.zip', manifestEntry('big', 240)); // 440 → evict a then b.

    expect(setup.fileSystem.deletedFileNames).toEqual([
      cacheFileNameForArchivePath('a.zip'),
      cacheFileNameForArchivePath('b.zip'),
    ]);
    const index = await setup.cache.snapshotIndex();
    expect(index.map((entry) => entry.archivePath)).toEqual(['big.zip']);
  });

  test('a single archive larger than the limit is kept (cannot evict the archive in use)', async () => {
    const setup = createCache(100);
    setup.setServed('huge.zip', bytesOf(150, 1));

    const data = await setup.cache.getArchiveBytes('huge.zip', manifestEntry('huge', 150));

    expect(data.byteLength).toBe(150);
    expect((await setup.cache.snapshotIndex()).map((entry) => entry.archivePath)).toEqual(['huge.zip']);
  });

  test('missing file on disk despite index entry triggers a re-download', async () => {
    const setup = createCache(1000);
    setup.setServed('a.zip', bytesOf(50, 1));
    await setup.cache.getArchiveBytes('a.zip', manifestEntry('a', 50));
    setup.fileSystem.files.delete(cacheFileNameForArchivePath('a.zip')); // Disk lost the file.

    const data = await setup.cache.getArchiveBytes('a.zip', manifestEntry('a', 50));

    expect(data).toEqual(bytesOf(50, 1));
    expect(setup.downloads).toEqual(['a.zip', 'a.zip']);
  });

  test('index persists: a new ArchiveCache instance over the same filesystem reuses cached files', async () => {
    const setup = createCache(1000);
    setup.setServed('a.zip', bytesOf(50, 1));
    await setup.cache.getArchiveBytes('a.zip', manifestEntry('a', 50));

    const downloads: string[] = [];
    const secondInstance = new ArchiveCache({
      fileSystem: setup.fileSystem,
      limitBytes: 1000,
      nowMs: () => 9999,
      download: async (archivePath: string) => {
        downloads.push(archivePath);
        throw new Error('network down');
      },
    });

    expect(await secondInstance.getArchiveBytes('a.zip', manifestEntry('a', 50))).toEqual(bytesOf(50, 1));
    expect(downloads).toEqual([]); // Served offline from the persisted cache.
    expect(await secondInstance.isCachedFresh('a.zip', manifestEntry('a', 50))).toBe(true);
    expect(await secondInstance.isCachedFresh('a.zip', manifestEntry('CHANGED', 50))).toBe(false);
  });

  test('offline and not cached → download error propagates', async () => {
    const setup = createCache(1000);
    await expect(setup.cache.getArchiveBytes('missing.zip', manifestEntry('m', 10))).rejects.toThrow(
      'network down for missing.zip'
    );
    expect(await setup.cache.totalCachedBytes()).toBe(0);
  });

  test('default limit is 200MB on compressed bytes', () => {
    expect(CACHE_LIMIT_BYTES).toBe(200 * 1024 * 1024);
  });
});
