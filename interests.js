$(document).ready(() =>{
    // retrieve user interests
    // retrieve all interests
    axios.post("/interests/list",{}).then((response)=> { 
        var interests = response.data.interests;
        for(var i=0;i<interests.length;i++) {
            var interest = interests[i];
            $('#interests').append("<li>"+ interest.interest_name+"<button type='button' class='btn btn-primary'>Add interests</button></li>");
        }
    });
      // add new interest
    $('#new-interest-button').on('click', () => {
        let interestname = $('#interest-name').val();
        if (interestname.length < 3) {
            alert("Must be minimum of 3 char");
        } else {
            axios.post("/interests/new", { // Send login http post request to server
                interestname:interestname
            }).then((response) => { // Server response event
                console.log(response);
                alert(response.data.message);
            });
        }
    })
})