$(document).ready(()=>{
  axios.post("/users/profile",{}).then((response)=> { 
    var user=response.data.user;
    console.log(user);
    let name = user.first_name + " " + user.last_name;
    $('#name').text(name);
    $('#speaking-language').text("Speaking language: "+user.speaking_language);
    $('#preferred-language').text("Preferred language: "+user.preferred_language);
    $('#location').text("Location: "+user.location);
  });
});