//inlude stuff
//npm install jsdom jquery ws
var Websocket = require("ws");


//message object
class userMessage {
  //have sender + recipient be the same to initiate websocket
  constructor(header, body, date, language, sender, recipient) {
    this.header = header;
    this.body = body;
    this.date = date;
    this.language = language;
    this.sender = sender;
    this.recipient = recipient;
  }
}

class serverMsg {
  constructor(header, body) {
    this.header = header;
    this.body = body;
  }
}

class User {
  //int or str id
  //client for websocket
}
let userList = [];

/*
//-----------------------------------
//      client code, put in webpage
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
//      server
//---------------------------

class UserMessageApplication{
  constructor(server,userList){
    //init websocket
    this.wsServer = new Websocket.Server({
      server:server
    });
    this.userList=userList;
    //setup websocket connection
    wsServer.on("connection", function (ws) {
      ws.on("message", function (message) {
        let msg = JSON.parse(message);
        if (msg.header == "init") {
          userList[msg.body.id].client = ws;
          ws.send({ header: "wsInitUser", body: userList[msg.body.id] });
        } else if(msg.header=="userMsg") {
          for (let usr in userList) {
            if (msg.body.recipient.id == usr.id) {
              usr.client.send(message);
            }
          }
        }
      });
    });
  }
  updateUserList(userList){
    this.userList=userList;
  }
}

module.exports={UserMessageApplication};