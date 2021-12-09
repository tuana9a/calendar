const { LOGGER } = require("./logger");
const { Validations } = require("./validations");
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

async function verifyToken(req, resp, next) {
    const token = req.cookies.access_token;
    const validations = Validations.getInstance();
    const user = await validations.checkToken(token); // return user if success or throw error if fail
    req.user = user; //add user to req to process in the next function
    next();
}

//authentication
async function register(req, resp) {
    let data = req.body;
    const validations = Validations.getInstance();
    const controller = AppUserController.getInstance();

    validations.checkAuthentication(data);
    let result = await controller.register(data);

    resp.setHeader("Content-Type", "application/json; charset=utf-8");
    resp.send(ResponseEntity.builder().code(1).message("success").data(result).build());
}

async function login(req, resp) {
    let data = req.body;
    const validations = Validations.getInstance();
    const controller = AppUserController.getInstance();
    validations.checkAuthentication(data);
    let accessToken = await controller.login(data);

    resp.setHeader("Content-Type", "application/json; charset=utf-8");
    resp.cookie("access_token", accessToken).send(ResponseEntity.builder().code(1).message("success").data().build());
}

async function updateUser(req, resp) {
    let data = req.body;
    const validations = Validations.getInstance();
    const controller = AppUserController.getInstance();

    validations.checkAuthentication(data);
    let result;
    const updateApi = async () => {
        result = await controller.update(data);
    };
    verifyToken(req, resp, updateApi);
    resp.setHeader("Content-Type", "application/json; charset=utf-8");
    resp.send(ResponseEntity.builder().code(1).message("success").data(result).build());
}

async function deleteUser(req, resp) {
    let data = req.body;
    let result;
    const controller = AppUserController.getInstance();
    const deleteApi = async () => {
        result = await controller.delete(data);
    };
    verifyToken(req, resp, deleteApi);
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
