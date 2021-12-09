const { LOGGER } = require("./logger");
const { UserValidations, TokenValidations } = require("./validations");
const { ResponseEntity } = require("./entities");
const { UserController } = require("./controllers");
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

async function checkToken(req) {
    const validations = TokenValidations.getInstance();
    let user = await validations.checkToken(token); // throw error if fail, return user if success
    return user;
}

function userController() {
    return UserController.getInstance();
}

function userValidations() {
    return UserValidations.getInstance();
}

function tokenValidations() {
    return TokenValidations.getInstance();
}

//authentication
async function register(req, resp) {
    let data = req.body;

    userValidations().checkUser(data);
    let result = await userController().register(data);

    resp.setHeader("Content-Type", "application/json; charset=utf-8");
    resp.send(ResponseEntity.builder().code(1).message("success").data(result).build());
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

    let _user = await tokenValidations().checkToken(token);
    user.username = _user.username;
    userValidations().checkUser(user);
    let result = await userController().update(user);

    resp.setHeader("Content-Type", "application/json; charset=utf-8");
    resp.send(ResponseEntity.builder().code(1).message("success").data(result).build());
}

async function deleteUser(req, resp) {
    let user = req.body;
    let token = req.cookies.access_token;

    let _user = await tokenValidations().checkToken(token);
    user.username = _user.username;
    let result = await userController().delete(user);

    resp.setHeader("Content-Type", "application/json; charset=utf-8");
    resp.send(ResponseEntity.builder().code(1).message("success").data(result).build());
}

async function findUserById(req, resp) {
    let id = req.params.id;
    let user = await userController().findById(id);
    delete user.password;
    resp.setHeader("Content-Type", "application/json; charset=utf-8");
    resp.send(ResponseEntity.builder().code(1).message("success").data(user).build());
}

async function userInfo(req, resp) {
    let token = req.cookies.access_token;
    let user = await tokenValidations().checkToken(token);
    delete user.password;
    resp.setHeader("Content-Type", "application/json; charset=utf-8");
    resp.send(ResponseEntity.builder().code(1).message("success").data(user).build());
}

const apis = {
    register: wrapExpressHandler(register),
    login: wrapExpressHandler(login),
    updateUser: wrapExpressHandler(updateUser),
    deleteUser: wrapExpressHandler(deleteUser),
    findUserById: wrapExpressHandler(findUserById),
    userInfo: wrapExpressHandler(userInfo),
};

module.exports = {
    apis: apis,
};
