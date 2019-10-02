self.importScripts('/Devtober2019/data.js');

console.log('[SW] Done loading data', companies.electronics);

var cacheName = 'pwaTest';
var appFiles = [
    '/Devtober2019/',
    '/Devtober2019/index.html',
    '/Devtober2019/pwaTest.webmanifest',
    '/Devtober2019/app.js',
    '/Devtober2019/data.js',
    '/Devtober2019/mainSW.js',
];

// Register a handler for the service worker installation hook
self.addEventListener('install', (event) => {
    console.log('[SW] Setup');

    event.waitUntil(
        caches.open(cacheName).then((cache) => {
            console.log('[SW] Caching app content ' + appFiles);
            return cache.addAll(appFiles);
        })
    );

    console.log('[SW] Setup COMPLETE');
});

// Intercept and cache HTTP requests
self.addEventListener('fetch', (e) => {
    e.respondWith(caches.match(e.request).then((resource) => {
        console.log('[SW] Fetching resource ' + e.request.url);
        return resource || fetch(e.request).then((response) => {
            return caches.open(cacheName).then((cache) => {
                console.log('[SW] Caching new resource ' + e.request.url);
                cache.put(e.request, response.clone());

                return response;
            });
        });
    }));
});
