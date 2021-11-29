import { Calendarize } from "./calendarize.js";

function main() {
    let currentYear = -1;
    let currentMonth = -1;
    let currentDate = -1;
    let changeMonth = -1;
    let changeYear = -1;

    let now = new Date();
    currentYear = now.getFullYear();
    currentMonth = now.getMonth();
    currentDate = now.getDate();
    changeMonth = currentMonth;
    changeYear = currentYear;

    const miniCalendarElement = document.getElementById("miniCalendar");
    const mainCalendarElement = document.getElementById("mainCalendar");
    const returnCurrentMonthButton = document.getElementById("returnCurrentMonth");
    const backwardMonthButton = document.getElementById("backwardMonth");
    const forwardMonthButton = document.getElementById("forwardMonth");

    const calendarize = Calendarize.getInstance();
    const miniOpts = {
        showYearOnTitle: true,
        fullOrShort: "short",
    };
    const mainOpts = {
        showYearOnTitle: true,
        fullOrShort: "full",
    };
    calendarize.write(mainCalendarElement, currentYear, currentMonth, currentDate, mainOpts);
    calendarize.write(miniCalendarElement, currentYear, currentMonth, currentDate, miniOpts);

    returnCurrentMonthButton.addEventListener("click", () => {
        const calendarize = Calendarize.getInstance();
        changeMonth = currentMonth;
        changeYear = currentYear;
        calendarize.write(mainCalendarElement, changeYear, changeMonth, null, mainOpts);
        calendarize.write(miniCalendarElement, changeYear, changeMonth, null, miniOpts);
    });

    backwardMonthButton.addEventListener("click", () => {
        const calendarize = Calendarize.getInstance();
        changeMonth -= 1;
        if (changeMonth == -1) {
            changeMonth = 11;
            changeYear -= 1;
        }
        calendarize.write(mainCalendarElement, changeYear, changeMonth, null, mainOpts);
        calendarize.write(miniCalendarElement, changeYear, changeMonth, null, miniOpts);
    });

    forwardMonthButton.addEventListener("click", () => {
        const calendarize = Calendarize.getInstance();
        changeMonth += 1;
        if (changeMonth == 12) {
            changeMonth = 0;
            changeYear += 1;
        }
        calendarize.write(mainCalendarElement, changeYear, changeMonth, null, mainOpts);
        calendarize.write(miniCalendarElement, changeYear, changeMonth, null, miniOpts);
    });
}

main();
