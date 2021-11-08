class UserEventController {
    static getInstance() {
        return instance;
    }
    //TODO
}

const instance = new UserEventController();

module.exports = {
    UserEventController: UserEventController,
};
