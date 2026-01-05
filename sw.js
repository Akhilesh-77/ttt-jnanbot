const CACHE_NAME = 'jnan-bot-cache-v3';

const CORE_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json'
];

// Install — cache app shell
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(CORE_ASSETS))
  );
  self.skipWaiting();
});

// Activate — clear old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((names) =>
      Promise.all(
        names.map((n) => {
          if (n !== CACHE_NAME) return caches.delete(n);
        })
      )
    )
  );
  self.clients.claim();
});

// Fetch — SPA fallback + cache-first
self.addEventListener('fetch', (event) => {
  const req = event.request;

  // 1️⃣ Handle navigation (fixes 404 in PWA)
  if (req.mode === 'navigate') {
    event.respondWith(
      fetch('/index.html').catch(() =>
        caches.match('/index.html')
      )
    );
    return;
  }

  // 2️⃣ Cache-first for everything else
  event.respondWith(
    caches.match(req).then((cached) => {
      if (cached) return cached;

      return fetch(req)
        .then((res) => {
          if (res && res.status === 200) {
            const clone = res.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(req, clone));
          }
          return res;
        })
        .catch(() => new Response('Network error', { status: 408 }));
    })
  );
});
