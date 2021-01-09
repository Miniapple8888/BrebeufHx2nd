
//message object
class userMessage {
  constructor(body, date, language, sender, recipient) {
    this.body = body;
    this.date = date;
    this.language = language;
    this.sender = sender;
    this.recipient = recipient;
  }
}

class serverMsg {
  constructor(header, body) {
    //header is a tag declaring what the message will be
    this.header = header;
    //body whatever you want
    this.body = body;
  }
}

/*
//-----------------------------------
//   client code, put in webpage
//-----------------------------------

let user
const ws = new WebSocket('ws://' + window.location.host);
//connection init
ws.on("open", function () {
  ws.send({ header: "init", body: user });
});
ws.on("message", function (message) {
  let msg = JSON.parse(message);
  if (msg.header == "initUser") {
    user = msg.body;
  } else if (msg.header == "userMsg") {
    console.log(msg.body);
  }
});
*/

//---------------------------
//           server
//---------------------------
class UserMessageApplication{
  constructor(server){
    const expressWs = require('express-ws')(server);
    //init websocket
    this.wsClients={};
    server.ws('/', (ws, req) => {
      ws.on("message", function (message) {
        let msg = JSON.parse(message);
        if (msg.header == "init") {
          this.wsClients[msg.body.email] = ws;
        } else if (msg.header == "userMsg") {
          console.log(message);
          this.wsClients[msg.body.recipient.email].send(message);
        }
      });
    });
    //setup websocket connection
  }
}

module.exports={UserMessageApplication};