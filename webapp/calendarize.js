import { apis } from "./apis.js";
import { DateUtils } from "./utils.js";

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

export class Calendarize {
    static INSTANCE = new Calendarize();
    static getInstance() {
        return this.INSTANCE;
    }
    // Create only 1 month calendar
    buildMonthCalendar(element, year, month, date = 1) {
        let _this = this;
        let $monthNode = _this.createMonthElement(month, year, date);
        element.appendChild($monthNode);
    }
    // Add days and place fillers for a given month
    // This function and the one above needs consolidated
    createMonthElement(
        monthNum,
        yearNum,
        dateNum,
        opts = {
            showMonth: true,
            showDaysOfWeek: true,
            showYear: true,
            onlyCurrent: false,
            limitDate: undefined, // unknown
            filterDayOfWeek: undefined, // unknown
            clickHandler: function (e) {
                let day = e.target.getAttribute("data-date");
                console.log(day);
            },
        },
    ) {
        //if (monthNum === undefined || year === undefined) return "something is missing";
        const dateUtils = DateUtils.getInstance();

        let date = new Date(yearNum, monthNum, dateNum);
        let prevMonth = new Date(date.setMonth(monthNum - 1));
        let nextMonth = new Date(date.setMonth(monthNum + 1));

        let daysInMonth = dateUtils.getDaysInMonth(monthNum, yearNum);
        let daysPrevMonth = dateUtils.getDaysInMonth(prevMonth.getMonth(), prevMonth.getFullYear());
        let daysNextMonth = dateUtils.getDaysInMonth(nextMonth.getMonth(), nextMonth.getFullYear());

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
            $titleElement.innerText = MONTH_NAMES[monthNum] + (opts.showYear ? " " + yearNum : "");
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
        daysInMonth.forEach(function (date, dayNum) {
            let today = new Date(new Date().setHours(0, 0, 0, 0));
            let $dayNode = document.createElement("div");
            $dayNode.classList.add("day");
            $dayNode.setAttribute("data-date", date);
            $dayNode.innerText = dayNum + 1;
            $mainDays[countMainDay].innerText = dayNum + 1;
            $mainDays[countMainDay].classList.add("is-current-month");
            countMainDay += 1;

            let dow = new Date(date).getDay();
            let dateParsed = Date.parse(date);
            let todayParsed = Date.parse(today);

            if (dateParsed === todayParsed) {
                $dayNode.classList.add("today");
            } else if (dateParsed > todayParsed) {
                $dayNode.classList.add("future");
            } else if (dateParsed < todayParsed) {
                $dayNode.classList.add("past");
            }

            if (dow === 0 || dow === 6) {
                $dayNode.classList.add("weekend");
            }

            if (opts.onlyCurrent && date < today) {
                $dayNode.classList.add("dummy-day");
            }

            if (opts.limitDate) {
                if (date > opts.limitDate) {
                    $dayNode.classList.add("dummy-day");
                }
            }

            if (opts.filterDayOfWeek) {
                let valid = false;
                for (let i = 0; i < opts.filterDayOfWeek.length; i++) {
                    if (date.getDay() == opts.filterDayOfWeek[i]) {
                        valid = true;
                    }
                }
                if (!valid) {
                    $dayNode.classList.add("dummy-day");
                }
            }

            if (opts.clickHandler && !$dayNode.classList.contains("dummy-day")) {
                $dayNode.addEventListener("mousedown", function (e) {
                    e = e || window.event;
                    e.preventDefault();
                    e.stopPropagation();
                    opts.clickHandler(e);
                });
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
