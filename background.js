const webPush = require("web-push");
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
            TTL: 60,
        };

        webPush.sendNotification(eventSub.subObject, payload, options);
    }
}

async function repeatWork() {
    await fetchEventsToSendPushNotification();
    setTimeout(repeatWork, 15_000);
}

async function main() {
    await MongoDBClient.init(AppConfig.database.connection_string);
    repeatWork();
}

main();
