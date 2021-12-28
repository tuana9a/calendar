//Only fetch cached data, do nothing more for simple <3

self.addEventListener("install", function (event) {
    // Force the waiting service worker to become the active service worker.
    self.skipWaiting();
});

self.addEventListener("activate", function (event) {
    // Tell the active service worker to take control of the page immediately.
    self.clients.claim();
});

self.addEventListener("fetch", function (event) {
    event.respondWith(
        caches.match(event.request).then(async function (response) {
            // If exist then return else make new request
            if (response) {
                return response;
            }
            return fetch(event.request);
        }),
    );
});

self.addEventListener("notificationclick", function (event) {
    var notification = event.notification;
    var action = event.action;
    // TODO: base on action do something
    // serviceWorker can even send request
    notification.close();
});

self.addEventListener("push", function (event) {
    let data = JSON.parse(event.data.text());
    var options = {
        body: data.description,
        icon: "/images/calendar.png",
    };
    event.waitUntil(self.registration.showNotification(data.title, options));
});
