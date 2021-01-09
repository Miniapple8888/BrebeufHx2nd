
//modify user info
$(document).ready(function () {

  axios.post("/validate",{}).then( // Check if valid session
    (response)=> { //Check if logged in
    
    if (response.status == 200) { // OK status
        $('#disconnectButton').show();
    } else {
        $('#disconnectButton').hide();
    }
  },
  (error) => { $('#disconnectButton').hide(); });

  $('#disconnectButton').on('click', function() { // Disconnected button pressed event
      axios.post("/users/removeToken",{}).then((response)=> {// Check if valid session
          console.log(response);
          alert(response.data.message);
          window.location.replace("/login.html"); // Redirect to login page
      });
  }); 

  sessionStorage.setItem("recipient", "miniapple888@gmail.com");
  
  // retrieve current user
  var user;
    axios.post("/users/profile", ()=>{}).then((response) => {
        user = response.data.user;
    });
    axios.post("/connections", { // Ask connections http post request to server
        user:user
    }).then((response)=> { // Server response event
        console.log(response);
    });

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