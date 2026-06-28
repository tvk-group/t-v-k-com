/* TVK Group Türkiye — minimal service worker for PWA install */
const SW_VERSION = "tvk-corporate-pwa-v1";
const OFFLINE_URL = "/app/";

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(SW_VERSION).then((cache) => cache.addAll([
      OFFLINE_URL,
      "/assets/web-app-manifest.json",
      "/assets/brand/icon.svg",
      "/app/css/app.css",
      "/app/js/app-shell.js",
      "/app/js/app-translations.js"
    ]))
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== SW_VERSION).map((k) => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;

  event.respondWith(
    fetch(request).catch(() => {
      if (request.mode === "navigate") {
        return caches.match(OFFLINE_URL);
      }
      return caches.match(request);
    })
  );
});
