// TreninkPorozumeni copy (adapted): _TreninkPorozumeni_Fields123_PROMPTS.md — "User request 26" (mobile-apps-preferences skill).
// expo-file-system implementation of CacheFileSystem (device side; unit tests use an in-memory
// mock instead — see __tests__/cacheCore.test.ts). Uses the SDK 57 File/Directory API, which is
// Expo Go-compatible (no custom native module needed).
// `_LetterTraining_PROMPTS.md` / "## Follow-up prompt 9 — mobile-apps-preferences (backend resources, cache, preload)".

import { Directory, File, Paths } from 'expo-file-system';

import { CacheFileSystem } from './types';

// App-specific folder so it can never clash with LetterTraining (_TreninkPorozumeni_Fields123_PROMPTS.md — User request 26).
const CACHE_DIRECTORY_NAME = 'treninkPorozumeniResourceCache';

function cacheDirectory(): Directory {
  const directory = new Directory(Paths.cache, CACHE_DIRECTORY_NAME);
  if (!directory.exists) {
    directory.create({ intermediates: true, idempotent: true });
  }
  return directory;
}

// TreninkPorozumeni ("User request 26"): hot audio of the preloaded rounds as local files (file:// URIs for
// playAudio). The directory holds only the CURRENT preload window; it is wiped once per app run on first use
// (left-overs of a killed previous run) and every released archive deletes its own files.
const HOT_AUDIO_DIRECTORY_NAME = 'porozumeniHotAudio';
let hotAudioDirectoryInitialized = false;

function hotAudioDirectory(): Directory {
  const directory = new Directory(Paths.cache, HOT_AUDIO_DIRECTORY_NAME);
  if (!hotAudioDirectoryInitialized) {
    hotAudioDirectoryInitialized = true;
    if (directory.exists) {
      directory.delete();
    }
  }
  if (!directory.exists) {
    directory.create({ intermediates: true, idempotent: true });
  }
  return directory;
}

export function writeHotAudioFile(fileName: string, data: Uint8Array): string {
  const file = new File(hotAudioDirectory(), fileName);
  file.write(data);
  return file.uri;
}

export function deleteHotAudioFile(fileName: string): void {
  try {
    const file = new File(hotAudioDirectory(), fileName);
    if (file.exists) {
      file.delete();
    }
  } catch {
    // Best effort: a left-over file is wiped on the next app run.
  }
}

export function createExpoCacheFileSystem(): CacheFileSystem {
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
