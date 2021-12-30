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
      dbsql.query(
        `SELECT * FROM hardwereid where ID = '${event.beacon.hwid}'`,
        function (err, data) {
          console.log("data", data);
          replyText(
            event.replyToken,
            `${event.beacon.type} beacon hwid : ${data[0].nameHw}`
          );
        }
      );
      break;
    default:
      throw new Error(`Unknown event: ${JSON.stringify(event)}`);
  }
}
