const { MongoClient } = require("mongodb");

class MongoDBClient {
    mongoClient;
    async connect(connectionString = "") {
        this.mongoClient = new MongoClient(connectionString);
        await this.mongoClient.connect();
        return this.mongoClient;
    }
    getClient() {
        return this.mongoClient;
    }
}

module.exports.mongodbClient = new MongoDBClient();
