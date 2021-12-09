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
        add: async function (params = { user_event: {} }) {
            //TODO
            let url = "/api/user/event";
            let requestInfo = {
                method: "POST",
                body: params.user_event,
            };
            return fetch(url, requestInfo).then((resp) => resp.json());
        },
        info: async function (params = { id: false }) {
            //TODO
            let url = "/api/user/event/" + params.id;
            let requestInfo = {
                method: "GET",
            };
            return fetch(url, requestInfo).then((resp) => resp.json());
        },
        search: async function (params = { q: false }) {
            let url = "/api/user/event?" + params.q;
            let requestInfo = {
                method: "GET",
            };
            return fetch(url, requestInfo).then((resp) => resp.json());
        },
        update: async function (params = { user_event: {} }) {
            //TODO
            let url = "/api/user/event";
            let requestInfo = {
                method: "PUT",
                body: params.user_event,
            };
            return fetch(url, requestInfo).then((resp) => resp.json());
        },
        cancel: async function (params = { id: false }) {
            //TODO
            let url = "/api/user/event/" + params.id;
            let requestInfo = {
                method: "DELETE",
            };
            return fetch(url, requestInfo).then((resp) => resp.json());
        },
    },
};
