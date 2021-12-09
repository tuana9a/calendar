const { LOGGER } = require("./logger");
const { UserValidations, TokenValidations } = require("./validations");
const { ResponseEntity } = require("./entities");
const { AppUserController } = require("./controllers");
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

//authentication
async function register(req, resp) {
    let data = req.body;
    const validations = UserValidations.getInstance();
    const controller = AppUserController.getInstance();

    validations.checkUser(data);
    let result = await controller.register(data);

    resp.setHeader("Content-Type", "application/json; charset=utf-8");
    resp.send(ResponseEntity.builder().code(1).message("success").data(result).build());
}

async function login(req, resp) {
    let user = req.body;
    const validations = UserValidations.getInstance();
    const controller = AppUserController.getInstance();

    validations.checkUser(user);
    let accessToken = await controller.login(user);

    resp.setHeader("Content-Type", "application/json; charset=utf-8");
    resp.cookie("access_token", accessToken).send(ResponseEntity.builder().code(1).message("success").data().build());
}

async function updateUser(req, resp) {
    let user = req.body;
    let token = req.cookies.access_token;
    const userValidations = UserValidations.getInstance();
    const tokenValidations = TokenValidations.getInstance();
    const controller = AppUserController.getInstance();

    let _user = await tokenValidations.checkToken(token);
    user.username = _user.username;
    userValidations.checkUser(user);
    let result = await controller.update(user);

    resp.setHeader("Content-Type", "application/json; charset=utf-8");
    resp.send(ResponseEntity.builder().code(1).message("success").data(result).build());
}

async function deleteUser(req, resp) {
    let user = req.body;
    let token = req.cookies.access_token;
    const controller = AppUserController.getInstance();
    const tokenValidations = TokenValidations.getInstance();

    let _user = await tokenValidations.checkToken(token);
    user.username = _user.username;
    let result = await controller.delete(user);

    resp.setHeader("Content-Type", "application/json; charset=utf-8");
    resp.send(ResponseEntity.builder().code(1).message("success").data(result).build());
}

async function findUserById(req, resp) {
    let id = req.query.userId;
    const controller = AppUserController.getInstance();
    let result = await controller.findById(id);
    resp.setHeader("Content-Type", "application/json; charset=utf-8");
    resp.send(ResponseEntity.builder().code(1).message("success").data(result).build());
}

const apis = {
    register: wrapExpressHandler(register),
    login: wrapExpressHandler(login),
    updateUser: wrapExpressHandler(updateUser),
    deleteUser: wrapExpressHandler(deleteUser),
    findUserById: wrapExpressHandler(findUserById),
};

module.exports = {
    apis: apis,
};
