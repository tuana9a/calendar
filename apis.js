const { LOGGER } = require("./logger");
const { validations } = require("./validations");
const { ResponseEntity } = require("./models/ResponseEntity");
const { TestController } = require("./controllers/TestController");
const { AppUserController } = require("./controllers/AppUserController");
const { ValidationError } = require("./exceptions");
const jwt = require("jsonwebtoken");
const { MongoDBClient } = require("../database/MongoDBClient");
require("dotenv").config();

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

const verifyToken = async (req, res, next) => {
  const token = req.header("access-token");
  if (!token) throw "Access denied";
  try {
    const verified = jwt.verify(token, process.env.TKN_SRC);

    const uid = verified._id;
    let user = {};
    try {
      user = await MongoDBClient.getInstance()
        .db("calendar")
        .collection("user")
        .findById(uid);
      if (!user) {
        throw "User not found";
      }
    } catch (error) {
      throw error?.message;
    }
    req.user = user; //add user to req to process in the next function
  } catch (error) {
    throw "Invalid token";
  }
  next();
};

// async function testGet(req, resp) {
//   // VD: url = http://localhost/test/get?q=tuan&e=me
//   // thì data = {q: "tuan", e: "me"};

//   let data = {};
//   for (let q in req.query) {
//     data[q] = req.query[q];
//   }

//   resp.setHeader("Content-Type", "application/json; charset=utf-8");
//   resp.send(
//     ResponseEntity.builder()
//       .code(1)
//       .message("all query in your url is")
//       .data(data)
//       .build()
//   );
// }

// async function testPost(req, resp) {
//   // VD: post với body là {name:"tuan"}
//   // thì body = {name: "tuan"};
//   // lưu ý với get thì không có body
//   let body = req.body;

//   let data = { body: body };

//   resp.setHeader("Content-Type", "application/json; charset=utf-8");
//   resp.send(
//     ResponseEntity.builder().code(1).message("success").data(data).build()
//   );
// }

// async function insertTest(req, resp) {
//   let test = req.body;

//   validations.checkTest(test);
//   let result = await TestController.getInstance().insert(test);

//   resp.setHeader("Content-Type", "application/json; charset=utf-8");
//   resp.send(
//     ResponseEntity.builder().code(1).message("success").data(result).build()
//   );
// }

//authentication
async function register(req, resp) {
  let data = req.body;
  validations.checkAuthentication(data);
  let result = await AppUserController.getInstance().register(data);

  resp.setHeader("Content-Type", "application/json; charset=utf-8");
  resp.send(
    ResponseEntity.builder().code(1).message("success").data(result).build()
  );
}

async function login(req, resp) {
  let data = req.body;
  validations.checkAuthentication(data);
  let result = await AppUserController.getInstance().login(data);

  resp.setHeader("Content-Type", "application/json; charset=utf-8");
  resp.send(
    ResponseEntity.builder().code(1).message("success").data(result).build()
  );
}

//with apis that need authentication
//ex:
// function needAuth(req, resp) {
//   const callApi = async () => {
//     //...
//   };
//   verifyToken(req, resp, callApi);
// }

const apis = {
  //   testGet: wrapExpressHandler(testGet),
  //   testPost: wrapExpressHandler(testPost),
  //   insertTest: wrapExpressHandler(insertTest),

  register: wrapExpressHandler(register),
  login: wrapExpressHandler(login),
};

module.exports = {
  apis: apis,
};
