const { MongoDBClient } = require("../database/MongoDBClient");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { AppUser } = require("../models/AppUser");
const { AppConfig } = require("../configs");

/*
trước khi vào controller thì tầng apis.js phải qua các validates.js
 */
class AppUserController {
    static getInstance() {
        return instance;
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
    update(user) {
        //TODO
        // update phải check tồn tại sau đó mới update
    }
    delete(user) {
        //TODO
        //
    }
    findById(id) {
        //TODO
    }
}
const instance = new AppUserController();

module.exports = {
    AppUserController: AppUserController,
};
