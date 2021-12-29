const { ValidationError } = require("./exceptions");

class UserValidations {
    static INSTANCE = new UserValidations();
    static getInstance() {
        return this.INSTANCE;
    }
    checkUser(entry) {
        if (!entry) throw new ValidationError("invalid user");
        if (!entry.username) throw new ValidationError("invalid username");
        if (!entry.password) throw new ValidationError("invalid username");
        if (entry.username.length < 3) throw new ValidationError("username to short");
        if (entry.password.length < 3) throw new ValidationError("password to short");
    }
}

class EventValidations {
    static INSTANCE = new EventValidations();
    static getInstance() {
        return this.INSTANCE;
    }
    checkEvent(entry) {
        if (!entry) throw new ValidationError("invalid event");
        if (!entry.title) throw new ValidationError("invalid title");
        if (entry.title.length < 2) throw new ValidationError("title to short");
        if (Number.isNaN(entry.startTime)) throw new ValidationError("startTime is not a number");
        if (Number.isNaN(entry.endTime)) throw new ValidationError("endTime is not a number");
        if (entry.endTime < entry.startTime) throw new ValidationError("endTime is smaller than startTime");
    }
}

module.exports = {
    UserValidations: UserValidations,
    EventValidations: EventValidations,
};
