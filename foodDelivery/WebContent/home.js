$(document).ready(function(){
    $.get({
        url: "rest/userService/getLoggedInUser",
        success: function(user){
            //alert(user);
            //var isLoggedIn;
            //ako je korisnik ulogovan
            if(!user){
                $("#login").show();
                $("#register").show();
                $("#logout").hide();
            }
            else{
                $("#login").hide();
                $("#register").hide();
                $("#logout").show();
            }
            //alert(isLoggedIn);
        }
    });
});