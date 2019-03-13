const files = ['assets', 'index.html', 'favicon.ico'];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open('madkting').then( cache => {
      return cache.addAll(files);
    })
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then( keyList => {
      return Promise.all( keyList.map( key => {
        if (key !== 'madkting') {
          return caches.delete(key);
        }
      }));
    })
  );
  return;
});

self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then( response => {
      return response || fetch(e.request);
    })
  );
});
