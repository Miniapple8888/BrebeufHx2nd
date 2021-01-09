var user;
var recipient;
$(document).ready(()=>{
  axios.post("/users/profile", {}).then((response) => {
    user = response.data.user;
  });
  axios.post("/users/get_user", {
    user_email: sessionStorage.getItem("recipient")
  }).then((response) => {
    recipient = response.data.user;
  });

  window.WebSocket = window.WebSocket || window.MozWebSocket;
  var ws = new WebSocket('wss://' + window.location.host);
  //connection init
  ws.onopen= function () {
    ws.send({ header: "init", body: user });
  };
  ws.onmessage = function (message) {
    let msg = JSON.parse(message);
    if (msg.header == "userMsg") {
      console.log(msg.body);
    }
  };


  $("#chat_box_input").on('keyup', function (e) {
    if (e.key === 'Enter' || e.keyCode === 13) {
      //rename to actual text field
      var text = $("#chat_box_input").val();
      ws.send({
        header: "userMsg", body:
        {
          body: text, date: new Date(),
          language: user.preferred_language,
          sender: user,
          recipient: recipient
        }
      });
    }
  });
});

