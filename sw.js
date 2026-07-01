/**
 * LU5CTW RF Lab — Service Worker
 * Permite funcionamiento offline cacheando recursos estáticos.
 */

const CACHE_NAME = 'lu5ctw-rf-lab-v1';

const PRECACHE_URLS = [
  './',
  './index.html',
  './css/variables.css',
  './css/base.css',
  './css/layout.css',
  './css/components.css',
  './js/home.js',
  './js/core/constants.js',
  './js/core/cables.js',
  './js/core/frequency-presets.js',
  './js/core/tools-registry.js',
  './js/core/format.js',
  './js/components/explain-modal.js',
  './tools/transmission-line/',
  './tools/transmission-line/index.html',
  './js/modules/transmission-line/app.js',
  './js/modules/transmission-line/physics.js',
  './js/modules/transmission-line/explanations.js',
  './manifest.json',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(PRECACHE_URLS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  event.respondWith(
    caches.match(event.request).then((cached) => {
      const fetched = fetch(event.request).then((response) => {
        if (response && response.status === 200) {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
        }
        return response;
      }).catch(() => cached);

      return cached || fetched;
    })
  );
});
