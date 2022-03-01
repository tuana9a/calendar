"use strict";

class CacheUtils {
    async clear() {
        return caches.keys().then(function (cacheNames) {
            return Promise.all(
                cacheNames.map(function (cacheName) {
                    return caches.delete(cacheName);
                }),
            );
        });
    }
    async snapshot() {
        let cache = await caches.open(CACHE_NAME);
        let snapshot = new Map();
        const requests = await cache.keys();
        for (const request of requests) {
            const response = await cache.match(request);
            snapshot.set(request, response);
        }
        return snapshot;
    }
}

export const cacheUtils = new CacheUtils();
