const cors = require("cors");
const http = require("http");
const https = require("https");
const express = require("express");
const cookieParser = require("cookie-parser");

const { apis } = require("./apis");
const { AppConfig } = require("./configs");
const { MongoDBClient } = require("./database/MongoDBClient");

async function main() {
    const server = express();
    server.use(express.json());
    server.use(express.static("./webapp"));
    server.use(cookieParser());

    if (AppConfig.security.cors) {
        server.use(cors());
    }

    server.post("/auth/login", apis.login);
    server.post("/auth/register", apis.register);
    server.put("/auth/user", apis.updateUser);
    server.delete("/auth/user", apis.deleteUser);
    server.get("/auth/user", apis.findUserById);

    await MongoDBClient.init(AppConfig.database.connection_string);
    console.log(" * database: " + AppConfig.database.connection_string);
    let port = parseInt(process.env.PORT) || AppConfig.listen_port;
    if (AppConfig.security.ssl) {
        const key = fs.readFileSync(AppConfig.security.key_file);
        const cert = fs.readFileSync(AppConfig.security.cert_file);
        https.createServer({ key, cert }, server).listen(port, AppConfig.bind);
    } else {
        http.createServer(server).listen(port, AppConfig.bind);
    }
    console.log(` * listen: ${port} (${AppConfig.security.ssl ? "https" : "http"})`);
}

main();
