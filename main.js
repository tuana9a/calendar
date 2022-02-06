const fs = require("fs");
const cors = require("cors");
const http = require("http");
const https = require("https");
const express = require("express");
const webPush = require("web-push");
const cookieParser = require("cookie-parser");

const { apis } = require("./apis");
const { AppConfig } = require("./configs");
const { MongoDBClient } = require("./database");
const { EventController, PushApiController } = require("./controllers");

async function fetchEventsToSendPushNotification() {
    const pushApiController = PushApiController.getInstance();
    const eventController = EventController.getInstance();
    let now = Date.now();
    let next15min = now + 15 * 60 * 1000; // 15min before event;

    const myEvents = await eventController
        .collection()
        .find({ dismiss: false, startTime: { $lt: next15min } })
        .sort({ startTime: 1 })
        .toArray();

    for (const myEvent of myEvents) {
        const eventSub = await pushApiController.findSubObjectByUserName(myEvent.username);
        // After notify then no auto dimiss
        myEvent.dismiss = true;
        eventController.update(myEvent);

        // user not have serviceWorker installed so skip this user
        if (!eventSub) continue;

        let vapidPublicKey = AppConfig.pushApiKeyPair.publicKey;
        let vapidPrivateKey = AppConfig.pushApiKeyPair.privateKey;

        let payload = JSON.stringify(myEvent);

        let options = {
            vapidDetails: {
                subject: "mailto:" + AppConfig.pushApiEmail,
                publicKey: vapidPublicKey,
                privateKey: vapidPrivateKey,
            },
        };

        webPush.sendNotification(eventSub.subObject, payload, options);
    }
}

async function repeatWork() {
    await fetchEventsToSendPushNotification();
    setTimeout(repeatWork, 15_000);
}

async function main() {
    const server = express();
    server.use(express.json());
    server.use(cookieParser());
    server.use(express.static("./webapp"));

    if (AppConfig.security.cors) {
        server.use(cors());
    }

    server.post("/login", apis.login);
    server.post("/register", apis.register);
    server.get("/api/user/:id", apis.user.findById);
    server.get("/api/user", apis.user.info);
    server.put("/api/user", apis.user.update);
    server.delete("/api/user", apis.user.delete);
    server.get("/api/event", apis.event.find);
    server.post("/api/event", apis.event.add);
    server.put("/api/event", apis.event.update);
    server.delete("/api/event", apis.event.delete);
    server.get("/caches.json", apis.getCacheUrls);
    server.get("/api/push/pub", apis.push.getPubKey);
    server.post("/api/push", apis.push.subscribe);

    await MongoDBClient.init(AppConfig.database.connection_string);
    console.log(" * database: " + AppConfig.database.connection_string);
    let port = parseInt(process.env.PORT) || AppConfig.port;
    if (AppConfig.security.ssl) {
        const key = fs.readFileSync(AppConfig.security.key_file);
        const cert = fs.readFileSync(AppConfig.security.cert_file);
        https.createServer({ key, cert }, server).listen(port, AppConfig.bind);
    } else {
        http.createServer(server).listen(port, AppConfig.bind);
    }
    console.log(` * listen: ${port} (${AppConfig.security.ssl ? "https" : "http"})`);
    repeatWork();
}

main();
