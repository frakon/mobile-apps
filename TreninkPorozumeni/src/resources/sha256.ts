// Pure-JS SHA-256 (lowercase hex) for verifying downloaded archives against the manifest checksum.
// _TreninkPorozumeni_Fields123_PROMPTS.md — User request 26 (mobile-apps-preferences, repair R1 item 3).
// No native crypto dependency (Expo Go compatible). Archives are ~0.9 MB median, up to ~2.1 MB, which takes
// hundreds of ms in an interpreter, so downloads use sha256HexAsync: 64 KB chunks with a setTimeout(0) yield
// between them, serialized through one shared queue (repair R2, _TreninkPorozumeni_Fields123_PROMPTS.md — User request 26).

const ROUND_CONSTANTS = new Uint32Array([
  0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,
  0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
  0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
  0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
  0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13, 0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
  0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
  0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3,
  0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208, 0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2,
]);

const CHUNK_BYTES = 64 * 1024; // multiple of 64 (block size)

type HashState = { hash: Uint32Array; words: Uint32Array; view: DataView; paddedLength: number };

function createState(data: Uint8Array): HashState {
  const bitLength = data.length * 8;
  const paddedLength = Math.ceil((data.length + 9) / 64) * 64;
  const padded = new Uint8Array(paddedLength);
  padded.set(data);
  padded[data.length] = 0x80;
  const view = new DataView(padded.buffer);
  view.setUint32(paddedLength - 8, Math.floor(bitLength / 0x100000000));
  view.setUint32(paddedLength - 4, bitLength >>> 0);
  const hash = new Uint32Array([
    0x6a09e667, 0xbb67ae85, 0x3c6ef372, 0xa54ff53a, 0x510e527f, 0x9b05688c, 0x1f83d9ab, 0x5be0cd19,
  ]);
  return { hash, words: new Uint32Array(64), view, paddedLength };
}

const rotateRight = (value: number, bits: number) => (value >>> bits) | (value << (32 - bits));

function processBlocks(state: HashState, startOffset: number, endOffset: number): void {
  const { hash, words, view } = state;
  for (let offset = startOffset; offset < endOffset; offset += 64) {
    for (let index = 0; index < 16; index++) {
      words[index] = view.getUint32(offset + index * 4);
    }
    for (let index = 16; index < 64; index++) {
      const previous15 = words[index - 15];
      const previous2 = words[index - 2];
      const sigma0 = rotateRight(previous15, 7) ^ rotateRight(previous15, 18) ^ (previous15 >>> 3);
      const sigma1 = rotateRight(previous2, 17) ^ rotateRight(previous2, 19) ^ (previous2 >>> 10);
      words[index] = (words[index - 16] + sigma0 + words[index - 7] + sigma1) >>> 0;
    }
    let a = hash[0], b = hash[1], c = hash[2], d = hash[3], e = hash[4], f = hash[5], g = hash[6], h = hash[7];
    for (let index = 0; index < 64; index++) {
      const sum1 = rotateRight(e, 6) ^ rotateRight(e, 11) ^ rotateRight(e, 25);
      const choice = (e & f) ^ (~e & g);
      const temporary1 = (h + sum1 + choice + ROUND_CONSTANTS[index] + words[index]) >>> 0;
      const sum0 = rotateRight(a, 2) ^ rotateRight(a, 13) ^ rotateRight(a, 22);
      const majority = (a & b) ^ (a & c) ^ (b & c);
      const temporary2 = (sum0 + majority) >>> 0;
      h = g; g = f; f = e; e = (d + temporary1) >>> 0;
      d = c; c = b; b = a; a = (temporary1 + temporary2) >>> 0;
    }
    hash[0] += a; hash[1] += b; hash[2] += c; hash[3] += d;
    hash[4] += e; hash[5] += f; hash[6] += g; hash[7] += h;
  }
}

const toHex = (state: HashState) => Array.from(state.hash, (word) => word.toString(16).padStart(8, '0')).join('');

// Synchronous variant (tests / tiny inputs only).
export function sha256Hex(data: Uint8Array): string {
  const state = createState(data);
  processBlocks(state, 0, state.paddedLength);
  return toHex(state);
}

const yieldToEventLoop = () => new Promise<void>((resolve) => setTimeout(resolve, 0));

// One shared queue: parallel downloads hash one after another (never interleaved), and
// priority jobs (the current, required round) jump ahead of queued prefetch jobs.
type QueueJob = { run: () => Promise<void>; priority: boolean };
const hashQueue: QueueJob[] = [];
let queueRunning = false;

async function drainQueue(): Promise<void> {
  if (queueRunning) {
    return;
  }
  queueRunning = true;
  try {
    while (hashQueue.length > 0) {
      const job = hashQueue.shift()!;
      await job.run();
    }
  } finally {
    queueRunning = false;
  }
}

// Non-blocking SHA-256: identical result to sha256Hex, but processes CHUNK_BYTES per event-loop turn.
export function sha256HexAsync(data: Uint8Array, priority = false): Promise<string> {
  return new Promise<string>((resolve, reject) => {
    const job: QueueJob = {
      priority,
      run: async () => {
        try {
          const state = createState(data);
          for (let offset = 0; offset < state.paddedLength; offset += CHUNK_BYTES) {
            processBlocks(state, offset, Math.min(offset + CHUNK_BYTES, state.paddedLength));
            await yieldToEventLoop();
          }
          resolve(toHex(state));
        } catch (error) {
          reject(error);
        }
      },
    };
    if (priority) {
      const firstNonPriority = hashQueue.findIndex((queued) => !queued.priority);
      hashQueue.splice(firstNonPriority === -1 ? hashQueue.length : firstNonPriority, 0, job);
    } else {
      hashQueue.push(job);
    }
    void drainQueue();
  });
}
