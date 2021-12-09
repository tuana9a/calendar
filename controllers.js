const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const { MongoDBClient } = require("./database");
const { AppConfig } = require("./configs");

/*
trước khi vào controller thì tầng apis.js phải qua các validates.js
 */
class AppUserController {
    static INSTANCE = new AppUserController();
    static getInstance() {
        return this.INSTANCE;
    }
    async register({ username, password }) {
        let user = await MongoDBClient.getInstance().db("calendar").collection("user").findOne({ username: username });
        if (user) return "user existed";
        //hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const newUser = {
            username,
            password: hashedPassword,
        };
        let insertResult = await MongoDBClient.getInstance().db("calendar").collection("user").insertOne(newUser);
        return { userId: insertResult.insertedId };
    }
    async login({ username, password }) {
        let user = await MongoDBClient.getInstance().db("calendar").collection("user").findOne({ username: username });
        if (!user) return "user not exist";
        const validPass = await bcrypt.compare(password, user.password);
        if (!validPass) return "wrong password";
        //Create token
        return { accessToken: jwt.sign({ _id: user._id }, AppConfig.tokenSecret, { expiresIn: "24h" }) };
    }
    async update({ username, password }) {
        let user = await MongoDBClient.getInstance().db("calendar").collection("user").findOne({ username: username });
        if (!user) return "user not exist";
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        let updatedUser = await collection.updateOne({ username: username }, { $set: { password: hashedPassword } });
        return { userId: updatedUser.upsertedId };
    }
    async delete({ username }) {
        let user = await MongoDBClient.getInstance().db("calendar").collection("user").findOne({ username: username });
        if (!user) return "user not exist";
        let deleted = await collection.deleteOne({ username: username });
        return user._id;
    }
    async findById(id) {
        let user = await MongoDBClient.getInstance().db("calendar").collection("user").findOne({ _id: id });
        if (!user) return "user not exist";
        return user;
    }
}

class UserEventController {
    static INSTANCE = new UserEventController();
    static getInstance() {
        return this.INSTANCE;
    }
}

module.exports = {
    AppUserController: AppUserController,
    UserEventController: UserEventController,
};
