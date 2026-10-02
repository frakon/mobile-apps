// expo-file-system implementation of CacheFileSystem (device side; unit tests use an in-memory
// mock instead — see __tests__/cacheCore.test.ts). Uses the SDK 57 File/Directory API, which is
// Expo Go-compatible (no custom native module needed).
// `_LetterTraining_PROMPTS.md` / "## Follow-up prompt 9 — mobile-apps-preferences (backend resources, cache, preload)".

import { Directory, File, Paths } from 'expo-file-system';
import { Platform } from 'react-native';

import { CacheFileSystem } from './types';

// expo-file-system is not supported on web (dev browser preview): fall back to a per-session
// in-memory store so downloads/unpacking still work; nothing persists across page reloads.
function createInMemoryCacheFileSystem(): CacheFileSystem {
  const files = new Map<string, string | Uint8Array>();
  return {
    async readText(fileName: string): Promise<string | null> {
      const content = files.get(fileName);
      return typeof content === 'string' ? content : null;
    },
    async writeText(fileName: string, content: string): Promise<void> {
      files.set(fileName, content);
    },
    async readBinary(fileName: string): Promise<Uint8Array> {
      const content = files.get(fileName);
      if (!(content instanceof Uint8Array)) {
        throw new Error(`Cached file missing: ${fileName}`);
      }
      return content;
    },
    async writeBinary(fileName: string, data: Uint8Array): Promise<void> {
      files.set(fileName, data);
    },
    async deleteFile(fileName: string): Promise<void> {
      files.delete(fileName);
    },
  };
}

const CACHE_DIRECTORY_NAME = 'backendResourceCache';

function cacheDirectory(): Directory {
  const directory = new Directory(Paths.cache, CACHE_DIRECTORY_NAME);
  if (!directory.exists) {
    directory.create({ intermediates: true, idempotent: true });
  }
  return directory;
}

export function createExpoCacheFileSystem(): CacheFileSystem {
  if (Platform.OS === 'web') {
    return createInMemoryCacheFileSystem();
  }
  return {
    async readText(fileName: string): Promise<string | null> {
      const file = new File(cacheDirectory(), fileName);
      if (!file.exists) {
        return null;
      }
      return file.text();
    },

    async writeText(fileName: string, content: string): Promise<void> {
      new File(cacheDirectory(), fileName).write(content);
    },

    async readBinary(fileName: string): Promise<Uint8Array> {
      const file = new File(cacheDirectory(), fileName);
      if (!file.exists) {
        throw new Error(`Cached file missing: ${fileName}`);
      }
      return file.bytes();
    },

    async writeBinary(fileName: string, data: Uint8Array): Promise<void> {
      new File(cacheDirectory(), fileName).write(data);
    },

    async deleteFile(fileName: string): Promise<void> {
      const file = new File(cacheDirectory(), fileName);
      if (file.exists) {
        file.delete();
      }
    },
  };
}
