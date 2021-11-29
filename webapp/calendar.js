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
    function updateMiniCalendar() {
        calendarize.write(miniCalendarElement, changeYear, changeMonth, null, miniOpts);
    }

    const mainOpts = {
        showYearOnTitle: true,
        fullOrShort: "full",
        clickHandler: function (e) {
            let dateTimeMilisecs = e.target.getAttribute("data-date");
            let date = new Date(parseInt(dateTimeMilisecs));
            console.log(date);
        },
    };
    function updateMainCalendar() {
        calendarize.write(mainCalendarElement, changeYear, changeMonth, null, mainOpts);
    }

    updateMiniCalendar();
    updateMainCalendar();

    returnCurrentMonthButton.addEventListener("click", () => {
        changeMonth = currentMonth;
        changeYear = currentYear;
        updateMainCalendar();
        updateMiniCalendar();
    });

    backwardMonthButton.addEventListener("click", () => {
        changeMonth -= 1;
        if (changeMonth == -1) {
            changeMonth = 11;
            changeYear -= 1;
        }
        updateMainCalendar();
        updateMiniCalendar();
    });

    forwardMonthButton.addEventListener("click", () => {
        changeMonth += 1;
        if (changeMonth == 12) {
            changeMonth = 0;
            changeYear += 1;
        }
        updateMainCalendar();
        updateMiniCalendar();
    });
}

main();
