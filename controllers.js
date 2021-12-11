const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const mongodb = require("mongodb");

const { MongoDBClient } = require("./database");
const { AppConfig } = require("./configs");
const { ValidationError } = require("./exceptions");
const { UserEvent } = require("./entities");

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
    async checkToken(token) {
        if (!token) throw new ValidationError("Access denied");

        const verified = jwt.verify(token, AppConfig.tokenSecret);
        const _id = new mongodb.ObjectId(verified._id);

        let user = await this.collection().findOne({ _id: _id });
        if (!user) throw new ValidationError("User not found");

        return user;
    }
}

class EventController {
    static INSTANCE = new EventController();
    static getInstance() {
        return this.INSTANCE;
    }
    collection() {
        const client = MongoDBClient.getInstance();
        const collection = client.db("calendar").collection("event");
        return collection;
    }
    async find(filter) {
        let result = await this.collection().find(filter).toArray();
        return result;
    }
    async insert(event = new UserEvent()) {
        let insertResult = await this.collection().insertOne(event);
        return { eventId: insertResult.insertedId };
    }
    async update(userEvent = new UserEvent()) {
        let eventId = new mongodb.ObjectId(userEvent._id);
        let username = userEvent.username;
        let updatedUser = await this.collection().updateOne(
            { _id: eventId, username: username },
            {
                $set: {
                    title: userEvent.title,
                    date: userEvent.date,
                    startTime: userEvent.startTime,
                    endTime: userEvent.endTime,
                    description: userEvent.description,
                    location: userEvent.location,
                },
            },
        );
        return { userId: updatedUser.upsertedId };
    }
    async delete(userEvent = new UserEvent()) {
        let eventId = new mongodb.ObjectId(userEvent._id);
        let username = userEvent.username;
        let deleteResult = await this.collection().deleteOne({ _id: eventId, username: username });
        return { count: deleteResult.deletedCount };
    }
}

module.exports = {
    UserController: UserController,
    EventController: EventController,
};
