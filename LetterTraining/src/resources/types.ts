// Shared backend-resource module — types. Self-contained under src/resources/ so the
// standalone LetterPexeso app can copy the whole folder unchanged.
// `_LetterTraining_PROMPTS.md` / "## Follow-up prompt 9 — mobile-apps-preferences (backend resources, cache, preload)".

// Shape of the backend `manifest.json` (served next to the archives; see src/resources/README.md
// for the authoritative documentation Phase A's packer must conform to).
export type ResourceManifest = {
  // Global version — changes whenever ANY archive changes (e.g. "20261001T120000Z" or a content hash).
  version: string;
  // Informational timestamp of the packer run (ISO 8601 UTC).
  generatedAtUtc: string;
  // Relative archive path (e.g. "words/auto.zip") → its identity + size.
  archives: Record<string, ManifestArchiveEntry>;
};

export type ManifestArchiveEntry = {
  // SHA-256 (lowercase hex) of the zip file — identity token: a changed checksum means the
  // cached copy is stale and MUST be replaced ("new version must always replace the old cached version").
  sha256: string;
  // Compressed size in bytes — counts toward the 200MB device cache limit.
  bytes: number;
};

// One entry of the on-device cache index (persisted as JSON next to the cached zips).
export type CacheIndexEntry = {
  // Relative archive path, equal to the manifest key (also used, sanitized, as the file name).
  archivePath: string;
  // sha256 of the manifest entry this file was downloaded under.
  sha256: string;
  // Compressed byte size on disk.
  bytes: number;
  // Last-used timestamp (epoch milliseconds) — basis of the LRU eviction.
  lastUsedMs: number;
};

export type CacheIndex = {
  entries: CacheIndexEntry[];
};

// Minimal filesystem the cache needs — implemented by expoFileSystemAdapter.ts on device and by
// an in-memory mock in unit tests.
export interface CacheFileSystem {
  readText(fileName: string): Promise<string | null>;
  writeText(fileName: string, content: string): Promise<void>;
  readBinary(fileName: string): Promise<Uint8Array>;
  writeBinary(fileName: string, data: Uint8Array): Promise<void>;
  // Deletes exactly one file; missing file is not an error.
  deleteFile(fileName: string): Promise<void>;
}

// Downloads one archive and returns its raw (compressed) bytes; throws on network failure.
export type ArchiveDownloader = (archivePath: string) => Promise<Uint8Array>;

// One file unpacked from an archive, ready to use without further IO.
export type UnpackedFile = {
  bytes: Uint8Array;
  // data: URI usable directly as an <Image source={{ uri }}> or an expo-audio AudioSource
  // ({ uri }) — the whole content is in memory ("hot"), nothing is loaded from disk at play time.
  dataUri: string;
};

export type UnpackedArchive = {
  archivePath: string;
  // File name inside the zip (e.g. "picture.png", "word.mp3") → unpacked content.
  files: Record<string, UnpackedFile>;
};
