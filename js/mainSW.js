self.importScripts('/Restock/js/data.js');

console.log('[SW] Done loading data', companies.electronics);

var cacheName = 'pwaTest';
var appFiles = [
    '/Restock/',
    '/Restock/index.html',
    '/Restock/pwaTest.webmanifest',
    '/Restock/js/app.js',
    '/Restock/js/mainSW.js',

    '/Restock/js/scannerModal.js',
    '/Restock/js/data.js',
    '/Restock/js/controllers/navigation.js',
    '/Restock/js/controllers/pages/home.js',
    '/Restock/js/controllers/pages/state.js',
    '/Restock/js/controllers/pages/collection.js',
    '/Restock/js/controllers/components/objective.js',
    '/Restock/js/controllers/components/stick.js',
    '/Restock/js/controllers/components/stickPanel.js',
    '/Restock/js/controllers/components/inventoryCategorySelector.js',
    '/Restock/js/controllers/components/inventoryCollectionDisplay.js',
    '/Restock/js/controllers/components/detailsModal.js',
    '/Restock/js/controllers/components/scannerModal.js',
    '/Restock/js/generation/rng.js',
    '/Restock/js/generation/objective.js',
    '/Restock/js/generation/product.js',

    '/Restock/templates/scannerModal',
    '/Restock/templates/scannerResultModal',
    '/Restock/templates/pages/home',
    '/Restock/templates/pages/state',
    '/Restock/templates/pages/collection',
    '/Restock/templates/components/objective',
    '/Restock/templates/components/stick',
    '/Restock/templates/components/stickPanel',
    '/Restock/templates/components/inventoryCategorySelector',
    '/Restock/templates/components/inventoryCollectionDisplay',
    '/Restock/templates/components/detailsModal',
    '/Restock/templates/components/scannerModal',
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
        return (false && resource) || fetch(e.request).then((response) => {
            return caches.open(cacheName).then((cache) => {
                console.log('[SW] Caching new resource ' + e.request.url);
                cache.put(e.request, response.clone());

                return response;
            });
        });
    }));
});
