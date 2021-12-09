const cors = require("cors");
const http = require("http");
const https = require("https");
const express = require("express");
const cookieParser = require("cookie-parser");

const { apis } = require("./apis");
const { AppConfig } = require("./configs");
const { MongoDBClient } = require("./database");

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
    server.get("/api/user", apis.findUserById);
    server.put("/api/user", apis.updateUser);
    server.delete("/api/user", apis.deleteUser);

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
