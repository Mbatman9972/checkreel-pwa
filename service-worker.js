/* v2.8 – force fresh deploy */
const CACHE = 'checkreel-cache-v2.8';

const CORE = [
  '/', '/index.html', '/dashboard.html',
  '/styles.css', '/dashboard.css',
  '/app.js', '/dashboard.js', '/lang-loader.js',
  '/images/checkreel-logo.png', '/images/favicon.png',
  '/images/platform-logos/facebook.png', '/images/platform-logos/instagram.png',
  '/images/platform-logos/youtube.png', '/images/platform-logos/tiktok.png',
  '/images/platform-logos/threads.png', '/images/platform-logos/twitter.png',
  '/images/platform-logos/snapchat.png',
  '/manifest.json'
];

/* ---------- install ---------- */
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(CORE))
  );
  self.skipWaiting();
});

/* ---------- activate ---------- */
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k.startsWith('checkreel-cache-') && k !== CACHE)
                      .map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

/* ---------- fetch ---------- */
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;

  const url = new URL(e.request.url);

  /* language JSON should always be fresh → network-first */
  if (url.pathname.startsWith('/lang/')) {
    e.respondWith(
      fetch(e.request).then(r => {
        const clone = r.clone();
        caches.open(CACHE).then(c => c.put(e.request, clone));
        return r;
      }).catch(() => caches.match(e.request))
    );
    return;
  }

  /* core assets → cache-first */
  if (CORE.includes(url.pathname)) {
    e.respondWith(
      caches.match(e.request).then(r => r || fetch(e.request))
    );
    return;
  }

  /* everything else → network-first, then cache */
  e.respondWith(
    fetch(e.request)
      .then(r => {
        const clone = r.clone();
        caches.open(CACHE).then(c => c.put(e.request, clone));
        return r;
      })
      .catch(() => caches.match(e.request))
  );
});
