const { MongoDBClient } = require("../database/MongoDBClient");
const { Test } = require("../models/Test");

class TestController {
    static getInstance() {
        return instance;
    }

    async insert(test = new Test()) {
        let insertResult = await MongoDBClient.getInstance().db("test").collection("test").insertOne(test);
        return insertResult.insertedId;
    }
}
const instance = new TestController();

module.exports = {
    TestController: TestController,
};
