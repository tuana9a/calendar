const fs = require("fs");

let appconfig = {
    bind: "127.0.0.1",
    port: 80,
    log: {
        enabled: true,
        destination: "cs",
    },
    security: {
        cors: false,
        ssl: false,
        secret: "",
        cert_file: "",
        key_file: "",
    },
    database: {
        connection_string: "",
        read_limit: 1,
        batch_size: 1,
    },
    tokenSecret: "",
    pushApiEmail: "",
    pushApiKeyPair: {
        publicKey: "",
        privateKey: "",
    },
    cacheUrls: [],
};
appconfig = JSON.parse(fs.readFileSync("resource/app.conf.json", { flag: "r", encoding: "utf-8" }));
const AppConfig = appconfig;

module.exports = {
    AppConfig: AppConfig,
};
