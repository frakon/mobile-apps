// ResourceBackend static fileserver — see README.md and
// C:\GIT\mobile-apps2\LetterTraining\_LetterTraining_PROMPTS.md (section "Mobile-apps-preferences
// application", decisions 1 and 11): serves the pack.js output (per-word zips + manifest.json)
// to the mobile apps. VPN-only by design: binds the WireGuard hub address 10.67.0.1 by default,
// so it is unreachable from the public internet (nothing binds the server's public IP here).
//
// Usage: node server.js            (binds RESOURCE_BACKEND_HOST:RESOURCE_BACKEND_PORT, defaults 10.67.0.1:9080)
//   env RESOURCE_BACKEND_HOST  bind address (default 10.67.0.1; use 127.0.0.1 for local testing)
//   env RESOURCE_BACKEND_PORT  port (default 9080 — reserved for this backend, see README.md)
//   env RESOURCE_BACKEND_ROOT  served directory (default ./dist next to this file)

'use strict';
const http = require('http');
const fs = require('fs');
const path = require('path');

const host = process.env.RESOURCE_BACKEND_HOST || '10.67.0.1';
const port = Number(process.env.RESOURCE_BACKEND_PORT || 9080);
const rootDir = path.resolve(__dirname, process.env.RESOURCE_BACKEND_ROOT || 'dist');

const CONTENT_TYPES = { '.zip': 'application/zip', '.json': 'application/json; charset=utf-8' };

const server = http.createServer((request, response) => {
  if (request.method !== 'GET' && request.method !== 'HEAD') {
    response.writeHead(405).end();
    return;
  }
  // Resolve inside rootDir only — reject any path escaping it (e.g. "..").
  const requestPath = decodeURIComponent(new URL(request.url, 'http://x').pathname);
  const filePath = path.normalize(path.join(rootDir, requestPath));
  if (!filePath.startsWith(rootDir + path.sep) && filePath !== rootDir) {
    response.writeHead(403).end();
    return;
  }
  let fileStat;
  try {
    fileStat = fs.statSync(filePath);
  } catch {
    response.writeHead(404).end();
    return;
  }
  if (!fileStat.isFile()) {
    response.writeHead(404).end();
    return;
  }
  const extension = path.extname(filePath).toLowerCase();
  response.writeHead(200, {
    'Content-Type': CONTENT_TYPES[extension] || 'application/octet-stream',
    'Content-Length': fileStat.size,
    // The app's cache invalidation runs off manifest.json version/checksums, not HTTP caching;
    // no-cache keeps any intermediate layer from serving a stale manifest or a replaced archive.
    'Cache-Control': 'no-cache',
  });
  if (request.method === 'HEAD') {
    response.end();
    return;
  }
  fs.createReadStream(filePath).pipe(response);
});

server.listen(port, host, () => {
  console.log(`ResourceBackend serving ${rootDir} on http://${host}:${port}/ (VPN-only bind)`);
});
