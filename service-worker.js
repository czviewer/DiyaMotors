self.addEventListener("install", (event) => {
  console.log("Service Worker installed.");
  self.skipWaiting(); // Activate immediately
});

self.addEventListener("activate", (event) => {
  console.log("Service Worker activated.");
});

self.addEventListener("fetch", (event) => {
  // Bypass caching for dynamic Firebase data
  event.respondWith(fetch(event.request));
});
