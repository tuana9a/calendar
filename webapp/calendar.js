import { apis } from "./apis.js";
import { Calendarize } from "./calendarize.js";
import { CLASSNAME_DAY, CLASSNAME_MONTH, CLASSNAME_DOW, CACHE_EVENTS_PREFIX, CLASSNAME_EVENT } from "./constants.js";
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

const miniCalendarize = new Calendarize(document.getElementById("miniCalendar"));
const mainCalendarize = new Calendarize(document.getElementById("mainCalendar"));
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

function updateMiniCalendar() {
    miniCalendarize.render(changeYear, changeMonth, null, miniOpts);
}

function updateMainCalendar() {
    mainCalendarize.render(changeYear, changeMonth, null, mainOpts);
}

function createEventOnClickHandler(eventElement) {
    function handler() {
        const dateUtils = DateUtils.getInstance();
        selectingElement = eventElement;
        modalTitleDetail.value = eventElement.getAttribute("data-title");
        modalStartTimeDetail.value = dateUtils.fullDetailDate(eventElement.getAttribute("data-startTime"));
        modalEndTimeDetail.value = dateUtils.fullDetailDate(eventElement.getAttribute("data-endTime"));
        modalDescriptionDetail.value = eventElement.getAttribute("data-description");
        modalLocationDetail.value = eventElement.getAttribute("data-location");
        modalDetails.showModal();
    }
    return handler;
}

function clearAllEvents() {
    const dayElements = mainCalendarize.getDayElements();
    dayElements.forEach((dayElement) => {
        let eventElements = Array.from(dayElement.getElementsByClassName(CLASSNAME_EVENT));
        eventElements.forEach((eventElement) => {
            eventElement.remove();
        });
    });
}

function appendEvent(dayElement, myEvent) {
    // add new div contains title
    let eventElement = document.createElement("div");
    eventElement.classList.add(CLASSNAME_EVENT);
    eventElement.setAttribute("data-eventId", myEvent._id);
    eventElement.setAttribute("data-title", myEvent.title);
    eventElement.setAttribute("data-description", myEvent.description);
    eventElement.setAttribute("data-startTime", myEvent.startTime);
    eventElement.setAttribute("data-endTime", myEvent.endTime);
    eventElement.setAttribute("data-location", myEvent.location);
    eventElement.innerText = myEvent.title;
    eventElement.onclick = createEventOnClickHandler(eventElement);
    dayElement.appendChild(eventElement);
}

function appendManyEvents(events = []) {
    const dayElements = mainCalendarize.getDayElements();
    events.forEach((myEvent) => {
        let startDate = new Date(myEvent.startTime);
        let elementIndex = startDate.getDate() - 1; //seriously don't ask;
        let dayElement = dayElements[elementIndex];
        appendEvent(dayElement, myEvent);
    });
}

function getCurrentEventLocalStorageName() {
    return CACHE_EVENTS_PREFIX + changeYear + "." + changeMonth;
}

function getCacheEventsExpireName() {
    return CACHE_EVENTS_PREFIX + "expire";
}

async function fetchCacheEvents() {
    let item = localStorage.getItem(getCurrentEventLocalStorageName());
    if (!item) return;
    let events = JSON.parse(item);
    appendManyEvents(events);
    return;
}

async function updateEvents() {
    let startTime = new Date(changeYear, changeMonth).getTime();
    let endTime = new Date(changeYear, changeMonth + 1).getTime();
    let events = null;
    try {
        let response = await apis.event.find({ startTime: { $gt: startTime, $lt: endTime } });
        if (response.code == 1) {
            events = response.data;
            localStorage.setItem(getCurrentEventLocalStorageName(), JSON.stringify(events));
            clearAllEvents();
            appendManyEvents(events);
        }
    } catch (err) {
        // ignore maybe network
    }
    return events;
}

async function updateAll() {
    updateMainCalendar();
    updateMiniCalendar();
    fetchCacheEvents();
    updateEvents();
}

async function fetchUserInfo() {
    try {
        let response = await apis.user.info();
        if (response.code != 1) {
            alert("not login yet");
            apis.confirmRedirect.login();
            return;
        }
        let user = response.data;
        let username = user.username;
        let iconTypes = [
            "adventurer-neutral",
            "big-ears-neutral",
            "initials",
            "jdenticon",
            "miniavs",
            "pixel-art-neutral",
        ];
        let index = Math.floor(Math.random() * iconTypes.length);
        let iconSrc = `https://avatars.dicebear.com/api/${iconTypes[index]}/${username}.svg`;
        document.getElementById("user-icon").src = iconSrc;
    } catch (err) {
        // ignore
        // maybe server down or network error
    }
}

function checkCache() {
    // remove cache if expired
    const LOCALSTORAGE_NAME = getCacheEventsExpireName();
    let cacheExpireAt = parseInt(localStorage.getItem(LOCALSTORAGE_NAME));
    if (!cacheExpireAt) {
        localStorage.setItem(LOCALSTORAGE_NAME, Date.now());
    }
    if (Date.now() > cacheExpireAt) {
        localStorage.clear();
        let delta = 7 * 24 * 60 * 60 * 1000; // 7 ngày
        localStorage.setItem(LOCALSTORAGE_NAME, Date.now() + delta);
    }
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
        const dateUtils = DateUtils.getInstance();
        selectingElement = e.target;
        let date = new Date(parseInt(selectingElement.getAttribute("data-date")));
        let now = new Date();
        date.setHours(now.getHours());
        date.setMinutes(now.getMinutes());
        date.setSeconds(now.getSeconds());
        modalStartTime.value = dateUtils.fullDateToInputDatetimeLocalValue(date);
        date.setHours(date.getHours() + 1);
        modalEndTime.value = dateUtils.fullDateToInputDatetimeLocalValue(date);
        modalElement.showModal();
    },
};

async function main() {
    updateMiniCalendar();
    updateMainCalendar();
    mainOpts.skipClickHandler = true; // after first time add event handler then skip it
    apis.notification.request().then(() => apis.push.sub.update());

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
            updateEvents();
        }
    };

    closeModalButton.onclick = () => modalElement.close();

    updateDetailsButton.onclick = async () => {
        let updateDetails = {
            _id: selectingElement.getAttribute("data-eventId"),
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
        selectingElement.setAttribute("data-eventId", updateDetails._id);
        selectingElement.setAttribute("data-title", updateDetails.title);
        selectingElement.setAttribute("data-description", updateDetails.description);
        selectingElement.setAttribute("data-startTime", updateDetails.startTime);
        selectingElement.setAttribute("data-endTime", updateDetails.endTime);
        selectingElement.setAttribute("data-location", updateDetails.location);
        selectingElement.innerText = updateDetails.title;
        updateEvents();
    };

    deleteDetailsButton.onclick = async () => {
        let eventId = selectingElement.getAttribute("data-eventId");
        let response = await apis.event.delete({ _id: eventId });
        if (response.code != 1) {
            alert("deleted failed");
            return;
        }
        if (response.data.count != 1) {
            alert("deleted failed");
            return;
        }
        updateEvents();
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
    checkCache();
    fetchCacheEvents();
    updateEvents();
}

main();
