"use strict";

const line = require("@line/bot-sdk");
const express = require("express");
const config = require("./config.json");
const res = require("express/lib/response");
const mongoose = require("mongoose");
const cors = require("cors");
const BodyParser = require("body-parser");
global.Task = require("./modules/taskmodules");
const routes = require("./routes/taskroutes");

mongoose
  .connect("mongodb://localhost/mydatabase", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB Connected..."))
  .catch((err) => console.log(err));

// create LINE SDK client
const client = new line.Client(config);

const app = express();

app.use(cors());
app.use(BodyParser.urlencoded({ extended: true }));
app.use(BodyParser.json());
routes(app);

// webhook callback
app.post("/webhook", line.middleware(config), (req, res) => {
  // req.body.events should be an array of events
  if (!Array.isArray(req.body.events)) {
    return res.status(500).end();
  }
  // handle events separately
  Promise.all(
    req.body.events.map((event) => {
      console.log("event", event);
      // check verify webhook event
      if (
        event.replyToken === "00000000000000000000000000000000" ||
        event.replyToken === "ffffffffffffffffffffffffffffffff"
      ) {
        return;
      }
      return handleEvent(event);
    })
  )
    .then(() => res.end())
    .catch((err) => {
      console.error(err);
      res.status(500).end();
    });
});

// simple reply function
const replyText = (token, texts) => {
  texts = Array.isArray(texts) ? texts : [texts];
  return client.replyMessage(
    token,
    texts.map((text) => ({ type: "text", text }))
  );
};

// callback function to handle a single event
function handleEvent(event) {
  switch (event.type) {
    case "message":
      const message = event.message;
      switch (message.type) {
        case "text":
          return handleText(message, event.replyToken);
        case "image":
          return handleImage(message, event.replyToken);
        case "video":
          return handleVideo(message, event.replyToken);
        case "audio":
          return handleAudio(message, event.replyToken);
        case "location":
          return handleLocation(message, event.replyToken);
        case "sticker":
          return handleSticker(message, event.replyToken);
        default:
          throw new Error(`Unknown message: ${JSON.stringify(message)}`);
      }

    case "follow":
      return replyText(event.replyToken, "Got followed event");

    case "unfollow":
      return console.log(`Unfollowed this bot: ${JSON.stringify(event)}`);

    case "join":
      return replyText(event.replyToken, `Joined ${event.source.type}`);

    case "leave":
      return console.log(`Left: ${JSON.stringify(event)}`);

    case "postback":
      let data = event.postback.data;
      return replyText(event.replyToken, `Got postback: ${data}`);

    case "beacon":
      const dm = `${Buffer.from(event.beacon.dm || "", "hex").toString(
        "ascii"
      )}`;
      const department = config.department[event.beacon.hwid];

      return replyText(
        event.replyToken,
        `${event.beacon.type} beacon hwid : ${department} `
      ); //with device message = ${dm}

    default:
      throw new Error(`Unknown event: ${JSON.stringify(event)}`);
  }
}

function handleText(message, replyToken) {
  return replyText(replyToken, message.text);
}

function handleImage(_message, replyToken) {
  return replyText(replyToken, "Got Image");
}

function handleVideo(_message, replyToken) {
  return replyText(replyToken, "Got Video");
}

function handleAudio(_message, replyToken) {
  return replyText(replyToken, "Got Audio");
}

function handleLocation(_message, replyToken) {
  return replyText(replyToken, "Got Location");
}

function handleSticker(_message, replyToken) {
  return replyText(replyToken, "Got Sticker");
}

const port = config.port;
app.listen(port, () => {
  console.log(`listening on ${port}`);
});
