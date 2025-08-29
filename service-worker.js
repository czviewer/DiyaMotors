const CACHE_NAME = 'diya-cache-v6'; // 🔁 Increment this on every deploy!
const URLS_TO_CACHE = [
  '/',
  '/index.html',
  '/home.html',
  '/admin.html',
  '/scripts/loadHeader.js',
  '/icons/icon-192.png',
  '/icons/icon-512.png,',
  // Add other files you want cached
];

self.addEventListener('install', event => {
  self.skipWaiting(); // Activate worker immediately after install
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(URLS_TO_CACHE);
    })
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(name => {
          if (name !== CACHE_NAME) {
            return caches.delete(name); // Delete old caches
          }
        })
      );
    })
  );
  return self.clients.claim(); // Become available to all pages
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});
