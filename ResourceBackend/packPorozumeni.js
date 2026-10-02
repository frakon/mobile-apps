// TreninkPorozumeni archive group for the ResourceBackend packer (called from pack.js).
// Requested in TreninkPorozumeni/_TreninkPorozumeni_Fields123_PROMPTS.md — "User request 26"
// (apply the mobile-apps-preferences skill: per-exercise resources served by the backend, per-item
// archives, manifest with version + per-archive sha256/size).
//
// Output (under <out>/porozumeni/, served as a SEPARATE manifest so the LetterTraining manifest stays
// small and unchanged — the app configures its backend base URL as <server>/porozumeni):
//   porozumeni/manifest.json          { version, generatedAtUtc, archives: { "items/<id>.zip": {sha256, bytes, files} } }
//   porozumeni/items/<id>.zip         one store-mode zip per example id with FIXED inner names:
//     sentence.mp3, target.png, gram.png, lexa.png, lexb.png, gram_why.mp3, lexa_why.mp3, lexb_why.mp3,
//     v2_sentence.mp3, v2_gram_why.mp3, v2_lexa_why.mp3, v2_lexb_why.mp3 (each only when the item has it).
//
// The item -> files mapping is NOT duplicated anywhere: it is parsed from the app's item definitions
// (src/items.ts + src/items/*.ts) — every `<slot>: require('<path>')` line inside an item object,
// where the item is identified by its `id: '<id>'` line and the swapped-variant block by
// `swappedVariant: {`. The parser fails loudly when the number of parsed requires differs from the
// number of `require(` occurrences in a file (a format change must not silently drop resources).
// The app resolves the same fixed inner names (TreninkPorozumeni/src/itemResources.ts).

'use strict';
const fs = require('fs');
const path = require('path');

// Item field name -> fixed inner entry name (base variant). The swapped variant prefixes `v2_`.
const SLOT_ENTRY_NAMES = {
  audio: 'sentence.mp3',
  targetImage: 'target.png',
  grammaticalDistractorImage: 'gram.png',
  lexicalDistractorAImage: 'lexa.png',
  lexicalDistractorBImage: 'lexb.png',
  grammaticalDistractorExplanationAudio: 'gram_why.mp3',
  lexicalDistractorAExplanationAudio: 'lexa_why.mp3',
  lexicalDistractorBExplanationAudio: 'lexb_why.mp3',
};

// Non-runtime files (provenance .txt, notes .md, partial downloads .part) never reach the archives.
function isNonRuntimeFile(filePath) {
  const lower = filePath.toLowerCase();
  return lower.endsWith('.txt') || lower.endsWith('.md') || lower.endsWith('.part');
}

// Parses one item-definition file into Map<id, { [entryName]: absoluteSourcePath }>.
function parseItemFile(filePath, items) {
  const lines = fs.readFileSync(filePath, 'utf8').split(/\r?\n/);
  const requireCount = (fs.readFileSync(filePath, 'utf8').match(/require\(/g) || []).length;
  let currentId = null;
  let inSwapped = false;
  let parsed = 0;
  for (const line of lines) {
    const idMatch = /^\s*id:\s*'([^']+)'/.exec(line);
    if (idMatch) {
      currentId = idMatch[1];
      inSwapped = false;
      if (items.has(currentId)) {
        throw new Error(`Duplicate example id '${currentId}' (${filePath})`);
      }
      items.set(currentId, {});
      continue;
    }
    if (/^\s*swappedVariant:\s*\{/.test(line)) {
      inSwapped = true;
      continue;
    }
    const requireMatch = /^\s*(\w+):\s*require\('([^']+)'\)/.exec(line);
    if (!requireMatch) {
      continue;
    }
    const [, slot, relativePath] = requireMatch;
    const baseName = SLOT_ENTRY_NAMES[slot];
    if (currentId === null || baseName === undefined) {
      throw new Error(`Unexpected require outside a known item slot: '${line.trim()}' (${filePath})`);
    }
    const entryName = (inSwapped ? 'v2_' : '') + baseName;
    const entries = items.get(currentId);
    if (entries[entryName] !== undefined) {
      throw new Error(`Duplicate entry ${entryName} for '${currentId}' (${filePath})`);
    }
    entries[entryName] = path.resolve(path.dirname(filePath), relativePath);
    parsed++;
  }
  if (parsed !== requireCount) {
    throw new Error(`${filePath}: parsed ${parsed} item requires but the file has ${requireCount} require( calls`);
  }
}

// Returns Map<id, entries> over src/items.ts + src/items/*.ts of the given app folder.
function collectPorozumeniItems(appDir) {
  const items = new Map();
  const files = [path.join(appDir, 'src', 'items.ts')];
  const itemsDir = path.join(appDir, 'src', 'items');
  if (fs.existsSync(itemsDir)) {
    for (const f of fs.readdirSync(itemsDir).filter((name) => name.endsWith('.ts')).sort()) {
      files.push(path.join(itemsDir, f));
    }
  }
  for (const file of files) {
    parseItemFile(file, items);
  }
  return items;
}

// Packs every item into <outDir>/porozumeni/items/<id>.zip and writes <outDir>/porozumeni/manifest.json.
// writeArchive / sha256 are pack.js helpers (same deterministic store-mode zip settings).
function packPorozumeni({ appDir, outDir, writeArchive, sha256 }) {
  const groupDir = path.join(outDir, 'porozumeni');
  const groupArchives = {};
  const missing = [];
  const items = collectPorozumeniItems(appDir);
  // writeArchive writes relative to outDir; prefix with 'porozumeni/' and strip it for the group manifest key.
  const writtenArchives = {};
  for (const id of [...items.keys()].sort()) {
    const entries = {};
    for (const [entryName, sourcePath] of Object.entries(items.get(id))) {
      if (isNonRuntimeFile(sourcePath)) {
        continue;
      }
      if (!fs.existsSync(sourcePath)) {
        missing.push(`${id}: ${entryName} <- ${sourcePath}`);
        continue;
      }
      entries[entryName] = sourcePath;
    }
    if (Object.keys(entries).length === 0) {
      continue;
    }
    writeArchive(path.join('porozumeni', 'items', id + '.zip'), entries, writtenArchives);
  }
  for (const [key, value] of Object.entries(writtenArchives)) {
    groupArchives[key.replace(/^porozumeni\//, '')] = value;
  }
  const versionHash = sha256(Buffer.from(
    Object.keys(groupArchives).sort().map((k) => k + ':' + groupArchives[k].sha256).join('\n')));
  const manifest = {
    version: versionHash.slice(0, 16),
    generatedAtUtc: new Date().toISOString(),
    archives: groupArchives,
  };
  fs.mkdirSync(groupDir, { recursive: true });
  fs.writeFileSync(path.join(groupDir, 'manifest.json'), JSON.stringify(manifest, null, 1));
  const totalBytes = Object.values(groupArchives).reduce((sum, a) => sum + a.bytes, 0);
  console.log(`TreninkPorozumeni: packed ${Object.keys(groupArchives).length} item zips ` +
    `(${items.size} items parsed), total ${(totalBytes / 1024 / 1024).toFixed(1)} MB, version ${manifest.version}.`);
  if (missing.length > 0) {
    console.warn(`TreninkPorozumeni: ${missing.length} referenced files are MISSING (entries skipped):\n  ` +
      missing.slice(0, 50).join('\n  '));
  }
  return { manifest, missing };
}

module.exports = { packPorozumeni, collectPorozumeniItems, SLOT_ENTRY_NAMES };
