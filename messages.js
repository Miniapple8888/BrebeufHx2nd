
//modify user info
$(document).ready(function () {
  sessionStorage.setItem("recipient", "miniapple888@gmail.com");

  // window.WebSocket = window.WebSocket || window.MozWebSocket;
  // ws = new WebSocket('ws://' + window.location.host);
  // //connection init
  // ws.on("open", function () {
  //   ws.send({ header: "init", body: user });
  // });
  // ws.on("message", function (message) {
  //   let msg = JSON.parse(message);
  //   if (msg.header == "initUser") {
  //     user = msg.body;
  //   } else if (msg.header == "userMsg") {
  //     console.log(msg.body);
  //   }
  // });

  // //boiler plate function to send msg
  // function sendMessage(){
  //   //rename to actual text field
  //   var text=$("#textfield").val();
  //   var userMainLang;
  //   ws.send({ header: "userMsg", body: { body: text, date: new Date(), language:userMainLang}});
  // }
});