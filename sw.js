const CACHE_NAME = 'mini-game-hub-v1';
const THUMB_CACHE = 'thumbnails-v1';

// Core assets to precache
const PRECACHE = [
  '/',
  './index.html',
  './styles/style.css',
  './scripts/games.js',
  './scripts/script.js',
  './manifest.json',
  './favicon.svg',
];

// Install: precache core assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('📦 Precaching core assets');
        return cache.addAll(PRECACHE);
      })
  );
  self.skipWaiting();
});

// Activate: cleanup old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME && name !== THUMB_CACHE)
          .map((name) => {
            console.log('🗑️ Deleting old cache:', name);
            return caches.delete(name);
          })
      );
    })
  );
  self.clients.claim();
});

// Fetch: Cache-first for thumbnails, network-first for HTML/JS
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // THUMBNAILS: Cache-first (rarely change)
  if (url.pathname.includes('/thumbs/') && (url.pathname.endsWith('.png') || url.pathname.endsWith('.svg'))) {
    event.respondWith(
      caches.open(THUMB_CACHE)
        .then((cache) => {
          return cache.match(event.request).then((cached) => {
            if (cached) {
              console.log('✅ Serving from thumbnail cache:', url.pathname);
              return cached;
            }
            return fetch(event.request).then((res) => {
              if (res.ok) {
                console.log('💾 Caching thumbnail:', url.pathname);
                cache.put(event.request, res.clone());
              }
              return res;
            });
          });
        })
    );
    return;
  }

  // HTML/JS/CSS: Network-first, fallback to cache
  event.respondWith(
    fetch(event.request)
      .then((res) => {
        if (res.ok) {
          const clone = res.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
        }
        return res;
      })
      .catch(() => caches.match(event.request))
  );
});
