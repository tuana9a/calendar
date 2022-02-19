"user strict";

const DAYWEEK_COUNT = 7;

export class CommonUtils {
    static INSTANCE = new CommonUtils();
    static getInstance() {
        return this.INSTANCE;
    }
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

export class DateUtils {
    static INSTANCE = new DateUtils();
    static getInstance() {
        return this.INSTANCE;
    }
    /**
     * chuyển từ object date thành string
     *      VD: Date -> 10/12/2021 lần lượt là ngày/tháng/năm
     * @param {Date} input input date tương ứng
     * @param {String} spliter là splittler cho string cuối cùng
     * @returns string
     */
    dateToStringVn(input = new Date(), spliter = "/") {
        let day = input.getDate();
        let month = input.getMonth() + 1; //EXPLAIN: range: 0-11
        let year = input.getFullYear();
        return (day < 10 ? "0" : "") + day + spliter + (month < 10 ? "0" : "") + month + spliter + year;
    }
    /**
     * chuyển từ object Date thành string
     *      VD: 2021/12/10 lần lượt là năm/tháng/ngày
     * @param {Date} input input date tương ứng
     * @param {String} spliter là splilter cho output
     * @returns string
     */
    dateToString(input = new Date(), spliter = "/") {
        let day = input.getDate();
        let month = input.getMonth() + 1; //EXPLAIN: range: 0-11
        let year = input.getFullYear();
        return year + spliter + (month < 10 ? "0" : "") + month + spliter + (day < 10 ? "0" : "") + day;
    }
    /**
     * convert từ string thành Date nhưng theo format của người việt nam
     *      VD: 10/12/2021 -> Date
     * @param {String} input đầu vào xâu
     * @returns Date
     */
    stringToDateVn(input = "") {
        if (!input.match(/^\d{1,2}(\/|-|\.)\d{1,2}(\/|-|\.)\d+$/)) return new Date();
        let parts = input.split(/(\/|-|\.)/).filter((e) => !e.match(/^(\/|-|\.)$/));
        let day = parts[0],
            month = parts[1],
            year = parts[2];
        return new Date(`${month}/${day}/${year}`);
    }
    /**
     * convert từ string thành Date
     *      VD: 2021-12-10 -> Date
     * @param {String} input đầu vào xâu
     * @returns Date
     */
    stringToDate(input = "") {
        if (!input.match(/^\d{1,2}(\/|-|\.)\d{1,2}(\/|-|\.)\d+$/)) return new Date();
        let parts = input.split(/(\/|-|\.)/).filter((e) => !e.match(/^(\/|-|\.)$/));
        let year = parts[0],
            month = parts[1],
            day = parts[2];
        return new Date(`${month}/${day}/${year}`);
    }
    /**
     * convert từ string thành Date
     *      VD: 10:12:13 -> Date
     * @param {String} input đầu vào xâu
     * @returns Date
     */
    stringToTime(input = "") {
        let parts = input.split(/:/);
        let hour = parts[0],
            minute = parts[1],
            second = parts[2];
        let date = new Date();
        date.setHours(hour);
        date.setMinutes(minute);
        date.setSeconds(second);
        return date;
    }
    fullDateToString(input = new Date()) {
        let year = input.getFullYear();
        let month = input.getMonth() + 1; //EXPLAIN: range: 0-11
        let day = input.getDate();
        let hour = input.getHours();
        let minute = input.getMinutes();
        let second = input.getSeconds();
        let _month = month < 10 ? "0" + month : month;
        let _day = day < 10 ? "0" + day : day;
        let _hour = hour < 10 ? "0" + hour : hour;
        let _minute = minute < 10 ? "0" + minute : minute;
        let _second = second < 10 ? "0" + second : second;
        return _month + "/" + _day + "/" + year + " " + _hour + ":" + _minute + ":" + _second;
    }
    fullDateToInputDatetimeLocalValue(input = new Date()) {
        let y = input.getFullYear();
        let m = input.getMonth() + 1; //EXPLAIN: range: 0-11
        let d = input.getDate();
        let h = input.getHours();
        let M = input.getMinutes();
        let s = input.getSeconds();
        m = m < 10 ? "0" + m : m;
        d = d < 10 ? "0" + d : d;
        h = h < 10 ? "0" + h : h;
        M = M < 10 ? "0" + M : M;
        s = s < 10 ? "0" + s : s;
        return y + "-" + m + "-" + d + "T" + h + ":" + M + ":" + s;
    }
    fullDetailDate(input) {
        let y = new Date(parseInt(input)).getFullYear();
        let m = new Date(parseInt(input)).getMonth() + 1; //EXPLAIN: range: 0-11
        let d = new Date(parseInt(input)).getDate();
        let h = new Date(parseInt(input)).getHours();   
        let M = new Date(parseInt(input)).getMinutes();
        let s = new Date(parseInt(input)).getSeconds();
        m = m < 10 ? "0" + m : m;
        d = d < 10 ? "0" + d : d;
        h = h < 10 ? "0" + h : h;
        M = M < 10 ? "0" + M : M;
        s = s < 10 ? "0" + s : s;
        return y + "-" + m + "-" + d + "T" + h + ":" + M + ":" + s;
    }
    toDayWeekVn(input = 0) {
        switch (input) {
            case 0:
                return 8;
            default:
                return input + 1;
        }
    }
    daysBetween(date1 = new Date(), date2 = new Date()) {
        let delta = date1.getTime() - date2.getTime();
        return Math.abs(delta) / 86_400_000;
    }
    timeBetween(date1 = new Date(), date2 = new Date()) {
        let miliseconds = date2.getTime() - date1.getTime();
        if (miliseconds < 1000) return miliseconds + "ms ago";
        let seconds = miliseconds / 1000.0;
        if (seconds < 60) return Math.round(seconds) + "s ago";
        let minutes = seconds / 60.0;
        if (minutes < 60) return Math.round(minutes) + "m ago";
        let hours = minutes / 60.0;
        if (hours < 24) return Math.round(hours) + "h ago";
        let days = hours / 24.0;
        return Math.round(days) + "d ago";
    }
    // nếu lệch mất một tuần thì vào đây mà sửa
    weeksFromStartDay(dash = "", firstWeekDay = "") {
        let date1 = this.stringToDateVn(dash);
        let date2 = this.stringToDateVn(firstWeekDay);
        let weeks = this.daysBetween(date1, date2) / 7;
        return Math.floor(weeks) + 1;
        //EXPLAIN: đéo biết giải thích thế nào cái cộng 1, thời gian mệt vlòn
    }
    calcCurrentWeek(firstWeekDay = "") {
        let start = DateUtils.getInstance().stringToDateVn(firstWeekDay);
        let weeks = Math.floor(DateUtils.getInstance().daysBetween(start, new Date()) / DAYWEEK_COUNT);
        return weeks + 1; //EXPLAIN: vd chia đc 0.5 thì là tuần 1, chia đc 1.2 là tuần 2
    }
    // Return the days in a month - given a year and the month number
    getDaysInMonth(month, year) {
        let date = new Date(year, month, 1);
        let days = [];
        while (date.getMonth() === month) {
            days.push(new Date(date));
            date.setDate(date.getDate() + 1);
        }
        return days;
    }
    // return an array of the first day of each month for a given year
    getMonthsInYear(year) {
        let date = new Date(year, 0, 1);
        let months = [];
        let monthCount = 0;
        while (monthCount < 12) {
            months.push(new Date(date));
            date.setMonth(date.getMonth() + 1);
            monthCount++;
        }
        return months;
    }
}

export class RandomUtils {
    static INSTANCE = new RandomUtils();
    static getInstance() {
        return this.INSTANCE;
    }
    color_hex(r = { s: 0, e: 255 }, g = { s: 0, e: 255 }, b = { s: 0, e: 255 }) {
        let _r = Math.floor(r.s + Math.random() * (r.e - r.s));
        let _g = Math.floor(g.s + Math.random() * (g.e - g.s));
        let _b = Math.floor(b.s + Math.random() * (b.e - b.s));
        _r = _r > 15 ? _r.toString(16) : "0" + _r.toString(16);
        _g = _g > 15 ? _g.toString(16) : "0" + _g.toString(16);
        _b = _b > 15 ? _b.toString(16) : "0" + _b.toString(16);
        return `#${_r + _g + _b}`; //hexa
    }
    color_rgb(r = { start: 0, end: 255 }, g = { start: 0, end: 255 }, b = { start: 0, end: 255 }) {
        let _r = Math.floor(r.start + Math.random() * (r.end - r.start));
        let _g = Math.floor(g.start + Math.random() * (g.end - g.start));
        let _b = Math.floor(b.start + Math.random() * (b.end - b.start));
        return `rgb(${_r},${_g},${_b}`;
    }
}
