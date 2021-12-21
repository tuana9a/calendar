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

var selectingDateId = null; //Lưu trữ giá trị id của sự kiện cần xóa

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
    eventElement.setAttribute("location", myEvent.location);
    let eventDisplayName = document.createTextNode(myEvent.title);
    eventElement.onclick = (e) => {
        // TODO: show details event
        // include update, delete
        console.log(e.target.getAttribute("startTime"));
        let startTimeDetail = dateUtils().fullDetailDate(e.target.getAttribute("startTime"));
        let endTimeDetail = dateUtils().fullDetailDate(e.target.getAttribute("endTime"));

        selectingDateId = myEvent._id; // Lưu id vào biến selectingDateId

        modalTitleDetail.value = e.target.getAttribute("title");
        modalStartTimeDetail.value = startTimeDetail;
        modalEndTimeDetail.value = endTimeDetail;
        modalDescriptionDetail.value = e.target.getAttribute("description");
        modalLocationDetail.value = e.target.getAttribute("location");
        modalDetails.showModal();   
        
    };
    eventElement.appendChild(eventDisplayName);
    dayElement.appendChild(eventElement);
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

    updateDetailsButton.onclick = async () => {
        //TODO Minh Tuấn
        // nhờ ông gửi request update details đến server
        let updateDetails = {
            title: modalTitleDetail.value,
            startTime: new Date(modalStartTimeDetail.value).getTime(),
            endTime: new Date(modalEndTimeDetail.value).getTime(),
            description: modalDescriptionDetail.value,
            location: modalLocationDetail.value,
            dismiss: false,
        };
        console.log("object", updateDetails);
    };

    deleteDetailsButton.onclick = async () => {
        document.querySelectorAll(`[_id="${selectingDateId}"]`).forEach(e => e.remove());
        //TODO Minh Tuấn
        // nhờ ông gửi request update details đến server
        //......................
        // server response thành công thì set biến idGlobal = null
    };

    closeDetailsButton.onclick = () => modalDetails.close();

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

    apis.user.info().then((resp) => {
        if (resp.code == 1) {
            let user = resp.data;
            let username = user.username;
            let iconTypes = ["adventurer-neutral", "big-ears-neutral", "initials"];
            let index = Math.floor(Math.random() * iconTypes.length);
            let iconSrc = `https://avatars.dicebear.com/api/${iconTypes[index]}/${username}.svg`;
            document.getElementById("user-icon").src = iconSrc;
        } else {
            alert("not login yet");
            window.location.href = "/login.html";
        }
    });

    let date = new Date();
    date.setDate(1);
    date.setHours(0);
    date.setMinutes(0);
    date.setSeconds(0);
    let rangeStart = date.getTime();
    date.setMonth(date.getMonth() + 1);
    let rangeEnd = date.getTime();

    apis.event.find({ startTime: { $gt: rangeStart, $lt: rangeEnd } }).then((resp) => {
        if (resp.code == 1) {
            let events = resp.data;
            console.log(events);
            // TODO: tạo một mảng lưu các index[] có thể dùng luôn ngày trong tháng làm index
            // sau đó loop các phần tử opts.events, lấy các ngày chứa event
            // sau đó lấy element từ chỉ mục và gọi hàm appendEvent :)
            let selector = "." + CLASSNAME_DAY + "." + CLASSNAME_MONTH;
            let dayElements = mainCalendarElement.querySelectorAll(selector);
            events.forEach((myEvent) => {
                let startDate = new Date(myEvent.startTime);
                let elementIndex = startDate.getDate() - 1; //seriously don't ask;
                let dayElement = dayElements.item(elementIndex);
                appendEvent(dayElement, myEvent);
            });
        }
    });
}

main();
