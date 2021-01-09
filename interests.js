$(document).ready(() =>{
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