const { LOGGER } = require("./logger");
const { UserValidations } = require("./validations");
const { ResponseEntity } = require("./entities");
const { UserController, EventController } = require("./controllers");
const { ValidationError } = require("./exceptions");

function wrapExpressHandler(handler = async () => {}) {
    return async function (req, resp) {
        try {
            await handler(req, resp);
        } catch (err) {
            resp.setHeader("Content-Type", "application/json; charset=utf-8");
            resp.send(ResponseEntity.builder().code(0).message(err.message).build());
            if (err instanceof ValidationError) {
                // do nothing safe catch :V
            } else {
                LOGGER.error(err);
            }
        } finally {
            //what ever error just end the connection
            resp.end();
        }
    };
}

function userController() {
    return UserController.getInstance();
}

function userValidations() {
    return UserValidations.getInstance();
}

function eventController() {
    return EventController.getInstance();
}

function sendResponse(resp, code = 1, message = "", data = {}) {
    resp.setHeader("Content-Type", "application/json; charset=utf-8");
    resp.send(ResponseEntity.builder().code(code).message(message).data(data).build());
}

async function register(req, resp) {
    let user = req.body;
    userValidations().checkUser(user);
    let result = await userController().register(user);
    sendResponse(resp, 1, "success", result);
}

async function login(req, resp) {
    let user = req.body;
    userValidations().checkUser(user);
    let accessToken = await userController().login(user);
    resp.setHeader("Content-Type", "application/json; charset=utf-8");
    resp.cookie("access_token", accessToken).send(ResponseEntity.builder().code(1).message("success").data().build());
}

async function updateUser(req, resp) {
    let user = req.body;
    let token = req.cookies.access_token;
    let _user = await userController().checkToken(token);
    user.username = _user.username;
    userValidations().checkUser(user);
    let result = await userController().update(user);
    sendResponse(resp, 1, "success", result);
}

async function deleteUser(req, resp) {
    let user = req.body;
    let token = req.cookies.access_token;
    let _user = await userController().checkToken(token);
    user.username = _user.username;
    let result = await userController().delete(user);
    sendResponse(resp, 1, "success", result);
}

async function findUserById(req, resp) {
    let id = req.params.id;
    let user = await userController().findById(id);
    delete user.password;
    sendResponse(resp, 1, "success", user);
}

async function getUserInfo(req, resp) {
    let token = req.cookies.access_token;
    let user = await userController().checkToken(token);
    delete user.password;
    sendResponse(resp, 1, "success", user);
}

async function findEvent(req, resp) {
    let token = req.cookies.access_token;
    let user = await userController().checkToken(token);
    let filter = JSON.parse(req.query.filter);
    filter.username = user.username;
    let result = await eventController().find(filter);
    sendResponse(resp, 1, "success", result);
}

async function addEvent(req, resp) {
    let token = req.cookies.access_token;
    let user = await userController().checkToken(token);
    let event = req.body;
    event.username = user.username;
    let result = await eventController().insert(event);
    sendResponse(resp, 1, "success", result);
}

async function updateEvent(req, resp) {
    let token = req.cookies.access_token;
    let user = await userController().checkToken(token);
    let event = req.body;
    event.username = user.username;
    let result = await eventController().update(event);
    sendResponse(resp, 1, "received", result);
}

async function deleteEvent(req, resp) {
    let eventId = req.query.eventId;
    let user = await userController().checkToken(token);
    let username = user.username;
    let result = await eventController().delete({ _id: eventId, username: username });
    sendResponse(resp, 1, "received", result);
}

const apis = {
    register: wrapExpressHandler(register),
    login: wrapExpressHandler(login),
    user: {
        update: wrapExpressHandler(updateUser),
        delete: wrapExpressHandler(deleteUser),
        findById: wrapExpressHandler(findUserById),
        info: wrapExpressHandler(getUserInfo),
    },
    event: {
        find: wrapExpressHandler(findEvent),
        add: wrapExpressHandler(addEvent),
        update: wrapExpressHandler(updateEvent),
        delete: wrapExpressHandler(deleteEvent),
    },
};

module.exports = {
    apis: apis,
};
