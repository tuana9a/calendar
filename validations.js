const { ValidationError } = require("./exceptions");

class UserValidations {
    static INSTANCE = new UserValidations();
    static getInstance() {
        return this.INSTANCE;
    }
    checkUser(user) {
        if (user?.username?.length < 1) throw new ValidationError("invalid username");
        if (user?.password?.length < 1) throw new ValidationError("invalid password");
    }
}

module.exports = {
    UserValidations: UserValidations,
};
