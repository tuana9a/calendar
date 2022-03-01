"use strict";

class CommonUtils {
    getCookie(name) {
        let pattern = name + "=";
        let cookies = document.cookie.split(";");
        for (let i = 0, length = cookies.length; i < length; i++) {
            let cookie = cookies[i];
            cookie = cookie.trim();
            if (cookie.indexOf(pattern) == 0) {
                return cookie.substring(pattern.length, cookie.length);
            }
        }
        return "";
    }
    getQueryValueFromUrl(name, url = window.location.href) {
        name = name.replace(/[\[\]]/g, "\\$&");
        var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
            results = regex.exec(url);
        if (!results) return null;
        if (!results[2]) return "";
        return decodeURIComponent(results[2].replace(/\+/g, " "));
    }
    existInArray(value, array = []) {
        for (const e of array) {
            if (e == value) return true;
        }
        return false;
    }
    fromAnyToNumber(input = {}) {
        let value = parseInt(input);
        return value ? value : 0;
    }
}

export const commonUtils = new CommonUtils();
