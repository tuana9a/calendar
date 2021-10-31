const fs = require("fs");

let hardCodeConfig = {
    app_config_path: "resource/app-config.json",
    register_preview_config_path: "resource/register-preview-config.json",
    automation_config: "resource/automation-config.json",
    screenshot_captcha_path: "resource/temp.png",
};
const HardCodeConfig = hardCodeConfig;
module.exports.HardCodeConfig = hardCodeConfig;

let appConfig = {
    bind: "127.0.0.1",
    listen_port: 80,
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
};
appConfig = JSON.parse(fs.readFileSync(HardCodeConfig.app_config_path, { flag: "r", encoding: "utf-8" }));
module.exports.AppConfig = appConfig;
