const { ValidationError } = require("./exceptions");
const { MongoDBClient } = require("./database");

class Validations {
    static INSTANCE = new Validations();
    static getInstance() {
        return this.INSTANCE;
    }
    checkAuthentication(entry) {
        if (entry?.username?.length < 1) throw new ValidationError("invalid username");
        if (entry?.password?.length < 1) throw new ValidationError("invalid password");
    }
    async checkToken(token) {
        if (!token) throw new ValidationError("Access denied");

        const verified = jwt.verify(token, AppConfig.tokenSecret);
        const uid = verified._id;
        const client = MongoDBClient.getInstance();
        let user = await client.db("calendar").collection("user").findById(uid);
        if (!user) throw new ValidationError("User not found");

        return user;
    }
}

module.exports = {
    Validations: Validations,
};
