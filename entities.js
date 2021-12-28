/*
hiện tại mình làm chức năng người dùng đơn giản
sau này rảnh có thể làm đăng nhập với google
*/
class User {
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

class UserEvent {
    title;
    startTime;
    endTime;
    description;
    username;
    location;
    dismiss; // boolean, người dùng click dismiss thì không không báo nữa
}

module.exports = {
    User: User,
    UserEvent: UserEvent,
    LogOption: LogOption,
    ResponseEntity: ResponseEntity,
};
