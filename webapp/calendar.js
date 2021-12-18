import { apis } from "./apis.js";
import { Calendarize } from "./calendarize.js";
import { CLASSNAME_DAY, CLASSNAME_MONTH, CLASSNAME_DOW } from "./constants.js";
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
const modalStartTime = document.getElementById("time-start");
const modalEndTime = document.getElementById("time-end");
const modalLocation = document.getElementById("location");
const modalDescription = document.getElementById("description");

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

function appendEvent(dayElement, myEvent) {
    // add new div contains title
    let eventElement = document.createElement("div");
    eventElement.setAttribute("title", myEvent.title);
    eventElement.setAttribute("description", myEvent.description);
    eventElement.setAttribute("_id", myEvent._id);
    eventElement.setAttribute("startTime", myEvent.startTime);
    eventElement.setAttribute("endTime", myEvent.endTime);
    let eventDisplayName = document.createTextNode(myEvent.title);
    eventElement.onclick = (e) => {
        // TODO: show details event
        // include update, delete
    };
    eventElement.appendChild(eventDisplayName);
    dayElement.appendChild(eventElement);

    // if event dismiss then no need to notify
    if (myEvent.dismiss) return;

    let now = new Date();
    let startDate = new Date(myEvent.startTime);
    if (now < startDate.getTime() - 900000) return;

    // 15min before event;
    apis.notification.send(myEvent.title, {
        body: myEvent.description,
        icon: "/images/calendar.png",
        silent: true,
    });

    // After notify then no auto dimiss
    myEvent.dismiss = true;
    apis.event.update(myEvent);
}

const miniOpts = {
    showYearOnTitle: true,
    fullOrShort: "short",
};

const mainOpts = {
    showYearOnTitle: true,
    fullOrShort: "full",
    skipClickHandler: false,
    dbClickHandler: function (e) {
        selectingDateElement = e.target;
        let date = new Date(parseInt(selectingDateElement.getAttribute("data-date")));
        let now = new Date();
        date.setHours(now.getHours());
        date.setMinutes(now.getMinutes());
        date.setSeconds(now.getSeconds());
        modalStartTime.value = dateUtils().fullDateToInputDatetimeLocalValue(date);
        date.setHours(date.getHours() + 1);
        modalEndTime.value = dateUtils().fullDateToInputDatetimeLocalValue(date);
        modalElement.showModal();
    },
};

async function main() {
    updateMiniCalendar();
    updateMainCalendar();
    mainOpts.skipClickHandler = true; // after first time add event handler then skip it

    addModalButton.onclick = async () => {
        let title = modalTitle.value;
        let description = modalDescription.value;
        let startTime = new Date(modalStartTime.value).getTime();
        let endTime = new Date(modalEndTime.value).getTime();
        let location = modalLocation.value;

        //TODO: chuẩn hóa convert cả date và startTime, endTime về milise
        // để add phía database và frontend đều p theo chuẩn chung này
        let myEvent = {
            title: title,
            startTime: startTime,
            endTime: endTime,
            description: description,
            location: location,
            dismiss: false,
        };
        let response = await apis.event.add(myEvent);
        if (response.code == 1) {
            myEvent._id = response.data.eventId;
            appendEvent(selectingDateElement, myEvent);
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

    apis.user
        .info()
        .then((resp) => {
            if (resp.code == 1) {
                let user = resp.data;
                let username = user.username;
                let iconTypes = ["adventurer-neutral", "big-ears-neutral", "initials"];
                let index = Math.floor(Math.random() * iconTypes.length);
                let iconSrc = `https://avatars.dicebear.com/api/${iconTypes[index]}/${username}.svg`;
                document.getElementById("user-icon").src = iconSrc;
            } else {
                alert("not login yet");
            }
        })
        .catch();

    let date = new Date();
    date.setDate(1);
    date.setHours(0);
    date.setMinutes(0);
    date.setSeconds(0);
    let rangeStart = date.getTime();
    date.setMonth(date.getMonth() + 1);
    let rangeEnd = date.getTime();

    await apis.notification.request();
    let events = JSON.parse(localStorage.getItem("events")) || [];
    try {
        let resp = await apis.event.find({ startTime: { $gt: rangeStart, $lt: rangeEnd } });
        if (resp.code == 1) {
            events = resp.data;
        }
    } catch (err) {
        // ignored
    }
    localStorage.setItem("events", JSON.stringify(events));

    let selector = "." + CLASSNAME_DAY + "." + CLASSNAME_MONTH;
    let dayElements = mainCalendarElement.querySelectorAll(selector);
    events.forEach((myEvent) => {
        let startDate = new Date(myEvent.startTime);
        let elementIndex = startDate.getDate() - 1; //seriously don't ask;
        let dayElement = dayElements.item(elementIndex);
        appendEvent(dayElement, myEvent);
    });
}

main();
