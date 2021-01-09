
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
var wsClients={};
class UserMessageApplication{
  constructor(server){
    const expressWs = require('express-ws')(server);
    //init websocket
    wsClients={};
    server.ws('/', (ws, req) => {
      ws.on("message", function (message) {
        // console.log("socketconnections = " + JSON.stringify(wsClients));
        let msg = JSON.parse(message);
        if (msg.header == "init") {
          if(msg.body){
            wsClients[msg.body.email] = ws;
          }else{
            console.log("error in user")
          }
        } else if (msg.header == "userMsg") {
          if(wsClients){
            if(wsClients[msg.body.recipient.email]){
              wsClients[msg.body.recipient.email].send(JSON.stringify(msg));
            }
            else{
              wsClients[msg.body.sender.email].send({
                header: "userMsg", body: {
                  body: "User offline", date: new Date(),
                  language: user.preferred_language,
                  sender: msg.body.sender,
                  recipient: msg.body.sender
                }});
            }
          }
        }
      });
    });
    //setup websocket connection
  }
}

module.exports={UserMessageApplication};