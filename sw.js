
const CACHE_NAME = 'jnan-bot-cache-v2';
const CORE_ASSETS = [
  './',
  './index.html',
  './index.css',
  './manifest.json',
  './index.tsx'
];

// On install, cache the essential App Shell
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(CORE_ASSETS);
    })
  );
  self.skipWaiting();
});

// Clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch logic with SPA fallback
self.addEventListener('fetch', (event) => {
  const { request } = event;

  // 1. Handle Navigation Requests (HTML) - Critical for SPA 404 fix
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request).catch(() => {
        // If network fails (or 404s in some environments), serve index.html
        return caches.match('./index.html') || caches.match('./');
      })
    );
    return;
  }

  // 2. Handle Static Assets (Images, CSS, JS)
  event.respondWith(
    caches.match(request).then((response) => {
      return response || fetch(request).then((fetchResponse) => {
        // Optional: Cache successful new requests on the fly
        if (fetchResponse.status === 200) {
          const responseClone = fetchResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(request, responseClone);
          });
        }
        return fetchResponse;
      }).catch(() => {
        // Fallback for failed asset fetches (optional)
        return new Response('Network error occurred', { status: 408 });
      });
    })
  );
});
