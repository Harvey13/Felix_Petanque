const CACHE_NAME = 'felix-petanque-v1';
const REQUIRED_FILES = [
  '/',
  '/index.html',
  '/manifest.json',
  '/petanque.svg'
];

const OPTIONAL_FILES = [
  '/assets/index-Dh29RR78.js',
  '/assets/index-Vg7VwxWX.css',
  '/pwa-192x192.png',
  '/pwa-512x512.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        // D'abord, mettre en cache les fichiers requis
        return cache.addAll(REQUIRED_FILES)
          .then(() => {
            // Ensuite, essayer de mettre en cache les fichiers optionnels
            // mais ne pas échouer si certains sont manquants
            return Promise.allSettled(
              OPTIONAL_FILES.map(file =>
                cache.add(file).catch(error => {
                  console.warn(`Impossible de mettre en cache ${file}:`, error);
                  return null;
                })
              )
            );
          });
      })
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        if (response) {
          return response;
        }

        return fetch(event.request.clone())
          .then((response) => {
            if (!response || response.status !== 200) {
              return response;
            }

            const responseToCache = response.clone();
            caches.open(CACHE_NAME)
              .then((cache) => {
                cache.put(event.request, responseToCache);
              })
              .catch(error => {
                console.warn('Erreur lors de la mise en cache:', error);
              });

            return response;
          })
          .catch(() => {
            // Vérifier si c'est une requête de navigation
            if (event.request.mode === 'navigate') {
              return caches.match('/');
            }
            return new Response('Contenu non disponible hors ligne', {
              status: 404,
              statusText: 'Not Found'
            });
          });
      })
  );
});
