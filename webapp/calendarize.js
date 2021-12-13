import { DateUtils } from "./utils.js";
import {
    CLASSNAME_CALENDAR_DATE_TITLE,
    CLASSNAME_CALENDAR_GRID,
    CLASSNAME_DAY,
    CLASSNAME_MONTH,
    CLASSNAME_DOW,
    CLASSNAME_DUMMY,
    CLASSNAME_FUTURE,
    DAY_NAMES,
    CLASSNAME_PAST,
    CLASSNAME_TODAY,
    CLASSNAME_WEEKEND,
    MONTH_NAMES,
} from "./constants.js";

function clearDayStateClassName(element) {
    element.classList.remove(CLASSNAME_DUMMY);
    element.classList.remove(CLASSNAME_MONTH);
    element.classList.remove(CLASSNAME_WEEKEND);
    element.classList.remove(CLASSNAME_TODAY);
    element.classList.remove(CLASSNAME_FUTURE);
    element.classList.remove(CLASSNAME_PAST);
}

export class Calendarize {
    static INSTANCE = new Calendarize();
    static getInstance() {
        return this.INSTANCE;
    }
    // Add days and place fillers for a given month
    // This function and the one above needs consolidated
    write(
        containerElement = document.getElementsByClassName(CLASSNAME_CALENDAR_GRID).item(0),
        yearNum,
        monthNum,
        dateNum, // hiện tại dateNum hơi vô dụng do build chỉ cần năm và tháng
        opts = {
            showYearOnTitle: false,
            fullOrShort: "full",
            dropDayOfWeek: undefined, // drop ngày trong tuần
            isMinimal: false,
            skipClickHandler: false,
            clickHandler: function (e) {
                let dataDate = e.target.getAttribute("data-date");
                console.log(dataDate);
            },
            dbClickHandler: function (e) {
                let dataDate = e.target.getAttribute("data-date");
                console.log(dataDate);
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

        let dayElements = containerElement.getElementsByClassName(CLASSNAME_DAY);
        let countMainDay = 0;

        // Add a Title to the month
        let titleElement = containerElement.getElementsByClassName(CLASSNAME_CALENDAR_DATE_TITLE).item(0);
        titleElement.innerText = MONTH_NAMES[monthNum][opts.fullOrShort] + (opts.showYearOnTitle ? " " + yearNum : "");

        // Add Days of week to the top row
        DAY_NAMES.forEach(function (name, index) {
            const dayElement = dayElements[countMainDay];
            dayElement.classList.add(CLASSNAME_DOW);
            dayElement.innerText = DAY_NAMES[index][opts.fullOrShort];
            countMainDay += 1;
        });

        // Add blank days to fill in before first day
        for (let i = 0; i < skipLength; i++) {
            let dummyDateNum = daysPrevMonth.length - (skipLength - (i + 1));
            const dayElement = dayElements[countMainDay];
            dayElement.innerText = dummyDateNum;
            clearDayStateClassName(dayElement);
            dayElement.classList.add(CLASSNAME_DUMMY);
            countMainDay += 1;
        }

        // Place a day for each day of the month
        let today = new Date(new Date().setHours(0, 0, 0, 0));
        let todayParsed = Date.parse(today);

        daysInMonth.forEach(function (date, dayNum) {
            const dayElement = dayElements[countMainDay];
            dayElement.innerText = dayNum + 1;
            clearDayStateClassName(dayElement);
            dayElement.classList.add(CLASSNAME_MONTH);
            dayElement.setAttribute("data-date", new Date(yearNum, monthNum, dayNum + 1).getTime());
            countMainDay += 1;

            let dow = new Date(date).getDay();
            let dateParsed = Date.parse(date);

            if (dateParsed === todayParsed) {
                dayElement.classList.add(CLASSNAME_TODAY);
            } else if (dateParsed > todayParsed) {
                dayElement.classList.add(CLASSNAME_FUTURE);
            } else if (dateParsed < todayParsed) {
                dayElement.classList.add(CLASSNAME_PAST);
            }

            if (dow === 0 || dow === 6) {
                dayElement.classList.add(CLASSNAME_WEEKEND);
            }

            if (opts.dropDayOfWeek) {
                let valid = false;
                for (let i = 0; i < opts.dropDayOfWeek.length; i++) {
                    if (date.getDay() == opts.dropDayOfWeek[i]) {
                        valid = true;
                    }
                }
                if (!valid) {
                    dayElement.classList.add(CLASSNAME_DUMMY);
                }
            }

            if (dayElement.classList.contains(CLASSNAME_DUMMY)) return;
            if (opts.skipClickHandler) return;
            if (opts.clickHandler) {
                dayElement.onclick = function (e) {
                    e = e || window.event;
                    e.preventDefault();
                    e.stopPropagation();
                    opts.clickHandler(e);
                };
            }
            if (opts.dbClickHandler) {
                dayElement.ondblclick = function (e) {
                    e = e || window.event;
                    e.preventDefault();
                    e.stopPropagation();
                    opts.dbClickHandler(e);
                };
            }
        });

        // Add in the dummy filler days to make an even block
        for (let i = 0; i < postLength; i++) {
            let dateNum = i + 1;
            const dayElement = dayElements[countMainDay];
            dayElement.innerText = dateNum;
            clearDayStateClassName(dayElement);
            dayElement.classList.add(CLASSNAME_DUMMY);
            countMainDay += 1;
        }

        // Clean old dummy
        if (countMainDay == 42) {
            for (let i = 0; i < 7; i++) {
                const dayElement = dayElements[countMainDay + i];
                dayElement.innerText = "";
                clearDayStateClassName(dayElement);
                dayElement.classList.add(CLASSNAME_DUMMY);
            }
        }

        return containerElement;
    }
}
