const express = require("express");
const bodyParser = require("body-parser");
const IORedis = require("ioredis");
const { Queue, Worker } = require("bullmq");
const PORT = process.env.PORT || 3000;
const db = require("./models");
let path = require("path");
let conf_file = path.join(__dirname, "./config/dbConfig.js");
let config = require(conf_file);
const app = express();
const dotenv = require("dotenv");

app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
let routes = require("./routes");
app.use("/api/v1/appointment", routes.appointment);
const HOST = config.HOST;
app.listen(PORT, HOST, () => {
  console.log(
    `Job Lo backend server is running on port http://${HOST}:${PORT}`
  );
});
