self.addEventListener("notificationclick", function(event) {
    event.notification.close();
    event.waitUntil(
        clients.openWindow("/")
    );
});


self.addEventListener("fetch", e => {
  e.respondWith(
    caches.match(e.request).then(r => r || fetch(e.request))
  );
});
