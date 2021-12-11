/*
với mọi api dạng update, chỉnh sửa thì đều cần có cookie
để check rằng đó là đúng người đúng user name tránh trường hợp
người dùng này cập nhật user khác hoặc delete user khác
*/
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
            // TODO
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
};
