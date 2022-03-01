"use strict";

import { cacheUtils } from "./utils/cache-utils.js";
import { serviceWorkserUtils } from "./utils/sw-utils.js";

const CACHE_NAME = "calendar";
const SERVICE_WORKER_FILE = "sw.js";

class App {
    async update(onSuccess = () => {}, onError = console.error) {
        const snapshot = await cacheUtils.snapshot();
        await cacheUtils.clear();
        try {
            const cacheUrls = await apis.app.cache_urls();
            let cache = await caches.open(CACHE_NAME);
            for (const url of cacheUrls) {
                const request = new Request(url, { cache: "reload" });
                cache.add(request);
            }
            onSuccess();
        } catch (err) {
            let cache = await caches.open(CACHE_NAME);
            snapshot.forEach((response, request) => {
                cache.put(request, response);
            });
            onError(err);
        }
    }
    install(onSuccess = (e) => {}, onError = (e) => {}) {
        serviceWorkserUtils.registerServiceWorker(SERVICE_WORKER_FILE, onSuccess, onError);
    }
    uninstall() {
        localStorage.clear();
        cacheUtils.clear();
        serviceWorkserUtils.unregisterServiceWorkers();
    }
}

export const app = new App();
