const { MongoClient } = require("mongodb");

class MongoDBClient {
    static async init(connectionString = "") {
        this.mongoClient = new MongoClient(connectionString);
        await this.mongoClient.connect();
        return this.mongoClient;
    }
    static getInstance() {
        return this.mongoClient;
    }
}

module.exports = {
    MongoDBClient: MongoDBClient,
};
