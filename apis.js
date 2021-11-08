const { LOGGER } = require("./logger");
const { validations } = require("./validations");
const { ResponseEntity } = require("./models/ResponseEntity");
const { TestController } = require("./controllers/TestController");
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

async function testGet(req, resp) {
    // VD: url = http://localhost/test/get?q=tuan&e=me
    // thì data = {q: "tuan", e: "me"};

    let data = {};
    for (let q in req.query) {
        data[q] = req.query[q];
    }

    resp.setHeader("Content-Type", "application/json; charset=utf-8");
    resp.send(ResponseEntity.builder().code(1).message("all query in your url is").data(data).build());
}

async function testPost(req, resp) {
    // VD: post với body là {name:"tuan"}
    // thì body = {name: "tuan"};
    // lưu ý với get thì không có body
    let body = req.body;

    let data = { body: body };

    resp.setHeader("Content-Type", "application/json; charset=utf-8");
    resp.send(ResponseEntity.builder().code(1).message("success").data(data).build());
}

async function insertTest(req, resp) {
    let test = req.body;

    validations.checkTest(test);
    let result = await TestController.getInstance().insert(test);

    resp.setHeader("Content-Type", "application/json; charset=utf-8");
    resp.send(ResponseEntity.builder().code(1).message("success").data(result).build());
}

const apis = {
    testGet: wrapExpressHandler(testGet),
    testPost: wrapExpressHandler(testPost),
    insertTest: wrapExpressHandler(insertTest),
};

module.exports = {
    apis: apis,
};
