const fs = require("fs");

let config = {
    bind: "127.0.0.1",
    listen_port: 80,
    log_enabled: true,
    log_destination: "cs",
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
};
config = JSON.parse(fs.readFileSync("resource/app.conf.json", { flag: "r", encoding: "utf-8" }));
const AppConfig = config;

module.exports = {
    AppConfig: AppConfig,
};
