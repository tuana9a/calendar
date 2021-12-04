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

    const modal = document.getElementById("modalEvent");
    const closeModal = document.getElementById("close-modal");
    const addModal = document.getElementById("add-modal");

    const title = document.getElementById("title");
    const date = document.getElementById("date");
    const startTime = document.getElementById("time-start");
    const endTime = document.getElementById("time-end");
    const location = document.getElementById("location");
    const description = document.getElementById("description");

    const calendarize = Calendarize.getInstance();

    //tạo biến lưu ngáy lập sự kiện.
    var dayEvent;

    addModal.addEventListener('click', function() {
        var mainClass = document.querySelector(".main");
        var allday = mainClass.querySelector(`div[data-date=${CSS.escape(dayEvent)}]`);

        // add new div contains title
        let newEvent = document.createElement("div");
        let newContent = document.createTextNode(title.value);
        newEvent.appendChild(newContent);
        allday.appendChild(newEvent);  
    });

    closeModal.addEventListener('click', function() {
        modal.close();
    });

    function openModal(modal, x, y) {
        modal.style.left = `${x}px`;
        modal.style.top = `${y}px`;
        modal.showModal(x, y);
    }

    const miniOpts = {
        showYearOnTitle: true,
        fullOrShort: "short",
    };

    const mainOpts = {
        showYearOnTitle: true,
        fullOrShort: "full",
        skipClickHandler: false,
        clickHandler: function (e) {
            dayEvent = e.target.getAttribute("data-date");
            // console.log(dataDate);
            
            let x = e.pageX;
            let y = e.pageY;
            console.log(dayEvent);
            console.log("x", x);
            console.log("y", y);
            openModal(modal, x, y);
            
        },
    };

    function updateMiniCalendar() {
        calendarize.write(miniCalendarElement, changeYear, changeMonth, null, miniOpts);
    }

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
}

main();
