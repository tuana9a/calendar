const { mongodbClient } = require("../database/MongoDBClient");
const { Test } = require("../models/Test");

class TestController {
    async insert(test = new Test()) {
        let insertResult = await mongodbClient.getClient().db("test").collection("test").insertOne(test);
        return insertResult.insertedId;
    }
}
const testController = new TestController();

module.exports = {
    testController: testController,
};
