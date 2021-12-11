import { apis } from "./apis.js";
import { Calendarize } from "./calendarize.js";
import { DateUtils } from "./utils.js";

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

var selectingDateElement; // dayElement đang được click để tạo sự kiện
const modalElement = document.getElementById("modalEvent");
const closeModalButton = document.getElementById("close-modal");
const addModalButton = document.getElementById("add-modal");

const modalTitle = document.getElementById("title");
const modalDate = document.getElementById("date");
const modalStartTime = document.getElementById("time-start");
const modalEndTime = document.getElementById("time-end");
const modalLocation = document.getElementById("location");
const modalDescription = document.getElementById("description");

const miniOpts = {
    showYearOnTitle: true,
    fullOrShort: "short",
};

const mainOpts = {
    showYearOnTitle: true,
    fullOrShort: "full",
    skipClickHandler: false,
    dbClickHandler: null,
    events: [],
};

function calendarize() {
    return Calendarize.getInstance();
}

function dateUtils() {
    return DateUtils.getInstance();
}

function updateMiniCalendar() {
    calendarize().write(miniCalendarElement, changeYear, changeMonth, null, miniOpts);
}

function updateMainCalendar() {
    calendarize().write(mainCalendarElement, changeYear, changeMonth, null, mainOpts);
}

function appendEvent(dayElement, myEvent = { title: "", date: "", startTime: "", endTime: "", description: "" }) {
    // add new div contains title
    let newEvent = document.createElement("div");
    newEvent.setAttribute("title", myEvent.title);
    newEvent.setAttribute("date", myEvent.date);
    newEvent.setAttribute("description", myEvent.description);
    newEvent.onmouseover = function (e) {
        console.log("mouse over", e.target.getAttribute("title"));
        console.log(e.target.getAttribute("date"));
        console.log(e.target.getAttribute("description"));
    };
    newEvent.onmouseout = (e) => {
        console.log("mouse out", e.target.getAttribute("title"));
        console.log(e.target.getAttribute("date"));
        console.log(e.target.getAttribute("description"));
    };
    newEvent.onclick = (e) => {
        if (!e) var e = window.event;
        e.cancelBubble = true;
        if (e.stopPropagation) e.stopPropagation();
        console.log("delete event");
    };
    let newContent = document.createTextNode(myEvent.startTime + " - " + myEvent.title);
    newEvent.appendChild(newContent);
    dayElement.appendChild(newEvent);
}

mainOpts.dbClickHandler = function (e) {
    selectingDateElement = e.target;
    let dataDate = parseInt(selectingDateElement.getAttribute("data-date"));
    let now = new Date();
    modalStartTime.value = now.toTimeString().substring(0, 8);
    now.setHours(now.getHours() + 1);
    modalEndTime.value = now.toTimeString().substring(0, 8);
    modalDate.value = dateUtils().dateToString(new Date(dataDate), "-");
    modalElement.showModal();
};

addModalButton.onclick = async () => {
    let title = modalTitle.value;
    let date = dateUtils().stringToDate(modalDate.value).getTime();
    let description = modalDescription.value;
    let startTime = modalStartTime.value;
    let endTime = modalEndTime.value;

    //TODO: chuẩn hóa convert cả date và startTime, endTime về milise
    // để add phía database và frontend đều p theo chuẩn chung này
    let response = await apis.event.add({
        title: title,
        date: date,
        startTime: startTime,
        endTime: endTime,
        description: description,
    });
    if (response.code == 1) {
        console.log(response.data);
        appendEvent(selectingDateElement, {
            title: title,
            date: date,
            startTime: startTime,
            endTime: endTime,
            description: description,
        });
    }
};

closeModalButton.onclick = () => modalElement.close();

returnCurrentMonthButton.onclick = () => {
    changeMonth = currentMonth;
    changeYear = currentYear;
    updateMainCalendar();
    updateMiniCalendar();
};

backwardMonthButton.onclick = () => {
    changeMonth -= 1;
    if (changeMonth == -1) {
        changeMonth = 11;
        changeYear -= 1;
    }
    updateMainCalendar();
    updateMiniCalendar();
};

forwardMonthButton.onclick = () => {
    changeMonth += 1;
    if (changeMonth == 12) {
        changeMonth = 0;
        changeYear += 1;
    }
    updateMainCalendar();
    updateMiniCalendar();
};

async function main() {
    let now = new Date();
    let nowYear = now.getFullYear();
    let nowMonth = now.getMonth() + 1; // month start from 0

    await apis.event
        .find({ yearAndMonth: nowYear + "-" + (nowMonth >= 10 ? nowMonth : "0" + nowMonth) })
        .then((resp) => {
            if (resp.code == 1) {
                let events = resp.data;
                mainOpts.events = events;
            }
        });

    updateMiniCalendar();
    updateMainCalendar();
    mainOpts.skipClickHandler = true; // after first time add event handler then skip it
    apis.user.info().then((resp) => {
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
