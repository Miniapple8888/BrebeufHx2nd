$(document).ready(()=>{

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
          window.location.replace("/login.html");
      });
  });   

  axios.post("/users/profile",{}).then((response)=> {
    console.log(response)
    let user = response.data.user;
    let full_name = user.first_name + " " + user.last_name;

    $('#name').text(full_name);
    $('#fullName').text(full_name);
    $('#email').text(user.email);
    $('#speaking-language').text(user.speaking_language);
    $('#preferred-language').text(user.preferred_language);
  });

});