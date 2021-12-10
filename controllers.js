const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const { MongoDBClient } = require("./database");
const { AppConfig } = require("./configs");
const { ValidationError } = require("./exceptions");

/*
trước khi vào controller thì tầng apis.js phải qua các validates.js
 */
class UserController {
    static INSTANCE = new UserController();
    static getInstance() {
        return this.INSTANCE;
    }
    collection() {
        const client = MongoDBClient.getInstance();
        const collection = client.db("calendar").collection("user");
        return collection;
    }
    async register({ username, password }) {
        let user = await this.collection().findOne({ username: username });
        if (user) throw new ValidationError("user existed");
        //hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const newUser = { username: username, password: hashedPassword };
        let insertResult = await this.collection().insertOne(newUser);
        return { userId: insertResult.insertedId };
    }
    async login({ username, password }) {
        let user = await this.collection().findOne({ username: username });
        if (!user) throw new ValidationError("user not exist");
        const validPass = await bcrypt.compare(password, user.password);
        if (!validPass) throw new ValidationError("wrong password");
        //create token
        const token = jwt.sign({ _id: user._id }, AppConfig.tokenSecret, { expiresIn: "24h" });
        return token;
    }
    async update({ username, password }) {
        let user = await this.collection().findOne({ username: username });
        if (!user) throw new ValidationError("user not exist");
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        let updatedUser = await this.collection().updateOne(
            { username: username },
            { $set: { password: hashedPassword } },
        );
        return { userId: updatedUser.upsertedId };
    }
    async delete({ username }) {
        let user = await this.collection().findOne({ username: username });
        if (!user) throw new ValidationError("user not exist");
        let deleted = await this.collection().deleteOne({ username: username });
        return deleted.deletedCount;
    }
    async findById(id) {
        let user = await this.collection().findOne({ _id: id });
        if (!user) throw new ValidationError("user not exist");
        return user;
    }
}

class EventController {
    static INSTANCE = new EventController();
    static getInstance() {
        return this.INSTANCE;
    }
}

module.exports = {
    UserController: UserController,
    EventController: EventController,
};
