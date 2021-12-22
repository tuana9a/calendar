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
const currentMonthButton = document.getElementById("returnCurrentMonth");
const backwardMonthButton = document.getElementById("backwardMonth");
const forwardMonthButton = document.getElementById("forwardMonth");

// dayElement đang được click để tạo sự kiện
// eventElement đang được chọn để cập nhật hoặc xoá
var selectingElement;

const modalElement = document.getElementById("modalEvent");
const closeModalButton = document.getElementById("close-modal");
const addModalButton = document.getElementById("add-modal");

const modalDetails = document.getElementById("modalDetails");
const closeDetailsButton = document.getElementById("close-details");
const updateDetailsButton = document.getElementById("update-details");
const deleteDetailsButton = document.getElementById("delete-details");

const modalTitleDetail = document.getElementById("title-detail");
const modalStartTimeDetail = document.getElementById("time-start-detail");
const modalEndTimeDetail = document.getElementById("time-end-detail");
const modalLocationDetail = document.getElementById("location-detail");
const modalDescriptionDetail = document.getElementById("description-detail");

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
    eventElement.setAttribute("_id", myEvent._id);
    eventElement.setAttribute("title", myEvent.title);
    eventElement.setAttribute("description", myEvent.description);
    eventElement.setAttribute("startTime", myEvent.startTime);
    eventElement.setAttribute("endTime", myEvent.endTime);
    eventElement.setAttribute("location", myEvent.location);
    eventElement.innerText = myEvent.title;
    eventElement.onclick = (e) => {
        selectingElement = eventElement;
        let startTimeDetail = dateUtils().fullDetailDate(eventElement.getAttribute("startTime"));
        let endTimeDetail = dateUtils().fullDetailDate(eventElement.getAttribute("endTime"));

        modalTitleDetail.value = eventElement.getAttribute("title");
        modalStartTimeDetail.value = startTimeDetail;
        modalEndTimeDetail.value = endTimeDetail;
        modalDescriptionDetail.value = eventElement.getAttribute("description");
        modalLocationDetail.value = eventElement.getAttribute("location");
        modalDetails.showModal();
    };
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

async function updateEvents() {
    let startTime = new Date(changeYear, changeMonth).getTime();
    let endTime = new Date(changeYear, changeMonth + 1).getTime();
    let events = [];
    let response = await apis.event.find({ startTime: { $gt: startTime, $lt: endTime } }).catch();
    if (response.code == 1) {
        events = response.data;
    }
    let selector = "." + CLASSNAME_DAY + "." + CLASSNAME_MONTH;
    let dayElements = mainCalendarElement.querySelectorAll(selector);
    events.forEach((myEvent) => {
        let startDate = new Date(myEvent.startTime);
        let elementIndex = startDate.getDate() - 1; //seriously don't ask;
        let dayElement = dayElements.item(elementIndex);
        appendEvent(dayElement, myEvent);
    });
    return events;
}

async function updateAll() {
    updateMainCalendar();
    updateMiniCalendar();
    updateEvents();
}

async function fetchUserInfo() {
    return apis.user
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
        selectingElement = e.target;
        let date = new Date(parseInt(selectingElement.getAttribute("data-date")));
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
            appendEvent(selectingElement, myEvent);
        }
    };

    closeModalButton.onclick = () => modalElement.close();

    updateDetailsButton.onclick = async () => {
        let updateDetails = {
            _id: selectingElement.getAttribute("_id"),
            title: modalTitleDetail.value,
            startTime: new Date(modalStartTimeDetail.value).getTime(),
            endTime: new Date(modalEndTimeDetail.value).getTime(),
            description: modalDescriptionDetail.value,
            location: modalLocationDetail.value,
            dismiss: false,
        };
        let response = await apis.event.update(updateDetails);
        if (response.code != 1) {
            alert("update failed");
            return;
        }
        if (response.data.count == 0) {
            alert("update failed");
            return;
        }
        selectingElement.setAttribute("_id", updateDetails._id);
        selectingElement.setAttribute("title", updateDetails.title);
        selectingElement.setAttribute("description", updateDetails.description);
        selectingElement.setAttribute("startTime", updateDetails.startTime);
        selectingElement.setAttribute("endTime", updateDetails.endTime);
        selectingElement.setAttribute("location", updateDetails.location);
        selectingElement.innerText = updateDetails.title;
    };

    deleteDetailsButton.onclick = async () => {
        let eventId = selectingElement.getAttribute("_id");
        let response = await apis.event.delete({ _id: eventId });
        if (response.code != 1) {
            alert("deleted failed");
            return;
        }
        if (response.data.count != 1) {
            alert("deleted failed");
            return;
        }
        selectingElement.remove();
    };

    closeDetailsButton.onclick = () => modalDetails.close();

    currentMonthButton.onclick = () => {
        changeMonth = currentMonth;
        changeYear = currentYear;
        updateAll();
    };

    backwardMonthButton.onclick = () => {
        changeMonth -= 1;
        if (changeMonth == -1) {
            changeMonth = 11;
            changeYear -= 1;
        }
        updateAll();
    };

    forwardMonthButton.onclick = () => {
        changeMonth += 1;
        if (changeMonth == 12) {
            changeMonth = 0;
            changeYear += 1;
        }
        updateAll();
    };

    fetchUserInfo();

    await apis.notification.request();
    let events = await updateEvents();
    events = events || JSON.parse(localStorage.getItem("events")) || [];
    localStorage.setItem("events", JSON.stringify(events));
}

main();
