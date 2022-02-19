const fs = require("fs");

const { AppConfig } = require("./configs");
const { LogOption } = require("./entities");
const { MongoDBClient } = require("./database");
const { dateTimeUtils } = require("./utils");

function fsLog(option = new LogOption()) {
    let now = new Date();
    let content = dateTimeUtils.getDate(now) + ` ${option.type} ` + option.data + "\n";
    let filepath = "logs/" + dateTimeUtils.getDate(now) + ".log";
    fs.appendFileSync(filepath, content);
}

function dbLog(option = new LogOption()) {
    let now = new Date();
    const client = MongoDBClient.getInstance();
    let record = {
        date: dateTimeUtils.getDate(now),
        time: dateTimeUtils.getTime(now),
        datetime: dateTimeUtils.getFull(now),
        type: option.type,
        data: option.data,
        _timestamp: now,
    };
    client.db("logs").collection(option.collection).insertOne(record);
}

function csLog(option = new LogOption()) {
    let now = new Date();
    let content = dateTimeUtils.getDate(now) + ` ${option.type} ` + option.data + "\n";
    console.log(content);
}

const _log = {
    fs: fsLog,
    db: dbLog,
    cs: csLog,
};

function log(option = new LogOption()) {
    if (AppConfig.log.enabled) {
        _log[AppConfig.log.destination](option);
    }
}

class Logger {
    info(data, collection = "general") {
        log({ type: "INFO", data, collection: collection });
    }
    warn(data, collection = "general") {
        log({ type: "WARN", data, collection: collection });
    }
    error(err = new Error(), collection = "general") {
        log({ type: "ERROR", data: err.stack, collection: collection });
    }
}

const LOGGER = new Logger();
module.exports = {
    LOGGER: LOGGER,
};
