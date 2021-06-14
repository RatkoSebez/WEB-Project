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
                $("#account").hide();
                $("#users").hide();
            }
            else{
                $("#login").hide();
                $("#register").hide();
                $("#logout").show();
                $("#account").show();
                if(user.role == "Admin"){
                $("#users").show();
                }
                else{
                    $("#users").hide();
                }
            }

            
            //alert(user.role);
            //alert(isLoggedIn);
        }
    });
});