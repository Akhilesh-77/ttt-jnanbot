
const CACHE_NAME = 'jnan-bot-cache-v3';
const CORE_ASSETS = [
  '/',
  '/index.html',
  '/index.css',
  '/manifest.json',
  '/index.tsx'
];

// On install, cache the essential App Shell
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      // Use standard URLs for caching to match manifest start_url
      return cache.addAll(CORE_ASSETS);
    })
  );
  self.skipWaiting();
});

// Clean up old caches immediately
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Clearing old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch logic with strict SPA 404 fallback
self.addEventListener('fetch', (event) => {
  const { request } = event;

  // Handle Navigation Requests (HTML) - Critical for Mobile SPA 404 fix
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          // If the server returns a 404, the user is likely on a sub-route.
          // Fallback to index.html to let the client-side router handle it.
          if (response.status === 404) {
            return caches.match('/index.html') || caches.match('/');
          }
          return response;
        })
        .catch(() => {
          // If offline or network fails, serve the cached shell
          return caches.match('/index.html') || caches.match('/');
        })
    );
    return;
  }

  // Handle Static Assets
  event.respondWith(
    caches.match(request).then((response) => {
      return response || fetch(request).then((fetchResponse) => {
        // Cache assets on the fly if successful
        if (fetchResponse && fetchResponse.status === 200 && fetchResponse.type === 'basic') {
          const responseToCache = fetchResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(request, responseToCache);
          });
        }
        return fetchResponse;
      }).catch(() => {
        // Fail silently for non-critical assets
        return new Response('Asset not available offline', { status: 404 });
      });
    })
  );
});
