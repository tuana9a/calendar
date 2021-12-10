const jwt = require("jsonwebtoken");
const mongodb = require("mongodb");

const { ValidationError } = require("./exceptions");
const { MongoDBClient } = require("./database");
const { AppConfig } = require("./configs");

class UserValidations {
    static INSTANCE = new UserValidations();
    static getInstance() {
        return this.INSTANCE;
    }
    checkUser(user) {
        if (user?.username?.length < 1) throw new ValidationError("invalid username");
        if (user?.password?.length < 1) throw new ValidationError("invalid password");
    }
}

class TokenValidations {
    static INSTANCE = new TokenValidations();
    static getInstance() {
        return this.INSTANCE;
    }
    async checkToken(token) {
        if (!token) throw new ValidationError("Access denied");

        const verified = jwt.verify(token, AppConfig.tokenSecret);
        const _id = new mongodb.ObjectId(verified._id);
        const client = MongoDBClient.getInstance();

        let user = await client.db("calendar").collection("user").findOne({ _id: _id });
        if (!user) throw new ValidationError("User not found");

        return user;
    }
}

module.exports = {
    UserValidations: UserValidations,
    TokenValidations: TokenValidations,
};
