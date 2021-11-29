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

    const $miniCalendar = document.getElementById("miniCalendar");
    const $mainCalendar = document.getElementById("mainCalendar");
    const $returnCurrentMonth = document.getElementById("returnCurrentMonth");
    const $backwardMonth = document.getElementById("backwardMonth");
    const $forwardMonth = document.getElementById("forwardMonth");

    const calendarize = Calendarize.getInstance();
    calendarize.buildMonthCalendar($miniCalendar, currentYear, currentMonth);

    $returnCurrentMonth.addEventListener("click", () => {
        const calendarize = Calendarize.getInstance();
        while ($miniCalendar.firstChild) {
            $miniCalendar.removeChild($miniCalendar.lastChild);
        }
        changeMonth = currentMonth;
        changeYear = currentYear;
        calendarize.buildMonthCalendar($miniCalendar, changeYear, changeMonth);
    });

    $backwardMonth.addEventListener("click", () => {
        const calendarize = Calendarize.getInstance();
        while ($miniCalendar.firstChild) {
            $miniCalendar.removeChild($miniCalendar.lastChild);
        }
        changeMonth -= 1;
        if (changeMonth == -1) {
            changeMonth = 11;
            changeYear -= 1;
        }
        calendarize.buildMonthCalendar($miniCalendar, changeYear, changeMonth);
    });

    $forwardMonth.addEventListener("click", () => {
        const calendarize = Calendarize.getInstance();
        while ($miniCalendar.firstChild) {
            $miniCalendar.removeChild($miniCalendar.lastChild);
        }
        changeMonth += 1;
        if (changeMonth == 12) {
            changeMonth = 0;
            changeYear += 1;
        }
        calendarize.buildMonthCalendar($miniCalendar, changeYear, changeMonth);
    });
}

main();
