// Unit tests for resourceStore.ts with an in-memory filesystem (same mock pattern as
// cacheCore.test.ts) and a mocked global fetch: manifest persistence + offline cold-start
// fallback (verification Phase C R1 H1), corrupt-zip evict-and-redownload (M5), and the
// concurrent-manifest-refresh dedupe (L2). `_LetterTraining_PROMPTS.md` /
// "## Follow-up prompt 9 — mobile-apps-preferences (backend resources, cache, preload)".

import { zipSync } from 'fflate';

import {
  ResourceUnavailableError,
  configureResourceBackend,
  getUnpackedArchive,
  getUnpackedArchiveIfHot,
  refreshManifest,
  releaseUnpackedArchive,
  resetResourceStoreForTests,
} from '../resourceStore';
import { CacheFileSystem, ResourceManifest } from '../types';

class InMemoryFileSystem implements CacheFileSystem {
  readonly files = new Map<string, Uint8Array>();
  readonly texts = new Map<string, string>();

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
    this.files.delete(fileName);
  }
}

const GOOD_ZIP = zipSync({ 'picture.png': new Uint8Array([1, 2, 3, 4]), 'word.mp3': new Uint8Array([5, 6]) });
const CORRUPT_ZIP = new Uint8Array([9, 9, 9, 9, 9, 9]); // not a zip

function manifestOf(version: string): ResourceManifest {
  return {
    version,
    generatedAtUtc: '2026-10-01T12:00:00.000Z',
    archives: { 'words/auto.zip': { sha256: 'sha-' + version, bytes: GOOD_ZIP.length } },
  };
}

// global fetch mock: routes by URL suffix; `archiveQueue` serves archive downloads in order.
function mockFetch(options: { manifest?: ResourceManifest | 'fail'; archiveQueue?: (Uint8Array | 'fail')[] }) {
  const archiveQueue = [...(options.archiveQueue ?? [])];
  const calls: string[] = [];
  (globalThis as { fetch: unknown }).fetch = jest.fn(async (url: string) => {
    calls.push(url);
    if (url.endsWith('/manifest.json')) {
      if (options.manifest === undefined || options.manifest === 'fail') {
        throw new Error('network down');
      }
      const manifest = options.manifest;
      return { ok: true, status: 200, json: async () => manifest } as Response;
    }
    const next = archiveQueue.shift();
    if (next === undefined || next === 'fail') {
      throw new Error('network down');
    }
    return { ok: true, status: 200, arrayBuffer: async () => next.slice().buffer } as unknown as Response;
  });
  return calls;
}

describe('resourceStore', () => {
  let fileSystem: InMemoryFileSystem;

  beforeEach(() => {
    resetResourceStoreForTests();
    fileSystem = new InMemoryFileSystem();
    configureResourceBackend({ fileSystem });
  });

  afterEach(() => {
    resetResourceStoreForTests();
  });

  test('H1: manifest is persisted; an offline cold start falls back to it and plays from cache', async () => {
    mockFetch({ manifest: manifestOf('v1'), archiveQueue: [GOOD_ZIP] });
    await refreshManifest();
    const archive = await getUnpackedArchive('words/auto.zip');
    expect(Object.keys(archive.files).sort()).toEqual(['picture.png', 'word.mp3']);
    expect(fileSystem.texts.get('lastManifest.json')).toContain('"v1"'); // persisted to the cache dir

    // Cold start (fresh module state, SAME device filesystem), backend unreachable.
    resetResourceStoreForTests();
    configureResourceBackend({ fileSystem });
    mockFetch({ manifest: 'fail' });

    const fallback = await refreshManifest(); // must NOT throw: persisted manifest is the fallback
    expect(fallback.version).toBe('v1');
    const offlineArchive = await getUnpackedArchive('words/auto.zip'); // served from the disk cache
    expect(Object.keys(offlineArchive.files).sort()).toEqual(['picture.png', 'word.mp3']);
  });

  test('H1: a reachable backend always wins over the persisted manifest (new version replaces old)', async () => {
    mockFetch({ manifest: manifestOf('v1'), archiveQueue: [GOOD_ZIP] });
    await refreshManifest();

    resetResourceStoreForTests();
    configureResourceBackend({ fileSystem });
    mockFetch({ manifest: manifestOf('v2') });

    const refreshed = await refreshManifest();
    expect(refreshed.version).toBe('v2'); // fresh fetch, not the persisted v1
    expect(fileSystem.texts.get('lastManifest.json')).toContain('"v2"'); // and persisted copy updated
  });

  test('offline cold start with NO persisted manifest still throws ResourceUnavailableError', async () => {
    mockFetch({ manifest: 'fail' });
    await expect(refreshManifest()).rejects.toThrow(ResourceUnavailableError);
  });

  test('M5: a corrupt downloaded/cached zip is evicted and re-downloaded once, then unpacks fine', async () => {
    const calls = mockFetch({ manifest: manifestOf('v1'), archiveQueue: [CORRUPT_ZIP, GOOD_ZIP] });
    await refreshManifest();

    const archive = await getUnpackedArchive('words/auto.zip');

    expect(Object.keys(archive.files).sort()).toEqual(['picture.png', 'word.mp3']);
    expect(calls.filter((url) => url.endsWith('words/auto.zip'))).toHaveLength(2); // evict + one re-download
  });

  test('M5: corrupt twice fails with ResourceUnavailableError and leaves the cache clean, so retry can heal', async () => {
    mockFetch({ manifest: manifestOf('v1'), archiveQueue: [CORRUPT_ZIP, CORRUPT_ZIP, GOOD_ZIP] });
    await refreshManifest();

    await expect(getUnpackedArchive('words/auto.zip')).rejects.toThrow(ResourceUnavailableError);
    // The corrupt bytes were NOT kept: no cached zip remains (cacheIndex.json may exist but no archive file).
    expect([...fileSystem.files.keys()].filter((name) => name.endsWith('.zip'))).toEqual([]);

    // User retry ("Zkusit znovu") now heals: a fresh download of good bytes succeeds.
    const healed = await getUnpackedArchive('words/auto.zip');
    expect(Object.keys(healed.files).sort()).toEqual(['picture.png', 'word.mp3']);
  });

  test('L2: concurrent refreshManifest calls share ONE network request', async () => {
    const calls = mockFetch({ manifest: manifestOf('v1') });
    const [first, second] = await Promise.all([refreshManifest(), refreshManifest()]);
    expect(first.version).toBe('v1');
    expect(second.version).toBe('v1');
    expect(calls.filter((url) => url.endsWith('/manifest.json'))).toHaveLength(1);
  });

  test('getUnpackedArchiveIfHot reflects the hot map synchronously (M1 support)', async () => {
    mockFetch({ manifest: manifestOf('v1'), archiveQueue: [GOOD_ZIP] });
    await refreshManifest();
    expect(getUnpackedArchiveIfHot('words/auto.zip')).toBeUndefined();
    await getUnpackedArchive('words/auto.zip');
    expect(getUnpackedArchiveIfHot('words/auto.zip')).toBeDefined();
    releaseUnpackedArchive('words/auto.zip');
    expect(getUnpackedArchiveIfHot('words/auto.zip')).toBeUndefined();
  });
});
