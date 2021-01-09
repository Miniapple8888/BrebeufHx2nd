
// When checking match
// Must be connected

$(document).ready(()=>{

    axios.post("/validate",{}).then( // Check if valid session
        (response)=> { //Check if logged in
        
        if (response.status == 200) { // OK status
            $('#disconnectButton').show();
            $('#match').show();
        } else {
            $('#disconnectButton').hide();
            $('#match').hide();
        }
      },
      (error) => { $('#disconnectButton').hide(); $('#match').hide(); });
    
      $('#disconnectButton').on('click', function() { // Disconnected button pressed event
          axios.post("/users/removeToken",{}).then((response)=> {// Check if valid session
              console.log(response);
              alert(response.data.message);
              window.location.replace("/login.html");
          });
      }); 

    
})

