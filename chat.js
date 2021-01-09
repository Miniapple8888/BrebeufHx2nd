var user;
var recipient;

$(document).ready(()=>{

  sessionStorage.setItem("recipient", "miniapple888@gmail.com");

  axios.post("/users/profile", {}).then((response) => {
    user = response.data.user;
  });
  axios.post("/users/get_user", {
    user_email: sessionStorage.getItem("recipient")
  }).then((response) => {
    recipient = response.data.user;
  });

  window.WebSocket = window.WebSocket || window.MozWebSocket;
  var ws = new WebSocket('ws://' + window.location.host);
  //connection init
  ws.onopen = function () {
    ws.send(JSON.stringify({ header: "init", body: user }));
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
    ws.onmessage=function(message){
      alert("new message\n"+message);
    };
  };
  ws.onmessage = function (message) {
    let msg = JSON.parse(message);
    if (msg.header == "userMsg") {
      console.log(msg.body);
    }
  };

});

