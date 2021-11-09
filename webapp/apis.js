/*
với mọi api dạng update, chỉnh sửa thì đều cần có cookie
để check rằng đó là đúng người đúng user name tránh trường hợp
người dùng này cập nhật user khác hoặc delete user khác
*/
export const apis = {
    app_user: {
        register: async function (params = { user: {} }) {
            //TODO
            let url = "/register";
            let requestInfo = {
                method: "POST",
                body: params.user,
            };
            return fetch(url, requestInfo).then((resp) => resp.json());
        },
        login: async function (params = { user: {} }) {
            //TODO
            let url = "/login";
            let requestInfo = {
                method: "POST",
                body: params.user,
            };
            return fetch(url, requestInfo).then((resp) => resp.json());
        },
        logout: async function (params = {}) {
            //TODO
            let url = "/logout";
            let requestInfo = {
                method: "GET",
            };
            return fetch(url, requestInfo).then((resp) => resp.json());
        },
        info: async function (params = { id: false }) {
            //TODO
            let url = "/api/user/" + params.id; // search by user id
            let requestInfo = {
                method: "GET",
            };
            return fetch(url, requestInfo).then((resp) => resp.json());
        },
        update: async function (params = { user: {} }) {
            //TODO
            let url = "/api/user";
            let requestInfo = {
                method: "PUT",
                body: params.user,
            };
            return fetch(url, requestInfo).then((resp) => resp.json());
        },
        delete: async function (params = {}) {
            //TODO
            let url = "/api/user";
            let requestInfo = {
                method: "DELETE",
            };
            return fetch(url, requestInfo).then((resp) => resp.json());
        },
    },
    user_event: {
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
