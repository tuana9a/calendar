/*
hiện tại mình làm chức năng người dùng đơn giản
TODO: sau này rảnh có thể làm đăng nhập với google
*/
class AppUser {
    username;
    password;
}

class LogOption {
    type;
    data;
    collection;
}

class ResponseEntity {
    code = 0;
    message = null;
    data = null;

    static builder() {
        return new ResponseEntityBuilder();
    }
}

class ResponseEntityBuilder {
    object;
    constructor() {
        this.object = new ResponseEntity();
    }
    code(code) {
        this.object.code = code;
        return this;
    }
    message(message) {
        this.object.message = message;
        return this;
    }
    data(data) {
        this.object.data = data;
        return this;
    }
    build() {
        return this.object;
    }
}

/* 
startTime   thời gian bắt đầu theo milisecond
startDate   ngày bắt đầu (mục đích check trùng lặp)
finishTime  thời gian kết thúc
finishDate  ngày kết thúc (mục đích check trùng lặp)
duration    khoảng thời gian xảy ra sự kiện
title       tên event
contentHtml nội dung của content với html
repeat      lặp lại cái này khi submit sẽ được xử lý      
remind      lời nhắc
note        user có thể ghi note lại
finished    đã kết thúc, xong hay chưa
deleted     đã xóa hay chưa
userId      id của user

có thể nếu sau này rảnh có thể làm thêm cái location nữa
*/
class UserEvent {
    id;
    startTime;
    startDate;
    finishTime;
    finishDate;
    duration;
    title;
    contentHtml;
    repeat;
    remind;
    note;
    finished;
    deleted;
    userId;
}

module.exports = {
    AppUser: AppUser,
    UserEvent: UserEvent,
    LogOption: LogOption,
    ResponseEntity: ResponseEntity,
};
