"use strict";

let isServiceWorkderAvailable = "serviceWorker" in navigator;

const SERVICE_WORKER_FILE = "sw.js";
const CACHE_NAME = "app";
const CACHED_URLS = [];

class CacheUtils {
    static INSTANCE = new CacheUtils();
    static getInstance() {
        return this.INSTANCE;
    }
    async clear() {
        return caches.keys().then(function (cacheNames) {
            return Promise.all(
                cacheNames.map(function (cacheName) {
                    return caches.delete(cacheName);
                }),
            );
        });
    }
    async getBackup() {
        let cache = await caches.open(CACHE_NAME);
        let backup = new Map();
        for (const url of CACHED_URLS) {
            backup.set(url, await cache.match(new Request(url)));
        }
        return backup;
    }
    async update() {
        let cache = await caches.open(CACHE_NAME);
        return cache.addAll(CACHED_URLS.map((url) => new Request(url, { cache: "reload" })));
    }
}

class NotifyUtils {
    static INSTANCE = new NotifyUtils();
    static getInstance() {
        return this.INSTANCE;
    }
    requestPermission() {
        Notification.requestPermission(function (status) {
            console.log("Notification Permission:", status);
        });
    }
    sendNotification(title = "", options = { body: "", data: {}, actions: [{ action: "", title: "" }] }) {
        if (Notification.permission != "granted") return;
        if (!isServiceWorkderAvailable) return;

        const sw = await navigator.serviceWorker.getRegistration();
        sw.showNotification(title, {
            ...options,
            icon: "icons/manifest-icon-192.png",
            silent: true,
        });
    }
}

class ServiceWorkerUtils {
    static INSTANCE = new ServiceWorkerUtils();
    static getInstance() {
        return this.INSTANCE;
    }
    registerServiceWorker(serviceWorkerFile = "", onSuccess = (e) => {}, onError = (e) => {}) {
        if (!isServiceWorkderAvailable) return;
        window.addEventListener("load", function () {
            navigator.serviceWorker.register(serviceWorkerFile).then(onSuccess).catch(onError);
        });
    }
    async unregisterServiceWorkers() {
        return navigator.serviceWorker.getRegistrations().then(function (serviceWorkers) {
            return serviceWorkers.map(function (serviceWorker) {
                return serviceWorker.unregister();
            });
        });
    }
}

class App {
    static INSTANCE = new App();
    static getInstance() {
        return this.INSTANCE;
    }
    async update() {
        const cacheUtils = CacheUtils.getInstance();
        const BACKUP = await cacheUtils.getBackup();
        await cacheUtils.clear();
        try {
            await cacheUtils.update();
            console.log("update: success");
        } catch (err) {
            console.log("update: failed");
            let cache = await caches.open(CACHE_NAME);
            for (const url of CACHED_URLS) {
                const req = new Request(url);
                const resp = BACKUP.get(url);
                cache.put(req, resp);
            }
        }
    }
    install() {
        ServiceWorkerUtils.getInstance().registerServiceWorker(SERVICE_WORKER_FILE);
    }
    uninstall() {
        localStorage.clear();
        CacheUtils.getInstance().clear();
        ServiceWorkerUtils.getInstance().unregisterServiceWorkers();
    }
}

export const apis = {
    user: {
        register: async function (user = { username: "", password: "" }) {
            let url = "/register";
            return fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json; charset=utf-8",
                },
                body: JSON.stringify(user),
            }).then((resp) => resp.json());
        },
        login: async function (user = { username: "", password: "" }) {
            let url = "/login";
            return fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json; charset=utf-8",
                },
                body: JSON.stringify(user),
            }).then((resp) => resp.json());
        },
        logout: async function () {
            document.cookie = "access_token=; expires=Thu, 18 Dec 2013 12:00:00 UTC; path=/";
        },
        info: async function () {
            let url = "/api/user";
            return fetch(url, {
                method: "GET",
            }).then((resp) => resp.json());
        },
        update: async function (user = { username: "", password: "" }) {
            let url = "/api/user";
            return fetch(url, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json; charset=utf-8",
                },
                body: JSON.stringify(user),
            }).then((resp) => resp.json());
        },
        delete: async function () {
            let url = "/api/user";
            return fetch(url, {
                method: "DELETE",
            }).then((resp) => resp.json());
        },
    },
    event: {
        add: async function (event) {
            let url = "/api/event";
            return fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json; charset=utf-8",
                },
                body: JSON.stringify(event),
            }).then((resp) => resp.json());
        },
        find: async function (filter) {
            let url = "/api/event?filter=" + JSON.stringify(filter);
            return fetch(url).then((resp) => resp.json());
        },
        update: async function (event) {
            //TODO
            let url = "/api/event";
            return fetch(url, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json; charset=utf-8",
                },
                body: JSON.stringify(event),
            }).then((resp) => resp.json());
        },
        delete: async function ({ _id }) {
            //TODO
            let url = "/api/event?eventId=" + _id;
            return fetch(url, {
                method: "DELETE",
            }).then((resp) => resp.json());
        },
    },
    app: {
        install: App.getInstance().install,
        uninstall: App.getInstance().uninstall,
    },
    notification: {
        request: NotifyUtils.getInstance().requestPermission,
        send: NotifyUtils.getInstance().sendNotification,
    },
};
