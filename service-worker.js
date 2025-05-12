// -----------------------------
// ✅ Progressive Web App – Service Worker
// -----------------------------
const CACHE_VERSION = 'v2.5';
const CACHE_NAME    = `checkreel-cache-${CACHE_VERSION}`;

/* Static assets – cached once, served cache-first */
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/dashboard.html',
  '/styles.css',
  '/app.js',
  '/dashboard.js',
  '/lang-loader.js',
  '/manifest.json',
  '/images/favicon.png',
  '/images/checkreel-logo.png',
  '/images/platform-logos/facebook.png',
  '/images/platform-logos/instagram.png',
  '/images/platform-logos/youtube.png',
  '/images/platform-logos/tiktok.png',
  '/images/platform-logos/threads.png',
  '/images/platform-logos/twitter.png',
  '/images/platform-logos/snapchat.png',
  '/lang/en.json',
  '/lang/fr.json',
  '/lang/ar.json'
];

/* ---------------- INSTALL ---------------- */
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(STATIC_ASSETS))
  );
  self.skipWaiting();
});

/* ---------------- ACTIVATE ---------------- */
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys
          .filter(k => k.startsWith('checkreel-cache-') && k !== CACHE_NAME)
          .map(k => caches.delete(k))
      )
    )
  );
  self.clients.claim();
});

/* ---------------- FETCH ---------------- */
self.addEventListener('fetch', event => {
  const { request } = event;
  if (request.method !== 'GET') return;

  const urlPath = new URL(request.url).pathname;

  /* cache-first for known statics */
  if (STATIC_ASSETS.includes(urlPath)) {
    event.respondWith(
      caches.match(request).then(res => res || fetch(request))
    );
    return;
  }

  /* network-first for everything else */
  event.respondWith(
    fetch(request)
      .then(res => {
        const clone = res.clone();
        caches.open(CACHE_NAME).then(c => c.put(request, clone));
        return res;
      })
      .catch(() => caches.match(request))
  );
});

/* ---------------- MESSAGE ---------------- */
self.addEventListener('message', event => {
  if (event.data === 'clearCaches') {
    caches.keys().then(keys => keys.forEach(k => caches.delete(k)));
  }
});

/* v2.5 · 2025-05-13 */
