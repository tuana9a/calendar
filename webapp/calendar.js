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
        skipClickHandler: false,
        clickHandler: function (e) {
            let dataDate = e.target.getAttribute("data-date");
            console.log(dataDate);
        },
    };
    function updateMainCalendar() {
        calendarize.write(mainCalendarElement, changeYear, changeMonth, null, mainOpts);
    }

    updateMiniCalendar();
    updateMainCalendar();
    mainOpts.skipClickHandler = true; // after first time add event handler then skip it

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

    fetch("/api/user")
        .then((resp) => resp.json())
        .then((resp) => {
            if (resp.code == 1) {
                let user = resp.data;
                let username = user.username;
                let iconTypes = ["adventurer-neutral", "big-ears-neutral", "initials"];
                let index = Math.floor(Math.random() * iconTypes.length);
                let iconSrc = `https://avatars.dicebear.com/api/${iconTypes[index]}/${username}.svg`;
                document.getElementById("user-icon").src = iconSrc;
            } else {
                alert("not logined yet");
                window.location.href = "/login.html";
            }
        });
}

main();
