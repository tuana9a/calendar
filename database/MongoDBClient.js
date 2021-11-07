const { MongoClient } = require("mongodb");

class MongoDBClient {
    async connect(connectionString = "") {
        this.mongoClient = new MongoClient(connectionString);
        await this.mongoClient.connect();
        return this.mongoClient;
    }
    getClient() {
        return this.mongoClient;
    }
}

const mongodbClient = new MongoDBClient();

module.exports = {
    mongodbClient: mongodbClient,
};
