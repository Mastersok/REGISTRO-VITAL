const CACHE_NAME = 'dosis-vital-v2';
const ASSETS = [
    './',
    './index.html',
    './assets/logo.png',
    './css/styles.css',
    './js/app.js',
    './js/store/Store.js',
    './js/store/Translations.js'
];

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
    );
});

self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request).then((response) => {
            return response || fetch(event.request);
        })
    );
});
