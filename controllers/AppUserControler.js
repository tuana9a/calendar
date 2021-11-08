const { MongoDBClient } = require("../database/MongoDBClient");

/*
trước khi vào controller thì tầng apis.js phải qua các validates.js
 */
class AppUserController {
    static getInstance() {
        return instance;
    }
    register(user) {
        //TODO
        // phải check đã tồn tại mới cho đăng ký, insert
    }
    login(user) {
        //TODO
        // login trả về cookie kèm jwt để cho việc xác thực
    }
    logout(user) {
        //TODO
        // logout invalidate jwt cho việc xác thực
    }
    update(user) {
        //TODO
        // update phải check tồn tại sau đó mới update
    }
    delete(user) {
        //TODO
        //
    }
    findById(id) {
        //TODO
    }
}
const instance = new AppUserController();

module.exports = {
    AppUserController: AppUserController,
};
