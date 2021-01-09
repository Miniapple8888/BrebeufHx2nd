
// When checking match
// Must be connected

var user;

$(document).ready(()=>{
    
      $('#disconnectButton').on('click', function() { // Disconnected button pressed event
          axios.post("/users/removeToken",{}).then((response)=> {// Check if valid session
              console.log(response);
              alert(response.data.message);
              window.location.replace("/login.html"); // Redirect to log in page
          });
      }); 
    
      axios.post("/users/profile",{}).then((response)=> { // Get user info and display full name
        console.log(response)
        user = response.data.user;
        let full_name = user.first_name + " " + user.last_name;
        
        $('#fullName').text(full_name); // Display full name
      });

      axios.post("/validate",{}).then( // Check if valid session
        (response)=> { //Check if logged in
        
        if (response.status == 200) { // OK status
            $('#disconnectButton').show();
            $('#match').show();
            displaySchedule(); // Display schedule
        } else {
            $('#disconnectButton').hide();
            $('#match').hide();
        }
      },
      (error) => { $('#disconnectButton').hide(); $('#match').hide(); });

});

function  displaySchedule() { // Display user schedule
    axios.post("/schedules",{ 
        user: user
    }).then((response)=> { // Get user info and display full name
        for (var i = 0; i < response.data.meetings.length; i++) {
            addScheduleEvent(response.data.meetings[i].name_meeting, "index.html", response.data.meetings[i].meeting_desc);
        }
    });
}

function addScheduleEvent(name, url, description) { // Add HTML object for the schedule
    $('#events').append(`
        <div class="media text-muted pt-3">
            <img data-src="holder.js/32x32?theme=thumb&bg=007bff&fg=007bff&size=1" alt="" class="mr-2 rounded">
            <p class="media-body pb-3 mb-0 small lh-125 border-bottom border-gray">
                <strong class="d-block text-gray-dark"><a href="${url}">@${name}</a></strong>
                ${description}
            </p>
        </div>
    `);
}

