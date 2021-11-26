import { apis } from "./apis.js";

const MONTH_NAMES = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
];
const DAY_NAMES = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

class Calendarize {
    static INSTANCE = new Calendarize();
    static getInstance() {
        return this.INSTANCE;
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
    // Create only 1 month calendar
    buildMonthCalendar(element, month, year) {
        let _this = this;
        let months = _this.getMonthsInYear(year);

        let opts = {
            showMonth: true,
            showDaysOfWeek: true,
            showYear: true,
            clickHandler: function (e) {
                let day = e.target.getAttribute("data-date");
                //alert(day);
            },
        };

        let $monthNode = _this.buildMonth(month, year, opts);
        element.appendChild($monthNode);
    }
    // Add days and place fillers for a given month
    // This function and the one above needs consolidated
    buildMonth(monthNum, year, opts) {
        //if (monthNum === undefined || year === undefined) return "something is missing";
        let _this = this;
        let date = new Date(year, monthNum, 1);
        let month = date.getMonth();
        let prevMonth = new Date(date.setMonth(month - 1));
        let nextMonth = new Date(date.setMonth(month + 1));
        let daysInMonth = _this.getDaysInMonth(monthNum, year);
        let daysPrevMonth = _this.getDaysInMonth(prevMonth.getMonth(), prevMonth.getFullYear());
        let daysNextMonth = _this.getDaysInMonth(nextMonth.getMonth(), nextMonth.getFullYear());
        let $monthElement = document.createElement("div");
        let $titleElement = document.createElement("div");
        let skipLength = daysInMonth[0].getDay();
        let preLength = daysInMonth.length + skipLength;
        let postLength = function () {
            if (preLength % 7 === 0) {
                return 0;
            } else {
                if (preLength < 35) {
                    return 35 - preLength;
                } else {
                    return 42 - preLength;
                }
            }
        };

        let $mainDays = document.getElementsByClassName("task-cell");
        let countMainDay = 0;

        $monthElement.classList.add("month");

        // Add a Title to the month
        if (opts.showMonth) {
            $titleElement.classList.add("month-title");
            $titleElement.innerText = MONTH_NAMES[monthNum] + (opts.showYear ? " " + year : "");
            $monthElement.appendChild($titleElement);
        }

        // Add Days of week to the top row
        if (opts.showDaysOfWeek) {
            DAY_NAMES.forEach(function (name, index) {
                let $dayNode = document.createElement("div");
                $dayNode.classList.add("dow");
                $dayNode.innerText = DAY_NAMES[index];
                $monthElement.appendChild($dayNode);
            });
        }

        // Add blank days to fill in before first day
        for (let i = 0; i < skipLength; i++) {
            let $dayNode = document.createElement("div");
            $dayNode.classList.add("dummy-day");
            $dayNode.innerText = daysPrevMonth.length - (skipLength - (i + 1));
            $monthElement.appendChild($dayNode);
            $mainDays[countMainDay].innerText = daysPrevMonth.length - (skipLength - (i + 1));
            $mainDays[countMainDay].classList.remove("is-current-month");
            countMainDay += 1;
        }

        // Place a day for each day of the month
        daysInMonth.forEach(function (c, d) {
            let today = new Date(new Date().setHours(0, 0, 0, 0));
            let $dayNode = document.createElement("div");
            $dayNode.classList.add("day");
            $dayNode.setAttribute("data-date", c);
            $dayNode.innerText = d + 1;
            $mainDays[countMainDay].innerText = d + 1;
            $mainDays[countMainDay].classList.add("is-current-month");
            countMainDay += 1;

            let dow = new Date(c).getDay();
            let dateParsed = Date.parse(c);
            let todayParsed = Date.parse(today);

            if (dateParsed === todayParsed) $dayNode.classList.add("today");
            if (dateParsed > todayParsed) $dayNode.classList.add("future");
            if (dateParsed < todayParsed) $dayNode.classList.add("past");

            if (dow === 0 || dow === 6) $dayNode.classList.add("weekend");
            if (opts.onlyCurrent && c < today) $dayNode.classList.add("dummy-day");
            if (opts.limitDate) {
                if (c > opts.limitDate) {
                    $dayNode.classList.add("dummy-day");
                }
            }

            if (opts.filterDayOfWeek) {
                let valid = false;
                for (let i = 0; i < opts.filterDayOfWeek.length; i++) {
                    if (c.getDay() == opts.filterDayOfWeek[i]) {
                        valid = true;
                    }
                }
                if (!valid) {
                    $dayNode.classList.add("dummy-day");
                }
            }
            if (opts.clickHandler && !$dayNode.classList.contains("dummy-day")) {
                function handleEvent(e) {
                    e = e || window.event;
                    e.preventDefault();
                    e.stopPropagation();
                    let touches = false;
                    if (!touches) {
                        touches = true;
                        setTimeout(function () {
                            touches = false;
                        }, 300);
                        opts.clickHandler(e);
                    }
                }
                $dayNode.addEventListener("touchstart", handleEvent);
                $dayNode.addEventListener("mousedown", handleEvent);
            }
            $monthElement.appendChild($dayNode);
        });

        // Add in the dummy filler days to make an even block
        for (let j = 0; j < postLength(); j++) {
            let $dayNode = document.createElement("div");
            $dayNode.classList.add("dummy-day");
            $dayNode.innerText = j + 1;
            $monthElement.appendChild($dayNode);
            $mainDays[countMainDay].innerText = j + 1;
            $mainDays[countMainDay].classList.remove("is-current-month");
            countMainDay += 1;
        }

        if (countMainDay == 35) {
            for (let i = 0; i < 7; i++) {
                $mainDays[countMainDay + i].innerText = "";
                $mainDays[countMainDay + i].classList.remove("is-current-month");
            }
        }

        return $monthElement;
    }
}

function main() {
    const TIME_OPTS = {
        currentYear: 0,
        currentMonth: 0,
        changeMonth: -1,
        changeYear: -1,
    };

    TIME_OPTS.currentYear = new Date().getFullYear();
    TIME_OPTS.currentMonth = new Date().getMonth();
    TIME_OPTS.changeMonth = TIME_OPTS.currentMonth;
    TIME_OPTS.changeYear = TIME_OPTS.currentYear;

    const $miniCalendar = document.getElementById("miniCalendar");
    const $mainCalendar = document.getElementById("mainCalendar");
    const $returnCurrentMonth = document.getElementById("returnCurrentMonth");
    const $backwardMonth = document.getElementById("backwardMonth");
    const $forwardMonth = document.getElementById("forwardMonth");

    const calendarize = Calendarize.getInstance();
    calendarize.buildMonthCalendar($miniCalendar, TIME_OPTS.currentMonth, TIME_OPTS.currentYear);

    $returnCurrentMonth.addEventListener("click", () => {
        const calendarize = Calendarize.getInstance();
        while ($miniCalendar.firstChild) {
            $miniCalendar.removeChild($miniCalendar.lastChild);
        }
        TIME_OPTS.changeMonth = TIME_OPTS.currentMonth;
        TIME_OPTS.changeYear = TIME_OPTS.currentYear;
        calendarize.buildMonthCalendar($miniCalendar, TIME_OPTS.changeMonth, TIME_OPTS.changeYear);
    });

    $backwardMonth.addEventListener("click", () => {
        const calendarize = Calendarize.getInstance();
        while ($miniCalendar.firstChild) {
            $miniCalendar.removeChild($miniCalendar.lastChild);
        }
        TIME_OPTS.changeMonth -= 1;
        if (TIME_OPTS.changeMonth == -1) {
            TIME_OPTS.changeMonth = 11;
            TIME_OPTS.changeYear -= 1;
        }
        calendarize.buildMonthCalendar($miniCalendar, TIME_OPTS.changeMonth, TIME_OPTS.changeYear);
    });

    $forwardMonth.addEventListener("click", () => {
        const calendarize = Calendarize.getInstance();
        while ($miniCalendar.firstChild) {
            $miniCalendar.removeChild($miniCalendar.lastChild);
        }
        TIME_OPTS.changeMonth += 1;
        if (TIME_OPTS.changeMonth == 12) {
            TIME_OPTS.changeMonth = 0;
            TIME_OPTS.changeYear += 1;
        }
        calendarize.buildMonthCalendar($miniCalendar, TIME_OPTS.changeMonth, TIME_OPTS.changeYear);
    });
}

main();
