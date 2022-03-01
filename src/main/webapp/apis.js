"use strict";

import { app } from "./app.js";

let isServiceWorkderAvailable = "serviceWorker" in navigator;

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
        install: app.install,
        update: app.update,
        uninstall: app.uninstall,
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
