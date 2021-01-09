var user;
var recipient;

$(document).ready(() => {

  sessionStorage.setItem("recipient", "antoinechevalier@me.com");

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
    $("#chat_box_input").on('keyup', function (e) {
      if (e.key === 'Enter' || e.keyCode === 13) {
        //rename to actual text field
        var text = $("#chat_box_input").val();
        $("#chat_box_input").val(""); // Clear input box
        ws.send(JSON.stringify({
          header: "userMsg", body:
          {
            body: text, date: new Date(),
            language: user.preferred_language,
            sender: user,
            recipient: recipient
          }
        }));
      }
    });
    ws.onmessage = function (message) {
      console.log(message.body);
      if (message.header =="userMsg"){
        console.log(message);
        alert("new message\n"+message.body.body);
      }
    };
  };
});

