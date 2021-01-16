/*
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
*/

/*
//-----------------------------
//       client-side 
//-----------------------------
  var user;
  var recipient;
  window.WebSocket = window.WebSocket || window.MozWebSocket;
  var ws = new WebSocket('ws://' + window.location.host);
  //connection init
  ws.onopen = function () {
    axios.post("/users/profile", {}).then((response) => {
      user = response.data.user;
      if (user) {
        ws.send(JSON.stringify({ header: "init", body: user }));
      }
    });
    axios.post("/users/get_user", {
      user_email: sessionStorage.getItem("recipient")
    }).then((response) => {
      recipient = response.data.user;
    });
    //rename to actual text field
    var text = $("#input").val();
    ws.send(JSON.stringify({
      header: "userMsg", body:
        {
          body: text, date: new Date(),
          language: user.preferred_language,
          sender: user,
          recipient: recipient
        }
      }
      ));
    }
    ws.onmessage = function (message) {
      console.log(message.data);
      var msg=JSON.parse(message.data);
      if (msg.header =="userMsg"){
        alert("new message\n"+msg.body.body);
      }
    };
  };
*/

//-----------------------------
//           server
//-----------------------------
var wsClients={};
class UserMessageApplication{
  constructor(server){
    const expressWs = require('express-ws')(server);
    //init websocket
    wsClients={};
    server.ws('/', (ws, req) => {
      ws.on("message", function (message) {
        let msg = JSON.parse(message);
        if (msg.header == "init") {
          if(msg.body){
            wsClients[msg.body.email] = ws;
          }else{
            console.log("error in user");
            ws.send({
              header: "userMsg", body: {
                body: "User offline", date: new Date(),
                language: "english",
                sender: "server",
                recipient: null
              }
            });
          }
        } else if (msg.header == "userMsg") {
          if(wsClients){
            if(wsClients[msg.body.recipient.email]){
              wsClients[msg.body.recipient.email].send(JSON.stringify(msg));
            }
            else{
              wsClients[msg.body.sender.email].send({
                header: "userMsg", body: {
                  body: "User offline", date: msg.date,
                  language: user.preferred_language,
                  sender: "server",
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