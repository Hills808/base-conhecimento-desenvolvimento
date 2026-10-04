import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
const root = path.resolve(import.meta.dirname, '../dist');
const base = '/base-conhecimento-desenvolvimento/';
const files = [];
function visit(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const file = path.join(dir, entry.name);
    if (entry.isDirectory()) visit(file);
    else if (entry.name !== 'sw.js' && !['furina-buddy.png', 'furina-idle.webp', 'furina-dance.webp'].includes(entry.name)) files.push(file);
  }
}
visit(root); files.sort();
const hash = crypto.createHash('sha256'); files.forEach(file => hash.update(fs.readFileSync(file)));
const version = hash.digest('hex').slice(0, 16);
const urls = files.map(file => base + path.relative(root, file).replaceAll(path.sep, '/'));
urls.push(base);
fs.writeFileSync(path.join(root, 'sw.js'), `// Generated from this build. Cache only this public study site.
const BASE = ${JSON.stringify(base)};
const PREFIX = 'curva-aberta-base-conhecimento-offline-';
const CACHE = PREFIX + ${JSON.stringify(version)};
const URLS = ${JSON.stringify(urls)};
self.addEventListener('install', event => event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(URLS))));
self.addEventListener('activate', event => event.waitUntil(Promise.all([
  caches.keys().then(keys => Promise.all(keys.filter(key => key.startsWith(PREFIX) && key !== CACHE).map(key => caches.delete(key)))),
  self.clients.claim()
])));
self.addEventListener('message', event => { if (event.data === 'APPLY_STUDY_UPDATE') self.skipWaiting(); });
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);
  if (event.request.method !== 'GET' || url.origin !== self.location.origin || !url.pathname.startsWith(BASE)) return;
  if (event.request.mode === 'navigate') {
    // The shell and its assets always come from the same build version.
    event.respondWith(caches.open(CACHE).then(async cache => (await cache.match(BASE)) || fetch(event.request)));
  } else event.respondWith(caches.open(CACHE).then(async cache => (await cache.match(event.request, { ignoreSearch: true })) || fetch(event.request)));
});
`);
console.log(`Offline version ${version}: ${urls.length} public files. Updates wait for explicit activation.`);
