const { LOGGER } = require("./logger");
const { UserValidations, EventValidations } = require("./validations");
const { ResponseEntity } = require("./entities");
const { UserController, EventController, PushApiController } = require("./controllers");
const { ValidationError } = require("./exceptions");
const { AppConfig } = require("./configs");
const { serverUtils } = require("./utils");

function userController() {
    return UserController.getInstance();
}

function userValidations() {
    return UserValidations.getInstance();
}

function eventController() {
    return EventController.getInstance();
}

function eventvalidations() {
    return EventValidations.getInstance();
}

function pushApiController() {
    return PushApiController.getInstance();
}

async function register(req, resp) {
    let user = req.body;
    userValidations().checkUser(user);
    let result = await userController().register(user);
    serverUtils.sendResponse(resp, 1, "success", result);
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
    serverUtils.sendResponse(resp, 1, "success", result);
}

async function deleteUser(req, resp) {
    let user = req.body;
    let token = req.cookies.access_token;
    let _user = await userController().checkToken(token);
    user.username = _user.username;
    let result = await userController().delete(user);
    serverUtils.sendResponse(resp, 1, "success", result);
}

async function findUserById(req, resp) {
    let id = req.params.id;
    let user = await userController().findById(id);
    delete user.password;
    serverUtils.sendResponse(resp, 1, "success", user);
}

async function getUserInfo(req, resp) {
    let token = req.cookies.access_token;
    let user = await userController().checkToken(token);
    delete user.password;
    serverUtils.sendResponse(resp, 1, "success", user);
}

async function findEvent(req, resp) {
    let token = req.cookies.access_token;
    let user = await userController().checkToken(token);
    let filter = JSON.parse(req.query.filter);
    filter.username = user.username;
    let result = await eventController().find(filter);
    serverUtils.sendResponse(resp, 1, "success", result);
}

async function addEvent(req, resp) {
    let token = req.cookies.access_token;
    let user = await userController().checkToken(token);
    let event = req.body;
    event.username = user.username;
    eventvalidations().checkEvent(event);
    let result = await eventController().insert(event);
    serverUtils.sendResponse(resp, 1, "success", result);
}

async function updateEvent(req, resp) {
    let token = req.cookies.access_token;
    let user = await userController().checkToken(token);
    let event = req.body;
    event.username = user.username;
    eventvalidations().checkEvent(event);
    let result = await eventController().update(event);
    serverUtils.sendResponse(resp, 1, "received", result);
}

async function deleteEvent(req, resp) {
    let token = req.cookies.access_token;
    let eventId = req.query.eventId;
    let user = await userController().checkToken(token);
    let username = user.username;
    let result = await eventController().delete({ _id: eventId, username: username });
    serverUtils.sendResponse(resp, 1, "received", result);
}

function getCacheUrls(req, resp) {
    resp.setHeader("Content-Type", "application/json; charset=utf-8");
    resp.send(AppConfig.cacheUrls);
}

async function subcribePushNotification(req, resp) {
    let token = req.cookies.access_token;
    let pushSubObject = req.body;
    let user = await userController().checkToken(token);
    let result = await pushApiController().subscribe(user, pushSubObject);
    serverUtils.sendResponse(resp, 1, "received", result);
}

function getPushPubKey(req, resp) {
    resp.send(AppConfig.pushApiKeyPair.publicKey);
}

const apis = {
    register: serverUtils.wrapExpressHandler(register),
    login: serverUtils.wrapExpressHandler(login),
    getCacheUrls: serverUtils.wrapExpressHandler(getCacheUrls),
    user: {
        update: serverUtils.wrapExpressHandler(updateUser),
        delete: serverUtils.wrapExpressHandler(deleteUser),
        findById: serverUtils.wrapExpressHandler(findUserById),
        info: serverUtils.wrapExpressHandler(getUserInfo),
    },
    event: {
        find: serverUtils.wrapExpressHandler(findEvent),
        add: serverUtils.wrapExpressHandler(addEvent),
        update: serverUtils.wrapExpressHandler(updateEvent),
        delete: serverUtils.wrapExpressHandler(deleteEvent),
    },
    push: {
        subscribe: serverUtils.wrapExpressHandler(subcribePushNotification),
        getPubKey: serverUtils.wrapExpressHandler(getPushPubKey),
    },
};

module.exports = {
    apis: apis,
};
