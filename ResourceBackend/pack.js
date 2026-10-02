// ResourceBackend packer — see README.md and C:\GIT\mobile-apps2\LetterTraining\_LetterTraining_PROMPTS.md
// (section "Mobile-apps-preferences application", decisions 1/2/5/10/11): builds per-word zip archives
// (word picture + all audio variants), per-letter syllable zips, one train zip, and a manifest.json
// with a global content-derived version + per-archive sha256/size so the app can invalidate stale cache.
// Blind-test logs / *.txt / *.md files are excluded by design (they no longer live under assets/ anyway).
//
// Usage: node pack.js [--assets <dir>] [--porozumeni <dir>] [--out <dir>]
//   --assets  LetterTraining assets dir (default: ../LetterTraining/assets relative to this file)
//   --porozumeni  TreninkPorozumeni app dir (default: ../TreninkPorozumeni) — its per-item zips go to
//                 <out>/porozumeni/ with their own manifest (packPorozumeni.js; "User request 26")
//   --out     output dir (default: ./dist relative to this file) — gitignored build output

'use strict';
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { zipSync } = require('fflate');

function argValue(name, defaultValue) {
  const index = process.argv.indexOf(name);
  return index >= 0 && process.argv[index + 1] ? process.argv[index + 1] : defaultValue;
}

const assetsDir = path.resolve(__dirname, argValue('--assets', path.join('..', 'LetterTraining', 'assets')));
const outDir = path.resolve(__dirname, argValue('--out', 'dist'));
const porozumeniAppDir = path.resolve(__dirname, argValue('--porozumeni', path.join('..', 'TreninkPorozumeni')));

const imagesDir = path.join(assetsDir, 'images');
const audioDir = path.join(assetsDir, 'audio');
const trainDir = path.join(assetsDir, 'train');

// Deterministic zips: fixed mtime so an unchanged word produces an unchanged sha256 across runs
// (otherwise every repack would look like a new version to the app cache).
const FIXED_MTIME = new Date('2020-01-01T00:00:00Z');
// PNG/MP3 are already compressed — store them (level 0): fastest to pack/unpack, no size win from deflate.
const ZIP_OPTIONS = { level: 0, mtime: FIXED_MTIME };

function listFiles(dir, extension) {
  if (!fs.existsSync(dir)) { return []; }
  return fs.readdirSync(dir).filter((f) => f.toLowerCase().endsWith(extension)).sort();
}

function isExcluded(fileName) {
  // Decision 10: blind-test logs and .txt/.md files never reach the backend archives.
  // pexeso_ear.png is a BUNDLED UI asset (sound-card face), not a word — it must not become a
  // stray words/pexeso_ear.zip (verification Phase C R1 L5).
  return fileName.endsWith('.txt') || fileName.endsWith('.md') || fileName.startsWith('_blind_test_log')
    || fileName === 'pexeso_ear.png';
}

function sha256(buffer) {
  return crypto.createHash('sha256').update(buffer).digest('hex');
}

function writeArchive(relativeZipPath, entries, manifestArchives) {
  // entries: { nameInsideZip: absoluteSourcePath }
  const zipInput = {};
  const fileNames = [];
  for (const [nameInsideZip, sourcePath] of Object.entries(entries)) {
    zipInput[nameInsideZip] = [fs.readFileSync(sourcePath), ZIP_OPTIONS];
    fileNames.push(nameInsideZip);
  }
  const zipped = Buffer.from(zipSync(zipInput, ZIP_OPTIONS));
  const targetPath = path.join(outDir, relativeZipPath);
  fs.mkdirSync(path.dirname(targetPath), { recursive: true });
  fs.writeFileSync(targetPath, zipped);
  manifestArchives[relativeZipPath.replace(/\\/g, '/')] = {
    sha256: sha256(zipped),
    bytes: zipped.length,
    files: fileNames,
  };
}

fs.mkdirSync(outDir, { recursive: true });
const manifestArchives = {};

// --- Per-word archives (decision 5): one zip per word = picture + word/first/last audio variants.
// Union of names across images and all word-audio folders (some words have audio without a picture).
const wordNames = new Set();
for (const f of listFiles(imagesDir, '.png')) { if (!isExcluded(f)) { wordNames.add(f.slice(0, -4)); } }
for (const sub of ['words', 'words_first', 'words_last']) {
  for (const f of listFiles(path.join(audioDir, sub), '.mp3')) { wordNames.add(f.slice(0, -4)); }
}
let wordCount = 0;
for (const word of [...wordNames].sort()) {
  const entries = {};
  const picture = path.join(imagesDir, word + '.png');
  if (fs.existsSync(picture)) { entries['picture.png'] = picture; }
  const variants = { 'word.mp3': 'words', 'first.mp3': 'words_first', 'last.mp3': 'words_last' };
  for (const [nameInsideZip, sub] of Object.entries(variants)) {
    const mp3 = path.join(audioDir, sub, word + '.mp3');
    if (fs.existsSync(mp3)) { entries[nameInsideZip] = mp3; }
  }
  if (Object.keys(entries).length === 0) { continue; }
  writeArchive(path.join('words', word + '.zip'), entries, manifestArchives);
  wordCount++;
}

// --- Syllable archives, grouped per starting character of the folded file name (one zip per group).
const syllableGroups = new Map();
for (const f of listFiles(path.join(audioDir, 'syllables'), '.mp3')) {
  const group = f[0];
  if (!syllableGroups.has(group)) { syllableGroups.set(group, {}); }
  syllableGroups.get(group)[f] = path.join(audioDir, 'syllables', f);
}
for (const [group, entries] of [...syllableGroups.entries()].sort()) {
  writeArchive(path.join('syllables', group + '.zip'), entries, manifestArchives);
}

// --- Train archive: all engine/wagon pictures + the train manifest.json, one zip (small fixed set).
const trainEntries = {};
for (const sub of ['engines', 'wagons']) {
  for (const f of listFiles(path.join(trainDir, sub), '.png')) {
    if (!isExcluded(f)) { trainEntries[sub + '/' + f] = path.join(trainDir, sub, f); }
  }
}
const trainManifest = path.join(trainDir, 'manifest.json');
if (fs.existsSync(trainManifest)) { trainEntries['manifest.json'] = trainManifest; }
writeArchive(path.join('train', 'train.zip'), trainEntries, manifestArchives);

// --- Global manifest: version derived from archive contents — unchanged content => unchanged version,
// any change => new version, so the app always replaces stale cached copies (decision 1).
const versionHash = sha256(Buffer.from(
  Object.keys(manifestArchives).sort().map((k) => k + ':' + manifestArchives[k].sha256).join('\n')));
const manifest = {
  version: versionHash.slice(0, 16),
  generatedAtUtc: new Date().toISOString(),
  archives: manifestArchives,
};
fs.writeFileSync(path.join(outDir, 'manifest.json'), JSON.stringify(manifest, null, 1));

const totalBytes = Object.values(manifestArchives).reduce((sum, a) => sum + a.bytes, 0);
console.log(`Packed ${Object.keys(manifestArchives).length} archives (${wordCount} word zips, ` +
  `${syllableGroups.size} syllable zips, 1 train zip), total ${(totalBytes / 1024 / 1024).toFixed(1)} MB.`);
console.log(`Manifest version: ${manifest.version}  ->  ${path.join(outDir, 'manifest.json')}`);

// --- TreninkPorozumeni per-item archives (own manifest under porozumeni/), see packPorozumeni.js.
if (fs.existsSync(porozumeniAppDir)) {
  require('./packPorozumeni').packPorozumeni({ appDir: porozumeniAppDir, outDir, writeArchive, sha256 });
}
