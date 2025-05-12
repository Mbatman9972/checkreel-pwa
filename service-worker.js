/* v2.7 – 2025-05-13 */
const CACHE='checkreel-cache-v2.7';
const ASSETS=[
  '/', '/index.html', '/dashboard.html',
  '/styles.css','/dashboard.css',
  '/app.js','/dashboard.js','/lang-loader.js',
  '/images/favicon.png','/images/checkreel-logo.png',
  '/images/platform-logos/facebook.png','/images/platform-logos/instagram.png',
  '/images/platform-logos/youtube.png','/images/platform-logos/tiktok.png',
  '/images/platform-logos/threads.png','/images/platform-logos/twitter.png',
  '/images/platform-logos/snapchat.png',
  '/manifest.json','/lang/en.json','/lang/fr.json','/lang/ar.json'
];
self.addEventListener('install',e=>e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)))&&self.skipWaiting());
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x.startsWith('checkreel-cache-')&&x!==CACHE).map(x=>caches.delete(x)))))&&self.clients.claim());
self.addEventListener('fetch',e=>{if(e.request.method!=='GET')return;
  e.respondWith(caches.match(e.request).then(r=>r||fetch(e.request).then(res=>{const clone=res.clone();caches.open(CACHE).then(c=>c.put(e.request,clone));return res;})));
});
