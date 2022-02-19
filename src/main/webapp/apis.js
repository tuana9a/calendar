"use strict";

let isServiceWorkderAvailable = "serviceWorker" in navigator;

const SERVICE_WORKER_FILE = "sw.js";
const CACHE_NAME = "calendar";

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

class ServiceWorkerUtils {
    static INSTANCE = new ServiceWorkerUtils();
    static getInstance() {
        return this.INSTANCE;
    }
    registerServiceWorker(serviceWorkerFile = "", onSuccess = console.log, onError = console.error) {
        if (!isServiceWorkderAvailable) return;
        navigator.serviceWorker.register(serviceWorkerFile).then(onSuccess).catch(onError);
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
    async update(onSuccess = () => {}, onError = console.error) {
        const cacheUtils = CacheUtils.getInstance();
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
        ServiceWorkerUtils.getInstance().registerServiceWorker(SERVICE_WORKER_FILE, onSuccess, onError);
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
            let url = "/api/event?eventId=" + _id;
            return fetch(url, {
                method: "DELETE",
            }).then((resp) => resp.json());
        },
    },
    app: {
        install: App.getInstance().install,
        update: App.getInstance().update,
        uninstall: App.getInstance().uninstall,
        cache_urls: async function () {
            let url = "/caches.json";
            return fetch(url).then((resp) => resp.json());
        },
    },
    notification: {
        request: async function () {
            return Notification.requestPermission();
        },
        send: async function (title = "", opts) {
            if (Notification.permission != "granted") return;
            if (!isServiceWorkderAvailable) return;

            const serviceWorker = await navigator.serviceWorker.getRegistration();
            if (!serviceWorker) return;
            serviceWorker.showNotification(title, opts);
        },
    },
    confirmRedirect: {
        login: function () {
            const accept = confirm("go to login ?");
            if (accept) {
                window.location.href = "/login.html";
            }
        },
        register: function () {},
        home: function () {},
        calendar: function () {
            const accept = confirm("go to calendar ?");
            if (accept) {
                window.location.href = "/calendar.html";
            }
        },
        reload: function () {
            const accept = confirm("reload page ?");
            if (accept) {
                window.location.reload();
            }
        },
    },
    push: {
        publickey: async function () {
            let url = "/api/push/pub";
            return fetch(url).then((resp) => resp.text());
        },
        sub: {
            send: async function (pushSubObject) {
                let url = "/api/push";
                return fetch(url, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json; charset=utf-8",
                    },
                    body: JSON.stringify(pushSubObject),
                }).then((resp) => resp.json());
            },
            update: async function () {
                const serviceWorker = await navigator.serviceWorker.getRegistration();
                if (!serviceWorker) return;

                const pushManager = serviceWorker.pushManager;
                const pushSubObject = await pushManager.getSubscription();
                if (pushSubObject) {
                    // exist but may update so send it to server
                    return apis.push.sub.send(pushSubObject);
                }
                // create new one
                const serverPubKey = await apis.push.publickey();
                const newPushSubObject = await pushManager.subscribe({
                    userVisibleOnly: true,
                    applicationServerKey: serverPubKey,
                });
                return apis.push.sub.send(newPushSubObject);
            },
        },
    },
};
