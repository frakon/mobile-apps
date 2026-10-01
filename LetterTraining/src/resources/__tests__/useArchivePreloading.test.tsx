// Unit tests for useArchivePreloading.ts (react-test-renderer probe component + mocked fetch and
// in-memory filesystem): synchronous-hot no-flicker round swap (verification Phase C R1 M1),
// release-on-unmount including mid-load cancellation (M3). `_LetterTraining_PROMPTS.md` /
// "## Follow-up prompt 9 — mobile-apps-preferences (backend resources, cache, preload)".

import React from 'react';
import TestRenderer, { act } from 'react-test-renderer';
import { zipSync } from 'fflate';

import {
  configureResourceBackend,
  getUnpackedArchive,
  getUnpackedArchiveIfHot,
  refreshManifest,
  resetResourceStoreForTests,
} from '../resourceStore';
import { ArchivePreloadResult, useArchivePreloading } from '../useArchivePreloading';
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

const ZIP_A = zipSync({ 'picture.png': new Uint8Array([1]) });
const ZIP_B = zipSync({ 'picture.png': new Uint8Array([2]) });

const MANIFEST: ResourceManifest = {
  version: 'v1',
  generatedAtUtc: '2026-10-01T12:00:00.000Z',
  archives: {
    'words/a.zip': { sha256: 'sha-a', bytes: ZIP_A.length },
    'words/b.zip': { sha256: 'sha-b', bytes: ZIP_B.length },
    // In the manifest but never served by mockFetch: its download fails ("VPN dropped mid-load").
    'words/broken.zip': { sha256: 'sha-broken', bytes: 1 },
  },
};

type Deferred = { resolve: () => void; promise: Promise<void> };
function deferred(): Deferred {
  let resolve!: () => void;
  const promise = new Promise<void>((r) => {
    resolve = r;
  });
  return { resolve, promise };
}

// fetch mock: manifest always available; each archive served from `served`, optionally gated by a
// per-path Deferred so a test can keep a download in flight (mid-load cancellation).
function mockFetch(gates: Record<string, Deferred> = {}) {
  const served: Record<string, Uint8Array> = { 'words/a.zip': ZIP_A, 'words/b.zip': ZIP_B };
  (globalThis as { fetch: unknown }).fetch = jest.fn(async (url: string) => {
    if (url.endsWith('/manifest.json')) {
      return { ok: true, status: 200, json: async () => MANIFEST } as Response;
    }
    // Gates apply to unserved paths too, so a test can order a FAILING download after a good one.
    const gatedPath = Object.keys(gates).find((key) => url.endsWith(key));
    if (gatedPath !== undefined) {
      await gates[gatedPath].promise;
    }
    const path = Object.keys(served).find((key) => url.endsWith(key));
    if (path === undefined) {
      throw new Error('network down');
    }
    return { ok: true, status: 200, arrayBuffer: async () => served[path].slice().buffer } as unknown as Response;
  });
}

function archiveFetchCount(archivePath: string): number {
  const calls = ((globalThis as { fetch: unknown }).fetch as jest.Mock).mock.calls as [string][];
  return calls.filter(([url]) => url.endsWith(archivePath)).length;
}

function Probe({ required, onResult }: { required: readonly string[]; onResult: (result: ArchivePreloadResult) => void }) {
  onResult(useArchivePreloading(required));
  return null;
}

async function flushMicrotasks(): Promise<void> {
  await act(async () => {
    await Promise.resolve();
    await Promise.resolve();
    await Promise.resolve();
  });
}

describe('useArchivePreloading', () => {
  beforeEach(() => {
    resetResourceStoreForTests();
    configureResourceBackend({ fileSystem: new InMemoryFileSystem() });
  });

  afterEach(() => {
    resetResourceStoreForTests();
  });

  test('M1: already-hot archives are ready SYNCHRONOUSLY on every render (no loading flicker on round swap)', async () => {
    mockFetch();
    await refreshManifest();
    await getUnpackedArchive('words/a.zip'); // hot before the screen renders (prefetched)
    await getUnpackedArchive('words/b.zip');

    const statuses: string[] = [];
    let latest: ArchivePreloadResult | undefined;
    const onResult = (result: ArchivePreloadResult) => {
      statuses.push(result.status);
      latest = result;
    };
    let renderer!: TestRenderer.ReactTestRenderer;
    await act(async () => {
      renderer = TestRenderer.create(<Probe required={['words/a.zip']} onResult={onResult} />);
    });
    await flushMicrotasks();
    // Round swap to the (also hot) next archive: NOT ONE render may report 'loading'.
    await act(async () => {
      renderer.update(<Probe required={['words/b.zip']} onResult={onResult} />);
    });
    await flushMicrotasks();

    expect(statuses).not.toContain('loading');
    expect(statuses).not.toContain('offline');
    expect(latest?.archives['words/b.zip']?.files['picture.png']).toBeDefined();
    await act(async () => {
      renderer.unmount();
    });
  });

  test('M3/unmount: leaving the screen releases the hot archives', async () => {
    mockFetch();
    let renderer!: TestRenderer.ReactTestRenderer;
    await act(async () => {
      renderer = TestRenderer.create(<Probe required={['words/a.zip']} onResult={() => undefined} />);
    });
    await flushMicrotasks();
    expect(getUnpackedArchiveIfHot('words/a.zip')).toBeDefined(); // loaded + held

    await act(async () => {
      renderer.unmount();
    });
    await flushMicrotasks();
    expect(getUnpackedArchiveIfHot('words/a.zip')).toBeUndefined(); // released on unmount
  });

  test('M3: a REQUIRED load still in flight when the screen unmounts is released once it resolves', async () => {
    const gate = deferred();
    mockFetch({ 'words/a.zip': gate });
    let renderer!: TestRenderer.ReactTestRenderer;
    await act(async () => {
      renderer = TestRenderer.create(<Probe required={['words/a.zip']} onResult={() => undefined} />);
    });
    await flushMicrotasks();
    expect(getUnpackedArchiveIfHot('words/a.zip')).toBeUndefined(); // download still gated

    await act(async () => {
      renderer.unmount(); // leave mid-load
    });
    gate.resolve(); // the in-flight download now completes AFTER the unmount
    await flushMicrotasks();

    // The resolved archive must NOT stay hot — the disposed run releases what it acquired.
    expect(getUnpackedArchiveIfHot('words/a.zip')).toBeUndefined();
  });

  // Phase G low "mid-preload failure hold": a REJECTED required load must not leave the archives this run already
  // unpacked hot-but-unregistered (they would survive leaving the screen).
  test('G: mid-preload failure releases archives the failed run already unpacked', async () => {
    mockFetch(); // 'words/missing.zip' is not served -> rejects ("VPN dropped")
    let latest: ArchivePreloadResult | undefined;
    let renderer!: TestRenderer.ReactTestRenderer;
    await act(async () => {
      renderer = TestRenderer.create(
        <Probe required={['words/a.zip', 'words/missing.zip']} onResult={(result) => (latest = result)} />
      );
    });
    await flushMicrotasks();
    expect(latest?.status).toBe('offline');
    expect(getUnpackedArchiveIfHot('words/a.zip')).toBeUndefined();
    await act(async () => {
      renderer.unmount();
    });
  });

  test('G: an archive resolving AFTER the run already failed is released too', async () => {
    const gate = deferred();
    mockFetch({ 'words/a.zip': gate });
    let latest: ArchivePreloadResult | undefined;
    let renderer!: TestRenderer.ReactTestRenderer;
    await act(async () => {
      renderer = TestRenderer.create(
        <Probe required={['words/a.zip', 'words/missing.zip']} onResult={(result) => (latest = result)} />
      );
    });
    await flushMicrotasks();
    expect(latest?.status).toBe('offline');
    gate.resolve(); // a's download completes after the rejection
    await flushMicrotasks();
    expect(getUnpackedArchiveIfHot('words/a.zip')).toBeUndefined();
    await act(async () => {
      renderer.unmount();
    });
  });

  // Pins the catch-loop over `acquired`: the good archive lands in `acquired` BEFORE the failing one rejects.
  test('G: an archive acquired BEFORE the failure is released by the failed run', async () => {
    const brokenGate = deferred();
    mockFetch({ 'words/broken.zip': brokenGate });
    let latest: ArchivePreloadResult | undefined;
    let renderer!: TestRenderer.ReactTestRenderer;
    await act(async () => {
      renderer = TestRenderer.create(
        <Probe required={['words/a.zip', 'words/broken.zip']} onResult={(result) => (latest = result)} />
      );
    });
    await flushMicrotasks();
    expect(getUnpackedArchiveIfHot('words/a.zip')).toBeDefined(); // a resolved first (acquired by the run)
    expect(latest?.status).toBe('loading');

    await act(async () => {
      brokenGate.resolve(); // now the broken download fails
    });
    await flushMicrotasks();
    expect(latest?.status).toBe('offline');
    expect(getUnpackedArchiveIfHot('words/a.zip')).toBeUndefined();
    await act(async () => {
      renderer.unmount();
    });
  });

  // Pins disposeFailedRunArchive's cancelled -> hold branch: a superseded run that fails later must not release an
  // archive the newer (still loading) run reuses.
  test('G: a cancelled run failing later HOLDS its archives for the newer run (no re-download)', async () => {
    const brokenGate = deferred();
    const bGate = deferred();
    mockFetch({ 'words/broken.zip': brokenGate, 'words/b.zip': bGate });
    let latest: ArchivePreloadResult | undefined;
    const onResult = (result: ArchivePreloadResult) => (latest = result);
    let renderer!: TestRenderer.ReactTestRenderer;
    await act(async () => {
      renderer = TestRenderer.create(<Probe required={['words/a.zip', 'words/broken.zip']} onResult={onResult} />);
    });
    await flushMicrotasks();
    expect(getUnpackedArchiveIfHot('words/a.zip')).toBeDefined(); // acquired by run 1, not held yet

    // Round swap while run 1 is in flight: run 1 is cancelled, run 2 reuses a (hot) and waits for b.
    await act(async () => {
      renderer.update(<Probe required={['words/a.zip', 'words/b.zip']} onResult={onResult} />);
    });
    await flushMicrotasks();
    await act(async () => {
      brokenGate.resolve(); // cancelled run 1 fails now
    });
    await flushMicrotasks();
    expect(getUnpackedArchiveIfHot('words/a.zip')).toBeDefined(); // held, not released

    await act(async () => {
      bGate.resolve();
    });
    await flushMicrotasks();
    expect(latest?.status).toBe('ready');
    expect(latest?.archives['words/a.zip']).toBeDefined();
    expect(getUnpackedArchiveIfHot('words/a.zip')).toBe(latest?.archives['words/a.zip']);
    expect(archiveFetchCount('words/a.zip')).toBe(1); // no second download/unpack
    await act(async () => {
      renderer.unmount();
    });
  });

  // Pins the `!heldRef.has` guard: a failing run must not release an archive the screen already holds.
  test('G: an archive already HELD by the screen survives another run failing', async () => {
    const brokenGate = deferred();
    mockFetch({ 'words/broken.zip': brokenGate });
    let latest: ArchivePreloadResult | undefined;
    const onResult = (result: ArchivePreloadResult) => (latest = result);
    let renderer!: TestRenderer.ReactTestRenderer;
    await act(async () => {
      renderer = TestRenderer.create(<Probe required={['words/a.zip']} onResult={onResult} />);
    });
    await flushMicrotasks();
    expect(latest?.status).toBe('ready'); // a is held by the screen

    await act(async () => {
      renderer.update(<Probe required={['words/a.zip', 'words/broken.zip']} onResult={onResult} />);
    });
    await flushMicrotasks();
    await act(async () => {
      brokenGate.resolve();
    });
    await flushMicrotasks();
    expect(latest?.status).toBe('offline');
    expect(getUnpackedArchiveIfHot('words/a.zip')).toBeDefined(); // still hot
    expect(archiveFetchCount('words/a.zip')).toBe(1);
    await act(async () => {
      renderer.unmount();
    });
  });

  // Phase G low "retry feedback": the retry tap must show 'loading' at once, not after the manifest timeout.
  test('G: retry switches to loading synchronously', async () => {
    (globalThis as { fetch: unknown }).fetch = jest.fn(async () => {
      throw new Error('network down');
    });
    let latest: ArchivePreloadResult | undefined;
    let renderer!: TestRenderer.ReactTestRenderer;
    await act(async () => {
      renderer = TestRenderer.create(<Probe required={['words/a.zip']} onResult={(result) => (latest = result)} />);
    });
    await flushMicrotasks();
    expect(latest?.status).toBe('offline');

    // Backend still unanswered (manifest fetch hangs): status must already be 'loading'.
    let rejectHangingFetch: (error: Error) => void = () => undefined;
    (globalThis as { fetch: unknown }).fetch = jest.fn(
      () =>
        new Promise<Response>((_, reject) => {
          rejectHangingFetch = reject;
        })
    );
    await act(async () => {
      latest?.retry();
    });
    expect(latest?.status).toBe('loading');
    await act(async () => {
      renderer.unmount();
    });
    // Settle the hanging fetch so fetchWithTimeout clears its 8 s timer (no "Jest did not exit" warning).
    // Any follow-up fetch of the unmounted run (archive load after the manifest failure) fails at once as well.
    (globalThis as { fetch: unknown }).fetch = jest.fn(async () => {
      throw new Error('test end');
    });
    rejectHangingFetch(new Error('test end'));
    await flushMicrotasks();
  });
});
