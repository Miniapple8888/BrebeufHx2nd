
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

  $('#signup-button').on('click', function () { // Login button pressed event
    var email = $('#email').val(); // Email input box
    var firstName = $("#firstname").val();
    var lastName = $("#lastname").val();
    var rawPassword = $('#password').val(); // Password input box
    var rawConfirmPassword = $('#confirmpassword').val();
    //idk how you expect to get multiple languages spoken
    // select
    var speakLang = $("#select-speaking-language").children("option:selected").val();
  
    var prefLang = $("#select-preferred-language").children("option:selected").val();
    var location = $("#select-location").children("option:selected").val();
    var profilepic = $('#profilepic').val();
    // Validation
  
    //more confirmation of correct info stuff, can't be bothered rn
    if (email === "" || email == null) {
  
      alert("Email is invalid.")
  
    } else if (rawPassword.length < 6) {
  
      alert("A minimum password length of 6 characters is required.")
  
    } else {
      axios.post("/users/signup", { // Send login http post request to server
        email: email, // Package
        first_name: firstName,
        last_name: lastName,
        password: rawPassword,
        spoken_language:speakLang,
        preferred_language:prefLang,
        location:location,
        profilepic:profilepic
      }).then((response) => { // Server response event
        console.log(response);
        alert(response.data.message);
      });
    }
  });
});