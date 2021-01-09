
$(document).ready(() => {

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
            location.reload();
        });
    });

    $('#login-button').on('click', function() { // Login button pressed event

        var email = $('#email').val(); // Email input box
        var rawPassword = $('#password').val(); // Password input box

        // Validation
        if (email === "" || email == null) {

            alert("Email is invalid.")

        } else if (rawPassword.length < 6) {

            alert("A minimum password length of 6 characters is required.")

        } else {
            axios.post("/users/login", { // Send login http post request to server
                email: email, // Package
                password: rawPassword
            }).then((response)=> { // Server response event
                console.log(response);
                alert(response.data.message);
                window.location.replace("/profile.html"); // Redirect to profile page
            });
        }
    });
});
