/* v2.6 – 2025-05-13 */
const CACHE = 'checkreel-cache-v2.6';
const ASSETS = [
  '/', '/index.html', '/dashboard.html',
  '/styles.css', '/app.js', '/dashboard.js', '/lang-loader.js',
  '/images/favicon.png', '/images/checkreel-logo.png',
  '/images/platform-logos/facebook.png',  '/images/platform-logos/instagram.png',
  '/images/platform-logos/youtube.png',   '/images/platform-logos/tiktok.png',
  '/images/platform-logos/threads.png',   '/images/platform-logos/twitter.png',
  '/images/platform-logos/snapchat.png',
  '/manifest.json', '/lang/en.json', '/lang/fr.json', '/lang/ar.json'
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)));
  self.skipWaiting();
});
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k.startsWith('checkreel-cache-') && k !== CACHE).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  e.respondWith(
    caches.match(e.request).then(r => r || fetch(e.request).then(res => {
      const clone = res.clone();
      caches.open(CACHE).then(c => c.put(e.request, clone));
      return res;
    }))
  );
});
