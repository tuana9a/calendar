const { MongoClient } = require("mongodb");

class MongoDBClient {
    static async init(connectionString) {
        this.mongoClient = new MongoClient(connectionString);
        return this.mongoClient.connect();
    }
    static getInstance() {
        return this.mongoClient;
    }
}

module.exports = {
    MongoDBClient: MongoDBClient,
};
