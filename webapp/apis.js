"use strict";

let isServiceWorkderAvailable = "serviceWorker" in navigator;

const SERVICE_WORKER_FILE = "sw.js";
const CACHE_NAME = "app";
const CACHED_URLS = [
    "/",
    "/account.html",
    "/account.js",
    "/apis.js",
    "/calendar.html",
    // "/calendar.js",
    "/calendarize.js",
    "/common.css",
    "/constants.js",
    "/index.html",
    "/login.html",
    "/login.js",
    "/README.md",
    "/register.html",
    "/register.js",
    "/sw.js",
    "/utils.js",
    "/css/button.css",
    "/css/calendar.css",
    "/css/create-event.css",
    "/css/global.css",
    "/css/header.css",
    "/css/icons.css",
    "/css/index.css",
    "/css/input.css",
    "/css/modal.css",
    "/css/page.css",
    "/css/select.css",
    "/fonts/icomoon.eot",
    "/fonts/icomoon.svg",
    "/fonts/icomoon.ttf",
    "/fonts/icomoon.woff",
    "/icons/Icon-calendar.svg",
    "/icons/Icon=check-square.svg",
    "/icons/Icon=check.svg",
    "/icons/Icon=chevron-down.svg",
    "/icons/Icon=chevron-left.svg",
    "/icons/Icon=chevron-right.svg",
    "/icons/Icon=chevron-up.svg",
    "/icons/Icon=clock.svg",
    "/icons/Icon=gps.svg",
    "/icons/Icon=hamburguer-button.svg",
    "/icons/Icon=help-circle.svg",
    "/icons/Icon=plus.svg",
    "/icons/Icon=search.svg",
    "/icons/Icon=settings.svg",
    "/icons/Icon=text.svg",
    "/icons/Icon=users.svg",
    "/icons/Icon=video.svg",
    "/fonts/icomoon.woff?aa7569",
    "/fonts/icomoon.ttf?aa7569",
    "/images/calendar.svg",
];

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
        let backup = new Map();
        for (const url of CACHED_URLS) {
            backup.set(url, await cache.match(new Request(url)));
        }
        return backup;
    }
}

class NotifyUtils {
    static INSTANCE = new NotifyUtils();
    static getInstance() {
        return this.INSTANCE;
    }
    async requestPermission() {
        return Notification.requestPermission(function (status) {
            console.log("Notification Permission:", status);
        });
    }
    async sendNotification(
        title = "",
        opts = {
            body: "",
            data: {},
            silent: true,
            icon: "/icons/Icon=check.svg",
            actions: [{ action: "ok", title: "ok" }],
        },
    ) {
        if (Notification.permission != "granted") return;
        if (!isServiceWorkderAvailable) return;

        const sw = await navigator.serviceWorker.getRegistration();
        sw.showNotification(title, opts);
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
    async update() {
        const cacheUtils = CacheUtils.getInstance();
        const BACKUP = await cacheUtils.snapshot();
        await cacheUtils.clear();
        try {
            let cache = await caches.open(CACHE_NAME);
            await cache.addAll(CACHED_URLS.map((url) => new Request(url, { cache: "reload" })));
        } catch (err) {
            console.error(err);
            let cache = await caches.open(CACHE_NAME);
            for (const url of CACHED_URLS) {
                const req = new Request(url);
                const resp = BACKUP.get(url);
                cache.put(req, resp);
            }
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
        update: App.getInstance().update,
        uninstall: App.getInstance().uninstall,
    },
    notification: {
        request: NotifyUtils.getInstance().requestPermission,
        send: NotifyUtils.getInstance().sendNotification,
    },
};
