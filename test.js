"use strict";
const line = require("@line/bot-sdk");
const express = require("express");
const config = require("./config.json");
const mysql = require("mysql");
const res = require("express/lib/response");
const fetch = require("node-fetch");
const http = require("http");
// create LINE SDK client
const client = new line.Client(config);
// MySql Database
const dbsql = mysql.createConnection({
  host: "192.168.99.9",
  user: "trainingground",
  password: "Training1234#@!",
  database: "db_test",
});
dbsql.connect();
const app = express();

app.get("/", (req, res) => {
  res.send("Home page");
});

app.get("/gethook", (req, res) => {
  const nDate = new Date().toLocaleString("en-US", {
    timeZone: "Asia/Bangkok",
  });

  console.log(nDate);
});

// webhook callback
app.post("/webhook", line.middleware(config), (req, res) => {
  let replyToken = req.body.events[0].replyToken;
  let eventsType = req.body.events[0].type;
  let eventsMode = req.body.events[0].mode;
  let timestamp = req.body.events[0].timestamp;
  let sourceType = req.body.events[0].source.type;
  let sourceUserid = req.body.events[0].source.userId;
  let beaconHwid = req.body.events[0].beacon.hwid;
  let beaconType = req.body.events[0].beacon.type;
  let date = new Date(timestamp);
  const testchack = req.rawHeaders[1];

  if (!testchack) {
    return res.status(404).send({ error: true, message: "NO data" });
  } else {
    let sql =
      "INSERT INTO events(`reply_token`, `events_type`,`events_mode`,`timestamp`,`source_type`,`source_userid`,`beacon_hwid`,`beacon_type`) VALUES (?,?,?,?,?,?,?,?)";
    if (
      !replyToken ||
      !eventsType ||
      !eventsMode ||
      !date ||
      !sourceType ||
      !sourceUserid ||
      !beaconHwid ||
      !beaconType
    ) {
      return res.status(500).send({ error: true, message: "NO data" });
    } else {
      dbsql.query(
        sql,
        [
          replyToken,
          eventsType,
          eventsMode,
          date,
          sourceType,
          sourceUserid,
          beaconHwid,
          beaconType,
        ],
        (error, results, _fields) => {
          if (error) throw error;
          // return res.send({error: false, data: results});
        }
      );
    }
  }

  // req.body.events should be an array of events
  if (!Array.isArray(req.body.events)) {
    return res.status(500).end();
  }
  // handle events separately
  Promise.all(
    req.body.events.map((event) => {
      return console.log("eventkkkk", event);
    })
  )
    .finally(() => {})
    .catch((err) => {
      console.error(err);
    });
});

const port = config.port;
app.listen(port, () => {
  console.log(`listening on ${port}`);
});
