const fs = require("fs");

let hardCodeConfig = {
    app_config_path: "resource/app.conf.json",
};
const HardCodeConfig = hardCodeConfig;

let appConfig = {
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
appConfig = JSON.parse(
    fs.readFileSync(HardCodeConfig.app_config_path, {
        flag: "r",
        encoding: "utf-8",
    }),
);
const AppConfig = appConfig;

module.exports = {
    HardCodeConfig: HardCodeConfig,
    AppConfig: AppConfig,
};
