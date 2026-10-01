// Pure-JS base64 encoder — used to build data: URIs from unpacked archive bytes.
// Own implementation instead of global btoa: btoa takes a binary STRING (needs an extra
// byte→char pass and is not guaranteed across all Hermes/jest environments), while this works
// on Uint8Array directly and runs identically in unit tests.

const BASE64_ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';

export function bytesToBase64(bytes: Uint8Array): string {
  const parts: string[] = [];
  for (let index = 0; index < bytes.length; index += 3) {
    const byte0 = bytes[index];
    const byte1 = index + 1 < bytes.length ? bytes[index + 1] : 0;
    const byte2 = index + 2 < bytes.length ? bytes[index + 2] : 0;
    const triple = (byte0 << 16) | (byte1 << 8) | byte2;
    parts.push(
      BASE64_ALPHABET[(triple >> 18) & 0x3f],
      BASE64_ALPHABET[(triple >> 12) & 0x3f],
      index + 1 < bytes.length ? BASE64_ALPHABET[(triple >> 6) & 0x3f] : '=',
      index + 2 < bytes.length ? BASE64_ALPHABET[triple & 0x3f] : '='
    );
  }
  return parts.join('');
}

// Media type by file extension — enough for the archive contents we serve (png/jpg images, mp3 audio).
export function mediaTypeForFileName(fileName: string): string {
  const lower = fileName.toLowerCase();
  if (lower.endsWith('.png')) {
    return 'image/png';
  }
  if (lower.endsWith('.jpg') || lower.endsWith('.jpeg')) {
    return 'image/jpeg';
  }
  if (lower.endsWith('.webp')) {
    return 'image/webp';
  }
  if (lower.endsWith('.mp3')) {
    return 'audio/mpeg';
  }
  if (lower.endsWith('.m4a')) {
    return 'audio/mp4';
  }
  if (lower.endsWith('.wav')) {
    return 'audio/wav';
  }
  return 'application/octet-stream';
}

export function bytesToDataUri(fileName: string, bytes: Uint8Array): string {
  return `data:${mediaTypeForFileName(fileName)};base64,${bytesToBase64(bytes)}`;
}
