import { apis } from "./apis.js";
import { DateUtils } from "./utils.js";

const MONTH_NAMES = [
    {
        full: "January",
        short: "Jan",
    },
    {
        full: "February",
        short: "Feb",
    },
    {
        full: "March",
        short: "Mar",
    },
    {
        full: "April",
        short: "Apr",
    },
    {
        full: "May",
        short: "May",
    },
    {
        full: "June",
        short: "Jun",
    },
    {
        full: "July",
        short: "Jul",
    },
    {
        full: "August",
        short: "Aug",
    },
    {
        full: "September",
        short: "Sep",
    },
    {
        full: "October",
        short: "Oct",
    },
    {
        full: "November",
        short: "Nov",
    },
    {
        full: "December",
        short: "Dec",
    },
];

const DAY_NAMES = [
    {
        full: "Sunday",
        short: "Su",
    },
    {
        full: "Monday",
        short: "Mo",
    },
    {
        full: "Tuesday",
        short: "Tu",
    },
    {
        full: "Wednesday",
        short: "We",
    },
    {
        full: "Thursday",
        short: "Th",
    },
    {
        full: "Friday",
        short: "Fr",
    },
    {
        full: "Saturday",
        short: "Sa",
    },
];

const DAY_CLASS_NAME = "day";
const DAY_DOW_CLASS_NAME = "dow";
const DAY_HIDE_CLASS_NAME = "hide";
const DAY_DUMMY_CLASS_NAME = "dummy";
const DAY_CURRENT_MONTH_CLASS_NAME = "month";
const DAY_WEEKEND_CLASS_NAME = "weekend";
const DAY_TODAY_CLASS_NAME = "today";
const DAY_FUTURE_CLASS_NAME = "future";
const DAY_PAST_CLASS_NAME = "past";

const CALENDAR_GRID_CLASS_NAME = "calendar-grid";
const CALENDAR_DATE_TITLE_CLASS_NAME = "calendar-date-title";

export class Calendarize {
    static INSTANCE = new Calendarize();
    static getInstance() {
        return this.INSTANCE;
    }
    // Add days and place fillers for a given month
    // This function and the one above needs consolidated
    write(
        containerElement = document.getElementsByClassName(CALENDAR_GRID_CLASS_NAME).item(0),
        yearNum,
        monthNum,
        dateNum, // hiện tại dateNum hơi vô dụng do build chỉ cần năm và tháng
        opts = {
            showYearOnTitle: false,
            fullOrShort: "full",
            dropDayOfWeek: undefined, // drop ngày trong tuần
            isMinimal: false,
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

        let skipLength = daysInMonth[0].getDay();
        let preLength = daysInMonth.length + skipLength;

        let postLength = 0; // if (length % 7 == 0) so no need to add dummy day at end
        if (opts.isMinimal) {
            if (preLength % 7 !== 0) {
                if (preLength < 35) {
                    postLength = 35 - preLength; // 7*5=35
                } else {
                    postLength = 42 - preLength; // 7*6=42
                }
            }
        } else {
            if (preLength < 42) {
                postLength = 42 - preLength; // 7*6=42
            } else {
                postLength = 49 - preLength; // 7*7=49
            }
        }

        let dayElements = containerElement.getElementsByClassName(DAY_CLASS_NAME);
        let countMainDay = 0;

        // Add a Title to the month
        let titleElement = containerElement.getElementsByClassName(CALENDAR_DATE_TITLE_CLASS_NAME).item(0);
        titleElement.innerText = MONTH_NAMES[monthNum][opts.fullOrShort] + (opts.showYearOnTitle ? " " + yearNum : "");

        // Add Days of week to the top row
        DAY_NAMES.forEach(function (name, index) {
            const dayElement = dayElements[countMainDay];
            dayElement.classList.add(DAY_DOW_CLASS_NAME);
            dayElement.innerText = DAY_NAMES[index][opts.fullOrShort];
            countMainDay += 1;
        });

        // Add blank days to fill in before first day
        for (let i = 0; i < skipLength; i++) {
            let dummyDateNum = daysPrevMonth.length - (skipLength - (i + 1));
            const dayElement = dayElements[countMainDay];
            dayElement.innerText = dummyDateNum;
            dayElement.classList.remove(DAY_CURRENT_MONTH_CLASS_NAME);
            dayElement.classList.add(DAY_DUMMY_CLASS_NAME);
            countMainDay += 1;
        }

        // Place a day for each day of the month
        daysInMonth.forEach(function (date, dayNum) {
            let today = new Date(new Date().setHours(0, 0, 0, 0));
            const dayElement = dayElements[countMainDay];
            dayElement.innerText = dayNum + 1;
            dayElement.classList.remove(DAY_DUMMY_CLASS_NAME);
            dayElement.classList.add(DAY_CURRENT_MONTH_CLASS_NAME);
            dayElement.setAttribute("data-date", date.getTime());
            countMainDay += 1;

            let dow = new Date(date).getDay();
            let dateParsed = Date.parse(date);
            let todayParsed = Date.parse(today);

            if (dateParsed === todayParsed) {
                dayElement.classList.add(DAY_TODAY_CLASS_NAME);
            } else if (dateParsed > todayParsed) {
                dayElement.classList.add(DAY_FUTURE_CLASS_NAME);
            } else if (dateParsed < todayParsed) {
                dayElement.classList.add(DAY_PAST_CLASS_NAME);
            }

            if (dow === 0 || dow === 6) {
                dayElement.classList.add(DAY_WEEKEND_CLASS_NAME);
            }

            if (opts.dropDayOfWeek) {
                let valid = false;
                for (let i = 0; i < opts.dropDayOfWeek.length; i++) {
                    if (date.getDay() == opts.dropDayOfWeek[i]) {
                        valid = true;
                    }
                }
                if (!valid) {
                    dayElement.classList.add(DAY_DUMMY_CLASS_NAME);
                }
            }

            if (opts.clickHandler && !dayElement.classList.contains(DAY_DUMMY_CLASS_NAME)) {
                dayElement.addEventListener("mousedown", function (e) {
                    e = e || window.event;
                    e.preventDefault();
                    e.stopPropagation();
                    opts.clickHandler(e);
                });
            }
        });

        // Add in the dummy filler days to make an even block
        for (let i = 0; i < postLength; i++) {
            let dateNum = i + 1;
            const dayElement = dayElements[countMainDay];
            dayElement.innerText = dateNum;
            dayElement.classList.add(DAY_DUMMY_CLASS_NAME);
            dayElement.classList.remove(DAY_CURRENT_MONTH_CLASS_NAME);
            countMainDay += 1;
        }

        // Clean old dummy
        if (countMainDay == 42) {
            for (let i = 0; i < 7; i++) {
                const dayElement = dayElements[countMainDay + i];
                dayElement.innerText = "";
                dayElement.classList.add(DAY_DUMMY_CLASS_NAME);
                dayElement.classList.remove(DAY_CURRENT_MONTH_CLASS_NAME);
            }
        }

        return containerElement;
    }
}
