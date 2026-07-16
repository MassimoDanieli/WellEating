// WellEating service worker.
// Strategy: network-first with cache fallback for everything.
// Fresh content whenever online; full offline support (including the
// live-fetched shopping list and meal plan) once visited at least once.

const CACHE = "welleating-v2";

const PRECACHE = [
  "./",
  "index.html",
  "recipes.html",
  "meal-plan.html",
  "shopping.html",
  "styles.css",
  "recipes.js",
  "meal-plan.js",
  "shopping.js",
  "pwa.js",
  "recipes.json",
  "favicon.png",
  "icon-192.png",
  "manifest.webmanifest",
  "it/",
  "it/index.html",
  "it/recipes.html",
  "it/meal-plan.html",
  "it/shopping.html",
  "it/recipes.json",
  "it/manifest.webmanifest",
];

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE).then(cache => cache.addAll(PRECACHE)).then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", event => {
  if (event.request.method !== "GET") return;

  event.respondWith(
    fetch(event.request)
      .then(response => {
        if (response.ok) {
          const copy = response.clone();
          caches.open(CACHE).then(cache => cache.put(event.request, copy));
        }
        return response;
      })
      .catch(() =>
        caches.match(event.request).then(cached => {
          if (cached) return cached;
          if (event.request.mode === "navigate") return caches.match("index.html");
          return Response.error();
        })
      )
  );
});
