
self.addEventListener('install', (e) => {
  self.skipWaiting();
});

self.addEventListener('fetch', (e) => {
  // Simple pass-through fetch
  e.respondWith(fetch(e.request));
});
