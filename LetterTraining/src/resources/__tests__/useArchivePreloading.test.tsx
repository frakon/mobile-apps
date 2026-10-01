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
    const path = Object.keys(served).find((key) => url.endsWith(key));
    if (path === undefined) {
      throw new Error('network down');
    }
    const gate = gates[path];
    if (gate) {
      await gate.promise;
    }
    return { ok: true, status: 200, arrayBuffer: async () => served[path].slice().buffer } as unknown as Response;
  });
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
});
