const CACHE_NAME = "pov-pwa-v4";
const APP_SHELL = [
  "./",
  "./index.html",
  "./public.html",
  "./app.js",
  "./public.js",
  "./pwa.js",
  "./styles.css",
  "./manifest.webmanifest",
  "./pov-logo.png",
  "./icon-192.png",
  "./icon-512.png",
  "./apple-touch-icon.png",
  "./favicon-32.png"
];

self.addEventListener("install", event => {
  event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(APP_SHELL)));
  self.skipWaiting();
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

async function networkFirst(request) {
  const cache = await caches.open(CACHE_NAME);
  try {
    const response = await fetch(request);
    if (response && (response.ok || response.type === "opaque")) cache.put(request, response.clone());
    return response;
  } catch (err) {
    const cached = await cache.match(request, {ignoreSearch:true});
    if (cached) return cached;
    if (request.mode === "navigate") return cache.match("./index.html", {ignoreSearch:true});
    throw err;
  }
}

async function cacheFirst(request) {
  const cache = await caches.open(CACHE_NAME);
  const cached = await cache.match(request, {ignoreSearch:true});
  if (cached) return cached;
  const response = await fetch(request);
  if (response && (response.ok || response.type === "opaque")) cache.put(request, response.clone());
  return response;
}

self.addEventListener("fetch", event => {
  const req = event.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);

  // Keep HTML/JS/CSS fresh so GitHub deployments update promptly, but preserve offline fallback.
  if (req.mode === "navigate" || ["script","style","worker"].includes(req.destination)) {
    event.respondWith(networkFirst(req));
    return;
  }

  // Images, fonts and other static resources can be served quickly from cache.
  if (["image","font"].includes(req.destination)) {
    event.respondWith(cacheFirst(req));
    return;
  }

  // Runtime-cache other GET requests, including CDN resources after first successful load.
  event.respondWith(networkFirst(req));
});
