// -----------------------------
// ✅ Progressive Web App: Service Worker
// -----------------------------

const CACHE_VERSION = 'v2.0';
const CACHE_NAME = `checkreel-cache-${CACHE_VERSION}`;

// Static assets to always cache
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/styles.css',
  '/app.js',
  '/images/favicon.png',
  '/images/checkreel-logo.png',
  '/manifest.json'
];

// Files we want to always fetch fresh if possible
const DYNAMIC_FILES = [
  '/dashboard.html',
  '/dashboard.js'
];

// ✅ INSTALL: Cache static files
self.addEventListener('install', event => {
  console.log('[SW] Installing and caching static assets...');
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(STATIC_ASSETS))
  );
  self.skipWaiting();
});

// ✅ ACTIVATE: Clear old caches
self.addEventListener('activate', event => {
  console.log('[SW] Activating new service worker...');
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys
          .filter(key => key.startsWith('checkreel-cache-') && key !== CACHE_NAME)
          .map(key => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

// ✅ FETCH: Handle asset loading
self.addEventListener('fetch', event => {
  const { request } = event;

  // ❌ Don’t cache POST or other non-GET methods
  if (request.method !== 'GET') return;

  const url = new URL(request.url);
  const isDynamic = DYNAMIC_FILES.some(file =>
    url.pathname.endsWith(file) || url.pathname === file
  );

  if (isDynamic) {
    // 🔄 Network-first strategy
    event.respondWith(
      fetch(request)
        .then(response => {
          const clone = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(request, clone));
          return response;
        })
        .catch(() => caches.match(request))
    );
  } else {
    // 📦 Cache-first for static assets
    event.respondWith(
      caches.match(request).then(cached =>
        cached || fetch(request).then(response => {
          const clone = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(request, clone));
          return response;
        })
      )
    );
  }
});

// ✅ LISTEN: Language change or manual cache clearing
self.addEventListener('message', event => {
  if (event.data && event.data.action === 'clearDynamicCache') {
    clearDynamicCache();
  }
});

// 🔧 Helper: Clear dashboard cache
function clearDynamicCache() {
  caches.open(CACHE_NAME).then(cache => {
    DYNAMIC_FILES.forEach(file => {
      cache.delete(file).then(success => {
        if (success) console.log(`[SW] Cleared: ${file}`);
      });
    });
  });
}
/* v2.1 – 2025-05-13: cache-bust after icon-path fix */
